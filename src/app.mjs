import { createServer } from 'node:http';
import release from '../version.json' with { type: 'json' };

export const version = release.version;

export function createApp() {
  return createServer((request, response) => {
    const path = request.url;
    let status = 200;
    let body;
    if (request.method !== 'GET') {
      status = 405;
      body = { error: 'method_not_allowed' };
    } else if (path === '/health') {
      body = { application: 'releasedeck-smoke-app', status: 'ok', version: release.version };
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
