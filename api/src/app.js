import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/v1/authRoutes.js';
import stationRoutes from './routes/v1/stationRoutes.js';
import trainRoutes from './routes/v1/trainRoutes.js';
import scheduleRoutes from './routes/v1/scheduleRoutes.js';
import seatRoutes from './routes/v1/seatRoutes.js';
import reservationRoutes from './routes/v1/reservationRoutes.js';
import paymentRoutes from './routes/v1/paymentRoutes.js';
import adminRoutes from './routes/v1/adminRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware: CORS & JSON Body Parsing
app.use(cors());
app.use(express.json());

// Load Balancer Replica tracking header
app.use((req, res, next) => {
  const replicaId = process.env.REPLICA_ID || 'API-Replica-1';
  res.setHeader('X-Handled-By', replicaId);
  res.setHeader('X-Cluster-Node', process.env.HOSTNAME || replicaId);
  next();
});

// Swagger UI Documentation at /api/docs and /docs
try {
  const swaggerDocPath = path.join(__dirname, 'swagger', 'openapi.json');
  const swaggerDoc = JSON.parse(fs.readFileSync(swaggerDocPath, 'utf8'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (err) {
  console.warn('⚠️ Swagger file load error:', err.message);
}

// Health Check Endpoint (Used by Nginx / Docker health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    replicaId: process.env.REPLICA_ID || 'API-Replica-1',
    uptimeSeconds: Math.floor(process.uptime()),
    database: 'PostgreSQL 3NF',
    cache: 'Redis / Cache-Aside'
  });
});

// Mount Versioned API Routes (/api/v1/...)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stations', stationRoutes);
app.use('/api/v1/trains', trainRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/seats', seatRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
