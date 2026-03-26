/**
 * Debug 2: full GET-based batch flow
 */
import axios from 'axios';

const BASE = 'https://scrape.pleper.com/v3';
const API_KEY = '2e96cbc28ca69b3d08cdb1c84b92c361';
const API_SIG = '75b848d8a19631a5db4073e9b0ff65723e8506e3';

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function test() {
  // Step 1: Create batch
  console.log('Step 1: batch_create');
  const createRes = await axios.get(`${BASE}/batch_create`, {
    params: { api_key: API_KEY, api_sig: API_SIG, batch_id: 'new' }
  });
  console.log('Created:', JSON.stringify(createRes.data));
  const batchId = createRes.data['batch_id'] ?? createRes.data['batch-id'];
  console.log('batchId:', batchId);

  // Step 2: Queue a maps search
  console.log('\nStep 2: queue maps search');
  try {
    const searchRes = await axios.get(`${BASE}/google/search/maps`, {
      params: { api_key: API_KEY, api_sig: API_SIG, batch_id: batchId, query: "McDonald's Austin TX" }
    });
    console.log('Queue response:', JSON.stringify(searchRes.data));
  } catch(e: any) {
    console.error('Queue error:', e.response?.status, JSON.stringify(e.response?.data));
  }

  // Step 3: Commit
  console.log('\nStep 3: batch_commit');
  try {
    const commitRes = await axios.get(`${BASE}/batch_commit`, {
      params: { api_key: API_KEY, api_sig: API_SIG, batch_id: batchId }
    });
    console.log('Commit:', JSON.stringify(commitRes.data));
  } catch(e: any) {
    console.error('Commit error:', e.response?.status, JSON.stringify(e.response?.data));
  }

  // Step 4: Poll results
  console.log('\nStep 4: polling results...');
  for (let i = 0; i < 20; i++) {
    await sleep(3000);
    try {
      const resultsRes = await axios.get(`${BASE}/batch_get_results`, {
        params: { api_key: API_KEY, api_sig: API_SIG, batch_id: batchId }
      });
      console.log(`Poll ${i+1}:`, JSON.stringify(resultsRes.data).slice(0, 500));
      const d = resultsRes.data;
      if (d.batch_status === 'completed' || d.status === 'completed' ||
          (d.results && d.results.length > 0) || d.data) {
        console.log('\n✅ FULL RESULT:');
        console.log(JSON.stringify(resultsRes.data, null, 2));
        break;
      }
    } catch(e: any) {
      console.error('Poll error:', e.response?.status, JSON.stringify(e.response?.data));
    }
  }
}

test().catch(e => console.error('Fatal:', e.message, e.response?.data));
