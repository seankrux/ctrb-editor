/**
 * Pleper API Client — correct format (verified against live API)
 *
 * Protocol:
 *   batch_create          GET  ?api_key=&api_sig=&batch_id=new
 *   google/search/maps    POST form-encoded: keyword + latitude + longitude + batch_id
 *   by-profile/information POST form-encoded: profile_url + batch_id
 *   batch_commit          GET  ?api_key=&api_sig=&batch_id=N
 *   batch_get_results     GET  ?api_key=&api_sig=&batch_id=N  → status:"Finished", results:{...}
 */

import axios from 'axios';

const BASE_URL = 'https://scrape.pleper.com/v3';
const API_KEY = process.env.PLEPER_API_KEY ?? '2e96cbc28ca69b3d08cdb1c84b92c361';
const API_SIG = process.env.PLEPER_API_SIG ?? '75b848d8a19631a5db4073e9b0ff65723e8506e3';
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;

const http = axios.create({ baseURL: BASE_URL, timeout: 30000 });

function auth() {
  return { api_key: API_KEY, api_sig: API_SIG };
}

function toForm(data: Record<string, any>): string {
  return new URLSearchParams(
    Object.entries(data).reduce((a, [k, v]) => ({ ...a, [k]: String(v) }), {})
  ).toString();
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export interface BusinessResult {
  name: string;
  cid: string;
  place_id: string;
  kg_id: string;
  business_profile_id: string;
  profile_url: string;
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  categories?: string[];
}

function normalize(raw: any): BusinessResult {
  const cid = String(raw.cid ?? '');
  return {
    name: raw.name ?? '',
    cid,
    place_id: raw.place_id ?? '',
    kg_id: raw.kg_id ?? '',
    business_profile_id: String(raw.business_profile_id ?? ''),
    profile_url: raw.profile_url ?? (cid ? `https://www.google.com/maps?cid=${cid}` : ''),
    latitude: parseFloat(String(raw.latitude ?? 0)),
    longitude: parseFloat(String(raw.longitude ?? 0)),
    address: raw.address ?? '',
    city: raw.city ?? undefined,
    state: raw.state ?? undefined,
    phone: raw.phone_number ?? undefined,
    website: Array.isArray(raw.website) ? raw.website[0] : raw.website ?? undefined,
    rating: raw.rating !== undefined ? parseFloat(String(raw.rating)) : undefined,
    review_count: raw.review_count ?? raw.reviews_count ?? undefined,
    categories: raw.categories ?? undefined,
  };
}

// ── Batch runner ──────────────────────────────────────────────────────────────

interface Job {
  endpoint: string;
  formData: Record<string, any>;
}

interface BatchResults {
  [endpoint: string]: Array<{
    payload: any;
    status: string;
    job_id: number;
    results: Record<string, any>; // numbered "1", "2", ...
  }>;
}

async function runBatch(jobs: Job[]): Promise<BatchResults> {
  // 1. Create batch
  const createRes = await http.get('/batch_create', { params: { ...auth(), batch_id: 'new' } });
  const batchId: number = createRes.data.batch_id ?? createRes.data['batch-id'];

  // 2. Queue jobs (POST form-encoded)
  await Promise.all(jobs.map(j =>
    http.post(`/${j.endpoint}`, toForm({ ...auth(), ...j.formData, batch_id: batchId }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  ));

  // 3. Commit
  await http.get('/batch_commit', { params: { ...auth(), batch_id: batchId } });

  // 4. Poll until Finished
  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(POLL_INTERVAL_MS);
    const res = await http.get('/batch_get_results', { params: { ...auth(), batch_id: batchId } });
    const d = res.data;
    if (d.status === 'Finished') {
      return d.results as BatchResults;
    }
    process.stderr.write(`[pleper] batch ${batchId} status: ${d.status} (${i + 1}/${MAX_POLLS})\n`);
  }
  throw new Error(`Batch ${batchId} timed out`);
}

// ── Geocoding (Nominatim) — no API key needed ─────────────────────────────────

export async function geocodeCity(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: location, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'ctrb-pleper-mcp/1.0' },
      timeout: 10000,
    });
    if (res.data?.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
      };
    }
  } catch (e) {
    process.stderr.write(`[geocode] Error for "${location}": ${(e as Error).message}\n`);
  }
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Search for a brand GMB by name + location.
 * location: city/state string e.g. "Austin, TX" — geocoded to lat/lng for Pleper
 */
export async function searchBrand(brandName: string, location: string): Promise<BusinessResult | null> {
  // Geocode city first
  const geo = await geocodeCity(location);
  if (!geo) throw new Error(`Could not geocode location: "${location}"`);

  const results = await runBatch([{
    endpoint: 'google/search/maps',
    formData: { keyword: brandName, latitude: String(geo.lat), longitude: String(geo.lng) }
  }]);

  const jobs = results['google/search/maps'] ?? [];
  if (!jobs[0]?.results) return null;

  // First result (position "1")
  const first = jobs[0].results['1'];
  return first ? normalize(first) : null;
}

/**
 * Get all search results (multiple businesses) around a lat/lng
 */
export async function searchNearby(
  lat: number,
  lng: number,
  keyword: string = 'business',
  count: number = 10
): Promise<BusinessResult[]> {
  // Fan out searches in multiple directions to get different businesses
  const offsets = spreadOffsets(lat, lng, Math.ceil(count / 3));

  const jobs: Job[] = offsets.map(o => ({
    endpoint: 'google/search/maps',
    formData: { keyword, latitude: String(o.lat), longitude: String(o.lng) }
  }));

  const results = await runBatch(jobs);
  const jobResults = results['google/search/maps'] ?? [];

  const businesses: BusinessResult[] = [];
  const seenCids = new Set<string>();

  for (const job of jobResults) {
    for (const [, raw] of Object.entries(job.results ?? {})) {
      const b = normalize(raw as any);
      if (!b.cid || seenCids.has(b.cid)) continue;
      seenCids.add(b.cid);
      businesses.push(b);
      if (businesses.length >= count) return businesses;
    }
  }

  return businesses;
}

/**
 * Get full profile info by profile_url (CID URL or place_id)
 */
export async function getProfileInfo(profileUrl: string): Promise<BusinessResult | null> {
  const results = await runBatch([{
    endpoint: 'google/by-profile/information',
    formData: { profile_url: profileUrl }
  }]);

  const jobs = results['google/by-profile/information'] ?? [];
  if (!jobs[0]?.results) return null;

  const first = Object.values(jobs[0].results)[0];
  return first ? normalize(first as any) : null;
}

/**
 * Bulk search: multiple brands at once, all in one batch
 */
export async function bulkSearchBrands(
  items: Array<{ id: string; keyword: string; lat: number; lng: number }>
): Promise<Array<{ id: string; result: BusinessResult | null }>> {
  const jobs: Job[] = items.map(item => ({
    endpoint: 'google/search/maps',
    formData: { keyword: item.keyword, latitude: String(item.lat), longitude: String(item.lng) }
  }));

  const results = await runBatch(jobs);
  const jobResults = results['google/search/maps'] ?? [];

  return items.map((item, i) => {
    const job = jobResults[i];
    const first = job?.results?.['1'];
    return { id: item.id, result: first ? normalize(first) : null };
  });
}

// ── Geo helper ────────────────────────────────────────────────────────────────

/**
 * Spread search points around center in different directions.
 * count = number of direction points (each returns ~10 results)
 */
function spreadOffsets(
  lat: number,
  lng: number,
  count: number
): Array<{ lat: number; lng: number }> {
  const MILES_PER_DEG_LAT = 69.0;
  const mpDLng = 69.0 * Math.cos((lat * Math.PI) / 180);

  // Directions: N, NE, E, SE, S, SW, W, NW + intermediates
  const angles = [0, 45, 90, 135, 180, 225, 270, 315, 22, 67, 112, 157, 202, 247, 292, 337];
  const distances = [1.0, 2.0, 3.0]; // miles

  const points: Array<{ lat: number; lng: number }> = [{ lat, lng }]; // center
  for (const dist of distances) {
    for (const deg of angles) {
      const rad = (deg * Math.PI) / 180;
      points.push({
        lat: lat + (dist * Math.cos(rad)) / MILES_PER_DEG_LAT,
        lng: lng + (dist * Math.sin(rad)) / mpDLng,
      });
      if (points.length >= count) return points;
    }
  }
  return points.slice(0, count);
}
