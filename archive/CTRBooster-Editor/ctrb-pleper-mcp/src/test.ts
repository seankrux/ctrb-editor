/**
 * Standalone live test — no MCP layer
 * Usage:
 *   node --loader ts-node/esm src/test.ts
 *   BRAND="Starbucks" LOCATION="Chicago, IL" NEARBY=12 node --loader ts-node/esm src/test.ts
 */

import { searchBrand, searchNearby, geocodeCity } from './pleper.js';
import { buildGmbResult } from './gmb-urls.js';
import { writeFileSync } from 'fs';

const brand_name    = process.env.BRAND    ?? "McDonald's";
const location      = process.env.LOCATION ?? 'Austin, TX';
const nearby_count  = parseInt(process.env.NEARBY ?? '10');
const nearby_cat    = process.env.CATEGORY ?? 'business';

async function main() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`CTR Booster GMB Lookup — Live Test`);
  console.log(`Brand: "${brand_name}" | Location: "${location}" | Nearby: ${nearby_count}`);
  console.log(`${'═'.repeat(70)}\n`);

  // Step 1: Brand lookup
  console.log('Step 1: Locating brand GMB via Pleper...');
  const brand = await searchBrand(brand_name, location);

  if (!brand) {
    console.error(`❌ Brand not found: "${brand_name}" near "${location}"`);
    process.exit(1);
  }

  console.log(`\n✅ BRAND FOUND`);
  console.log(`  Name:        ${brand.name}`);
  console.log(`  CID:         ${brand.cid}   ← AuthorId`);
  console.log(`  place_id:    ${brand.place_id}`);
  console.log(`  kg_id:       ${brand.kg_id}`);
  console.log(`  Profile URL: ${brand.profile_url}  ← TargetUrl`);
  console.log(`  Lat/Lng:     ${brand.latitude}, ${brand.longitude}`);
  console.log(`  Address:     ${brand.address}`);
  if (brand.rating) console.log(`  Rating:      ${brand.rating} (${brand.review_count} reviews)`);
  if (brand.categories) console.log(`  Categories:  ${brand.categories.join(', ')}`);

  // Step 2: Nearby locations
  console.log(`\nStep 2: Finding ${nearby_count} nearby locations (category: "${nearby_cat}")...`);
  const nearby = await searchNearby(brand.latitude, brand.longitude, nearby_cat, nearby_count);

  if (nearby.length === 0) {
    console.warn('⚠️  No nearby locations found.');
  } else {
    console.log(`\n✅ NEARBY LOCATIONS (${nearby.length} found):`);
    nearby.forEach((nb, i) => {
      console.log(`\n  [${i + 1}] ${nb.name}`);
      console.log(`      CID:      ${nb.cid}`);
      console.log(`      place_id: ${nb.place_id}`);
      console.log(`      Address:  ${nb.address}`);
      console.log(`      Lat/Lng:  ${nb.latitude}, ${nb.longitude}`);
    });
  }

  // Step 3: Build full result + unique URLs
  console.log('\nStep 3: Building GMB URLs and CTR Booster config...');
  const result = buildGmbResult(brand, nearby);

  console.log(`\n${'═'.repeat(70)}`);
  console.log('CTR BOOSTER CONFIG (ready to use):');
  console.log(`${'═'.repeat(70)}`);
  console.log(`AuthorId:   ${result.ctr_booster_config.AuthorId}`);
  console.log(`TargetUrl:  ${result.ctr_booster_config.TargetUrl}`);
  console.log(`TargetName: ${result.brand.name}`);
  console.log(`\nGeo Points: ${result.ctr_booster_config.lstCustomGeolocations.length} total`);
  console.log(`  First 3: ${result.ctr_booster_config.lstCustomGeolocations.slice(0, 3).join(' | ')}`);

  console.log(`\n${'─'.repeat(70)}`);
  console.log(`UNIQUE GMB URLs (${result.ctr_booster_config.generated_urls.length} total):`);
  console.log('Each URL loads YOUR brand GMB from a different nearby location viewpoint:');
  result.nearby.forEach((nb, i) => {
    const url = result.ctr_booster_config.generated_urls[i];
    if (!url) return;
    console.log(`\n  [${i + 1}] Viewpoint: ${nb.name}`);
    console.log(`      Nearby CID: ${nb.cid} | Distance: ${nb.distance_miles} mi`);
    console.log(`      URL: ${url}`);
  });

  // Save to JSON
  const outFile = `gmb_lookup_${Date.now()}.json`;
  writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log(`\n✅ Full result saved → ${outFile}`);
  console.log(`   Queries used: ~${nearby.length + 4} | Your API has ~9000 remaining`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  if (err.response?.data) console.error('API error:', JSON.stringify(err.response.data));
  process.exit(1);
});
