module.exports = {
  apps: [{
    name: 'releasedeck-860fd1d6-98c6-4845-991f-f9b36628da70',
    cwd: __dirname,
    script: './dist/server.mjs',
    interpreter: 'node',
    node_args: ['--env-file-if-exists=.env'],
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production' }
  }]
};
