import app from './src/app.js';
import { initDatabase } from './src/config/database.js';
import { cache } from './src/config/redis.js';

const PORT = parseInt(process.env.PORT || '5000', 10);
const REPLICA_ID = process.env.REPLICA_ID || 'API-Replica-1';

async function startServer() {
  console.log(`🚂 Booting Railway Reservation API [${REPLICA_ID}]...`);
  
  // 1. Initialize DB migrations and connection
  await initDatabase();

  // 2. Connect Redis cache
  await cache.connect();

  // 3. Start listening
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [${REPLICA_ID}] Server listening on port ${PORT}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api/docs`);
    console.log(`⚡ REST API v1 prefix: http://localhost:${PORT}/api/v1/`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
