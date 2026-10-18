import { createApp, version } from './app.mjs';

const server = createApp();
server.listen(Number(process.env.PORT ?? 3100), '127.0.0.1', () => {
  console.log('releasedeck-smoke-app ' + version + ' listening on 127.0.0.1:' + server.address().port);
});
