import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import release from '../version.json' with { type: 'json' };

export function createApp() {
  return createServer((request, response) => {
    const path = request.url;
    let status = 200;
    let body;
    if (request.method !== 'GET') {
      status = 405;
      body = { error: 'method_not_allowed' };
    } else if (path === '/health') {
      body = { status: 'ok', version: release.version };
    } else if (path === '/') {
      body = { application: 'releasedeck-smoke-app', version: release.version, message: 'ReleaseDeck deployment smoke test' };
    } else {
      status = 404;
      body = { error: 'not_found' };
    }
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(body) + '\n');
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createApp().listen(3100, '127.0.0.1', () => {
    console.log('releasedeck-smoke-app ' + release.version + ' listening on 127.0.0.1:3100');
  });
}
