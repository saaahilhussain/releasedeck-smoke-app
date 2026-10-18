import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

test('built runtime starts both directly and when imported by a process-manager wrapper', async (t) => {
  await import('../build.mjs');
  const entry = fileURLToPath(new URL('../dist/server.mjs', import.meta.url));
  for (const mode of ['direct', 'imported']) {
    await t.test(mode, { timeout: 10000 }, async () => {
      const args = mode === 'direct' ? [entry] : [
        '--input-type=module', '-e',
        'await import(' + JSON.stringify(pathToFileURL(entry).href) + ')'
      ];
      const child = spawn(process.execPath, args, { env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
      let stdout = '', stderr = '';
      child.stdout.on('data', (data) => { stdout += data; });
      child.stderr.on('data', (data) => { stderr += data; });
      const ended = once(child, 'exit');
      try {
        let ready = false;
        for (let attempt = 0; attempt < 100; attempt++) {
          if (stdout.includes('listening on 127.0.0.1:')) { ready = true; break; }
          if (child.exitCode !== null) break;
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
        assert.ok(ready, 'Runtime did not listen: ' + stdout + stderr);
        const port = /listening on 127\.0\.0\.1:(\d+)/.exec(stdout)[1];
        const health = await fetch('http://127.0.0.1:' + port + '/health');
        assert.equal(health.status, 200);
        assert.deepEqual(await health.json(), { application: 'releasedeck-smoke-app', status: 'ok', version: 'v4' });
        const root = await fetch('http://127.0.0.1:' + port + '/');
        assert.equal(root.status, 200);
        assert.equal((await root.json()).version, 'v4');
      } finally {
        if (child.exitCode === null) child.kill('SIGTERM');
        await ended;
      }
    });
  }
});
