/**
 * Debug: test Pleper API directly to see exact request/response format
 */
import axios from 'axios';
const BASE = 'https://scrape.pleper.com/v3';
const API_KEY = '2e96cbc28ca69b3d08cdb1c84b92c361';
const API_SIG = '75b848d8a19631a5db4073e9b0ff65723e8506e3';
async function test() {
    // Test 1: batch_create
    console.log('\n=== Test 1: batch_create ===');
    try {
        const r = await axios.post(`${BASE}/batch_create`, {
            api_key: API_KEY,
            api_sig: API_SIG,
            batch_id: 'new',
        });
        console.log('Status:', r.status);
        console.log('Response:', JSON.stringify(r.data, null, 2));
    }
    catch (e) {
        console.error('Error:', e.response?.status, JSON.stringify(e.response?.data));
    }
    // Test 2: maps search with batch_id = "new" (auto-create)
    console.log('\n=== Test 2: google/search/maps with batch_id=new ===');
    try {
        const r = await axios.post(`${BASE}/google/search/maps`, {
            api_key: API_KEY,
            api_sig: API_SIG,
            batch_id: 'new',
            query: "McDonald's Austin TX",
        });
        console.log('Status:', r.status);
        console.log('Response:', JSON.stringify(r.data, null, 2));
    }
    catch (e) {
        console.error('Error:', e.response?.status, JSON.stringify(e.response?.data));
    }
    // Test 3: GET instead of POST for batch_create
    console.log('\n=== Test 3: GET batch_create ===');
    try {
        const r = await axios.get(`${BASE}/batch_create`, {
            params: { api_key: API_KEY, api_sig: API_SIG, batch_id: 'new' }
        });
        console.log('Status:', r.status);
        console.log('Response:', JSON.stringify(r.data, null, 2));
    }
    catch (e) {
        console.error('Error:', e.response?.status, JSON.stringify(e.response?.data));
    }
    // Test 4: Try form-encoded POST
    console.log('\n=== Test 4: Form-encoded POST to maps search ===');
    try {
        const params = new URLSearchParams();
        params.set('api_key', API_KEY);
        params.set('api_sig', API_SIG);
        params.set('batch_id', 'new');
        params.set('query', "McDonald's Austin TX");
        const r = await axios.post(`${BASE}/google/search/maps`, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log('Status:', r.status);
        console.log('Response:', JSON.stringify(r.data, null, 2));
    }
    catch (e) {
        console.error('Error:', e.response?.status, JSON.stringify(e.response?.data));
    }
}
test().catch(console.error);
