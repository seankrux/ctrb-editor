/**
 * Debug 3: inspect exact queue response + try different endpoint patterns
 */
import axios from 'axios';

const BASE = 'https://scrape.pleper.com/v3';
const API_KEY = '2e96cbc28ca69b3d08cdb1c84b92c361';
const API_SIG = '75b848d8a19631a5db4073e9b0ff65723e8506e3';

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function createBatch(): Promise<number> {
  const res = await axios.get(`${BASE}/batch_create`, {
    params: { api_key: API_KEY, api_sig: API_SIG, batch_id: 'new' }
  });
  return res.data['batch_id'] ?? res.data['batch-id'];
}

async function testEndpoint(label: string, url: string, params: Record<string, any>) {
  console.log(`\n--- ${label} ---`);
  try {
    const res = await axios.get(url, { params });
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
    return res.data;
  } catch(e: any) {
    console.error('Error:', e.response?.status, JSON.stringify(e.response?.data));
    return null;
  }
}

async function main() {
  const batchId = await createBatch();
  console.log('batchId:', batchId);

  const auth = { api_key: API_KEY, api_sig: API_SIG };

  // Try various queue approaches
  await testEndpoint(
    'Maps search with query',
    `${BASE}/google/search/maps`,
    { ...auth, batch_id: batchId, query: "McDonald's Austin TX", language: 'en' }
  );

  await testEndpoint(
    'Maps search with keyword',
    `${BASE}/google/search/maps`,
    { ...auth, batch_id: batchId, keyword: "McDonald's Austin TX" }
  );

  await testEndpoint(
    'Profile info by CID URL',
    `${BASE}/google/by-profile/information`,
    { ...auth, batch_id: batchId, profile_url: 'https://www.google.com/maps?cid=5766352990099467929' }
  );

  // Commit
  const commitRes = await axios.get(`${BASE}/batch_commit`, {
    params: { ...auth, batch_id: batchId }
  });
  console.log('\nCommit:', JSON.stringify(commitRes.data));

  // Poll a few times
  for (let i = 0; i < 10; i++) {
    await sleep(3000);
    const res = await axios.get(`${BASE}/batch_get_results`, {
      params: { ...auth, batch_id: batchId }
    });
    console.log(`Poll ${i+1}:`, JSON.stringify(res.data).slice(0, 800));
    if (res.data.status === 'Done' || res.data.results?.length > 0 || res.data.data) {
      console.log('\n✅ FULL:');
      console.log(JSON.stringify(res.data, null, 2));
      break;
    }
  }
}

main().catch(e => console.error('Fatal:', e.message, e.response?.data));
