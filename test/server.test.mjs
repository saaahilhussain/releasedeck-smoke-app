import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { createApp } from '../src/app.mjs';
test('v7 serves healthy HTTP responses and rejects unsupported requests', async () => {
  const server = createApp();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const health = await fetch(base + '/health');
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { application: 'releasedeck-smoke-app', status: 'ok', version: 'v7' });
    const root = await fetch(base + '/');
    assert.equal(root.status, 200);
    assert.equal((await root.json()).version, 'v7');
    assert.equal((await fetch(base + '/missing')).status, 404);
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
