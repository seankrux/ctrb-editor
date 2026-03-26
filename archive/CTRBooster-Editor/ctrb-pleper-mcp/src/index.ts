#!/usr/bin/env node
/**
 * CTR Booster × Pleper MCP Server
 *
 * Tools:
 *   lookup_gmb          - Find brand GMB by name → CID, place_id, kg_id, lat/lng
 *   lookup_gmb_nearby   - Find brand GMB + 10-12 nearby location CIDs + unique URLs
 *   bulk_lookup_gmb     - Batch lookup multiple brands
 *   get_profile_info    - Full profile data by URL or CID
 *   build_gmb_url       - Build a brand GMB URL from a specific lat/lng viewpoint
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { searchBrand, searchNearby, bulkSearchBrands, getProfileInfo, geocodeCity } from './pleper.js';
import { buildGmbResult, buildBrandUrlFromNearby } from './gmb-urls.js';

const server = new McpServer({
  name: 'ctrb-pleper-mcp',
  version: '1.0.0',
  description: 'Pleper GMB lookup for CTR Booster campaign generation',
});

// ── Tool: lookup_gmb ─────────────────────────────────────────────────────────
server.tool(
  'lookup_gmb',
  'Find a brand\'s Google My Business listing. Returns CID (→AuthorId), place_id, kg_id, profile URL (→TargetUrl), and coordinates.',
  {
    brand_name: z.string().describe('Brand or business name, e.g. "McDonald\'s Austin TX" or "Joe\'s Pizza"'),
    location: z.string().optional().describe('City and state if not included in brand_name, e.g. "Austin, TX"'),
    country: z.string().optional().default('us').describe('ISO country code, default "us"'),
  },
  async ({ brand_name, location, country }) => {
    const query = location ? `${brand_name} ${location}` : brand_name;
    process.stderr.write(`[lookup_gmb] Searching: "${query}"\n`);

    const loc = location ?? brand_name;
    const result = await searchBrand(brand_name, loc);
    if (!result) {
      return { content: [{ type: 'text', text: JSON.stringify({ error: `No results found for "${brand_name}" near "${loc}"` }) }] };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          name: result.name,
          cid: result.cid,
          place_id: result.place_id,
          kg_id: result.kg_id,
          profile_url: result.profile_url,
          latitude: result.latitude,
          longitude: result.longitude,
          address: result.address,
          phone: result.phone,
          website: result.website,
          rating: result.rating,
          review_count: result.review_count,
          categories: result.categories,
          // Pre-mapped CTR Booster fields
          ctr_booster: {
            AuthorId: result.cid,
            TargetUrl: result.profile_url,
            TargetName: result.name,
          }
        }, null, 2)
      }]
    };
  }
);

// ── Tool: lookup_gmb_nearby ──────────────────────────────────────────────────
server.tool(
  'lookup_gmb_nearby',
  `Find a brand GMB + nearby location CIDs + generate unique GMB URLs.

  Returns:
  - Brand: CID, place_id, kg_id, lat/lng (for AuthorId, TargetUrl in CTR Booster)
  - Nearby: 10-12 real businesses around the brand, each with unique CID + coordinates
  - 10-12 unique Google Maps URLs: each loads the BRAND GMB but from a nearby location's viewpoint
  - ctr_booster_config: ready-to-use AuthorId, TargetUrl, lstCustomGeolocations`,
  {
    brand_name: z.string().describe('Brand name, e.g. "Starbucks" or "McDonald\'s Times Square"'),
    location: z.string().optional().describe('City and state, e.g. "Austin, TX"'),
    country: z.string().optional().default('us'),
    nearby_count: z.number().int().min(5).max(20).optional().default(10)
      .describe('Number of nearby locations to find (default 10)'),
    nearby_category: z.string().optional().default('business')
      .describe('Category of nearby businesses to search for, e.g. "restaurant", "hotel", "business"'),
  },
  async ({ brand_name, location, country, nearby_count, nearby_category }) => {
    const query = location ? `${brand_name} ${location}` : brand_name;
    const count = nearby_count ?? 10;

    process.stderr.write(`[lookup_gmb_nearby] Step 1: Looking up brand "${query}"\n`);

    // Step 1: Find the brand
    const loc = location ?? brand_name;
    const brand = await searchBrand(brand_name, loc);
    if (!brand) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: `Brand not found: "${brand_name}" near "${loc}"` })
        }]
      };
    }

    process.stderr.write(
      `[lookup_gmb_nearby] Found brand: ${brand.name} | CID: ${brand.cid} | ` +
      `lat: ${brand.latitude}, lng: ${brand.longitude}\n`
    );

    // Step 2: Find nearby businesses
    process.stderr.write(
      `[lookup_gmb_nearby] Step 2: Searching ${count} nearby "${nearby_category ?? 'business'}" locations...\n`
    );

    const nearbyBrands = await searchNearby(
      brand.latitude,
      brand.longitude,
      nearby_category ?? 'business',
      count
    );

    process.stderr.write(
      `[lookup_gmb_nearby] Found ${nearbyBrands.length} nearby locations\n`
    );

    // Step 3: Build full result with URLs and CTR Booster config
    const result = buildGmbResult(brand, nearbyBrands);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

// ── Tool: bulk_lookup_gmb ────────────────────────────────────────────────────
server.tool(
  'bulk_lookup_gmb',
  'Look up multiple brands in a single batch via Pleper API. Returns CID, place_id, and GMB URL for each.',
  {
    brands: z.array(z.object({
      id: z.string().describe('Your reference ID for this brand (e.g. row number, slug)'),
      brand_name: z.string(),
      location: z.string().optional().describe('City, State'),
      country: z.string().optional().default('us'),
    })).min(1).max(50),
  },
  async ({ brands }) => {
    const queries = brands.map(b => ({
      id: b.id,
      query: b.location ? `${b.brand_name} ${b.location}` : b.brand_name,
      country: b.country ?? 'us',
    }));

    process.stderr.write(`[bulk_lookup_gmb] Batch lookup: ${queries.length} brands\n`);

    // Geocode all locations in parallel
    const geocoded = await Promise.all(
      brands.map(async b => {
        const loc = b.location ?? b.brand_name;
        const geo = await geocodeCity(loc);
        return { id: b.id, keyword: b.brand_name, lat: geo?.lat ?? 0, lng: geo?.lng ?? 0, geo };
      })
    );
    const validItems = geocoded.filter(g => g.geo !== null);
    if (validItems.length === 0) {
      return { content: [{ type: 'text', text: JSON.stringify({ error: 'Could not geocode any of the provided locations' }) }] };
    }
    const results = await bulkSearchBrands(validItems);

    const output = results.map(r => ({
      id: r.id,
      found: !!r.result,
      name: r.result?.name ?? null,
      cid: r.result?.cid ?? null,
      place_id: r.result?.place_id ?? null,
      kg_id: r.result?.kg_id ?? null,
      profile_url: r.result?.profile_url ?? null,
      latitude: r.result?.latitude ?? null,
      longitude: r.result?.longitude ?? null,
      address: r.result?.address ?? null,
      ctr_booster: r.result ? {
        AuthorId: r.result.cid,
        TargetUrl: r.result.profile_url,
        TargetName: r.result.name,
      } : null,
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          total: queries.length,
          found: output.filter(o => o.found).length,
          not_found: output.filter(o => !o.found).length,
          results: output,
        }, null, 2)
      }]
    };
  }
);

// ── Tool: get_profile_info ───────────────────────────────────────────────────
server.tool(
  'get_profile_info',
  'Get full GMB profile details by Google Maps URL or CID. Returns all fields including hours, images count, reviews summary.',
  {
    profile_url: z.string().describe(
      'Google Maps URL or CID URL, e.g. "https://www.google.com/maps?cid=1234567890" or "https://www.google.com/maps/place/..."'
    ),
  },
  async ({ profile_url }) => {
    process.stderr.write(`[get_profile_info] Fetching: ${profile_url}\n`);
    const result = await getProfileInfo(profile_url);
    if (!result) {
      return { content: [{ type: 'text', text: JSON.stringify({ error: 'Profile not found' }) }] };
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

// ── Tool: build_gmb_url ──────────────────────────────────────────────────────
server.tool(
  'build_gmb_url',
  'Build a Google Maps URL that loads a brand\'s GMB listing from a specific nearby lat/lng viewpoint.',
  {
    brand_name: z.string(),
    brand_cid: z.string().describe('Brand CID (from lookup_gmb → cid field)'),
    brand_place_id: z.string().describe('Brand place_id (ChIJ... format)'),
    brand_kg_id: z.string().optional().describe('Brand kg_id (/g/... format)'),
    brand_lat: z.number(),
    brand_lng: z.number(),
    viewport_lat: z.number().describe('Latitude of the nearby location (viewpoint)'),
    viewport_lng: z.number().describe('Longitude of the nearby location (viewpoint)'),
    zoom: z.number().int().min(10).max(20).optional().default(14),
  },
  async (input) => {
    const url = buildBrandUrlFromNearby(
      {
        name: input.brand_name,
        cid: input.brand_cid,
        place_id: input.brand_place_id,
        kg_id: input.brand_kg_id ?? '',
        latitude: input.brand_lat,
        longitude: input.brand_lng,
      },
      input.viewport_lat,
      input.viewport_lng,
      input.zoom ?? 14
    );
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ url }, null, 2)
      }]
    };
  }
);

// ── Start ─────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write('ctrb-pleper-mcp ready\n');
