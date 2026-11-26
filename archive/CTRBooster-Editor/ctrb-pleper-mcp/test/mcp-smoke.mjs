import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

test('upgraded MCP and Zod preserve discovery, URL output and input validation', async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['dist/index.js'],
    env: { ...process.env, PLEPER_API_KEY: 'unused-in-offline-test', PLEPER_API_SIG: 'unused-in-offline-test' },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'dependency-smoke', version: '1.0.0' });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map(({ name }) => name).sort(), [
      'build_gmb_url', 'bulk_lookup_gmb', 'get_profile_info', 'lookup_gmb', 'lookup_gmb_nearby',
    ]);
    const args = {
      brand_name: 'Example Business', brand_cid: '12345', brand_place_id: 'ChIJexample',
      brand_lat: 30, brand_lng: -97, viewport_lat: 30.1, viewport_lng: -97.1,
    };
    const result = await client.callTool({ name: 'build_gmb_url', arguments: args });
    assert.ok(!result.isError);
    const url = new URL(JSON.parse(result.content[0].text).url);
    assert.equal(url.hostname, 'www.google.com');
    assert.match(url.pathname, /@30\.100000,-97\.100000,14z/);
    const invalid = await client.callTool({ name: 'build_gmb_url', arguments: { ...args, zoom: 99 } });
    assert.equal(invalid.isError, true);
  } finally {
    await client.close();
  }
});
