# ReleaseDeck smoke application

Dependency-free deployment fixture for ReleaseDeck. Requires Node 24.

Run `npm ci`, `npm test`, and `npm run build`. The deterministic build produces a standalone `dist/server.mjs` and SHA-256 manifest. Start with `npm start`; the server binds only to `127.0.0.1:3100`.

This v6 candidate deliberately returns HTTP 503 from `GET /health`, with `intentional_unhealthy` and `automatic_restoration_fixture` evidence, to test automatic restoration to known-good v5. `GET /` remains HTTP 200 and identifies v6. The server still starts normally. No database, framework, native dependency, or secret is required.

The ecosystem configuration runs from its own release directory and loads the release `.env` if present. An empty shared environment file is sufficient.

This fixture is registered as ReleaseDeck project `860fd1d6-98c6-4845-991f-f9b36628da70`. PM2 process name: `releasedeck-860fd1d6-98c6-4845-991f-f9b36628da70`.
