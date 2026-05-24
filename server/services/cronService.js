const cron = require('node-cron');
const https = require('https');
const http = require('http');

/**
 * Self-ping cron job to keep the Render free-tier server awake.
 * Render spins down after 15 minutes of inactivity — this pings
 * the server's own health endpoint every 10 minutes to prevent that.
 */
const startKeepAliveCron = () => {
  const SERVER_URL = process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL;

  // Only run in production if we know the server URL
  if (!SERVER_URL) {
    console.log('⏰ Cron: No SERVER_URL set — skipping keep-alive cron (runs in dev mode only)');
    // In dev mode, still log that it's working
    console.log('⏰ Cron: Keep-alive service initialized (will activate when SERVER_URL is set)');
    return;
  }

  console.log(`⏰ Cron: Keep-alive service started — pinging ${SERVER_URL} every 10 minutes`);

  // Run every 10 minutes: */10 * * * *
  cron.schedule('*/10 * * * *', () => {
    const url = new URL(SERVER_URL);
    const client = url.protocol === 'https:' ? https : http;

    const start = Date.now();

    const req = client.get(`${SERVER_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        console.log(`⏰ Cron: Self-ping OK (${ms}ms) — ${res.statusCode}`);
      });
    });

    req.on('error', (err) => {
      console.error(`⏰ Cron: Self-ping failed — ${err.message}`);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.error('⏰ Cron: Self-ping timed out after 10s');
    });
  });
};

module.exports = { startKeepAliveCron };
