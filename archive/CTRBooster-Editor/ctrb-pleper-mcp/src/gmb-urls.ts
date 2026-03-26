/**
 * Google Maps URL Builder
 *
 * Generates unique GMB URLs that:
 * 1. Load the BRAND's GMB listing when clicked (brand CID is embedded)
 * 2. Are unique per nearby location (different viewport lat/lng)
 *
 * Format: https://www.google.com/maps/place/BRAND_NAME/@NEARBY_LAT,NEARBY_LNG,14z/data=...BRAND_PLACE_ID...
 */

import type { BusinessResult } from './pleper.js';

export interface NearbyLocation {
  index: number;           // 1-based
  name: string;            // Nearby business name
  cid: string;             // Nearby location's CID
  place_id: string;        // Nearby location's place_id
  latitude: number;
  longitude: number;
  address: string;
  distance_miles: number;
  gmb_url: string;         // Unique URL → loads BRAND GMB from this location's perspective
}

export interface GmbLookupResult {
  brand: {
    name: string;
    cid: string;           // → goes into AuthorId in CTR Booster
    place_id: string;
    kg_id: string;
    profile_url: string;   // → goes into TargetUrl in CTR Booster
    latitude: number;
    longitude: number;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    review_count?: number;
    categories?: string[];
  };
  nearby: NearbyLocation[];
  ctr_booster_config: {
    AuthorId: string;            // = brand.cid
    TargetUrl: string;           // = brand.profile_url
    TargetName: string;          // = brand.name
    lstCustomGeolocations: string[]; // ["lat:lng", ...] from nearby + extra scatter
    generated_urls: string[];    // 10 unique GMB URLs for traffic simulation
  };
}

/**
 * Build a unique Google Maps URL that loads the BRAND GMB listing
 * but with the viewport centered on a nearby location.
 *
 * This is the key URL format used by CTR Booster for GMB campaigns:
 * - The @LAT,LNG part sets the map viewport (nearby location)
 * - The data=... part encodes the brand's place_id (so clicking always loads brand)
 * - The cid= suffix is the brand CID as fallback
 */
export function buildBrandUrlFromNearby(
  brand: Pick<BusinessResult, 'name' | 'cid' | 'place_id' | 'kg_id' | 'latitude' | 'longitude'>,
  nearbyLat: number,
  nearbyLng: number,
  zoomLevel: number = 14
): string {
  const encodedName = encodeURIComponent(brand.name.replace(/\s+/g, '+'));
  const kgEncoded = brand.kg_id
    ? '!16s' + encodeURIComponent(brand.kg_id)
    : '';

  // Format: Google Maps place URL with nearby viewport + brand place_id in data
  if (brand.place_id) {
    return (
      `https://www.google.com/maps/place/${encodedName}/` +
      `@${nearbyLat.toFixed(6)},${nearbyLng.toFixed(6)},${zoomLevel}z/` +
      `data=!4m6!3m5!1s${brand.place_id}` +
      `!8m2!3d${brand.latitude.toFixed(7)}!4d${brand.longitude.toFixed(7)}` +
      kgEncoded
    );
  }

  // Fallback: simple CID URL (always loads brand GMB)
  return `https://www.google.com/maps?cid=${brand.cid}`;
}

/**
 * Assemble the full lookup result including URLs and CTR Booster config
 */
export function buildGmbResult(
  brand: BusinessResult,
  nearbyBusinesses: BusinessResult[]
): GmbLookupResult {
  const nearby: NearbyLocation[] = nearbyBusinesses.map((nb, i) => ({
    index: i + 1,
    name: nb.name,
    cid: nb.cid,
    place_id: nb.place_id,
    latitude: nb.latitude,
    longitude: nb.longitude,
    address: nb.address,
    distance_miles: haversineMiles(brand.latitude, brand.longitude, nb.latitude, nb.longitude),
    gmb_url: buildBrandUrlFromNearby(brand, nb.latitude, nb.longitude),
  }));

  // Build lstCustomGeolocations: nearby business coords + scatter points around brand
  const geolocations = [
    `${brand.latitude.toFixed(6)}:${brand.longitude.toFixed(6)}`, // Brand itself
    ...nearby.map(n => `${n.latitude.toFixed(6)}:${n.longitude.toFixed(6)}`),
    ...generateScatterPoints(brand.latitude, brand.longitude, 20),
  ];

  return {
    brand: {
      name: brand.name,
      cid: brand.cid,
      place_id: brand.place_id,
      kg_id: brand.kg_id,
      profile_url: brand.profile_url || `https://www.google.com/maps?cid=${brand.cid}`,
      latitude: brand.latitude,
      longitude: brand.longitude,
      address: brand.address,
      phone: brand.phone,
      website: brand.website,
      rating: brand.rating,
      review_count: brand.review_count,
      categories: brand.categories,
    },
    nearby,
    ctr_booster_config: {
      AuthorId: brand.cid,
      TargetUrl: brand.profile_url || `https://www.google.com/maps?cid=${brand.cid}`,
      TargetName: brand.name,
      lstCustomGeolocations: geolocations,
      generated_urls: nearby.map(n => n.gmb_url),
    },
  };
}

// ── Geo helpers ───────────────────────────────────────────────────────────────

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Generate random scatter points within radiusMiles of center
 * for lstCustomGeolocations padding
 */
function generateScatterPoints(
  lat: number,
  lng: number,
  count: number,
  radiusMiles: number = 5
): string[] {
  const MILES_PER_DEG_LAT = 69.0;
  const milesPerDegLng = 69.0 * Math.cos((lat * Math.PI) / 180);
  const radiusDegLat = radiusMiles / MILES_PER_DEG_LAT;
  const radiusDegLng = radiusMiles / milesPerDegLng;

  const points: string[] = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const theta = 2 * Math.PI * Math.random();
    const r = Math.sqrt(u);
    const pLat = lat + r * radiusDegLat * Math.cos(theta);
    const pLng = lng + r * radiusDegLng * Math.sin(theta);
    points.push(`${pLat.toFixed(6)}:${pLng.toFixed(6)}`);
  }
  return points;
}
