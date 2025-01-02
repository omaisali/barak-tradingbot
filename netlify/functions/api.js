import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { router as balanceRouter } from '../../server/routes/balance.js';
import { router as tickerRouter } from '../../server/routes/ticker.js';
import { router as serverInfoRouter } from '../../server/routes/server-info.js';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Public-Key', 'X-Private-Key']
}));

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'netlify'
  });
});

// Mount routes
app.use(balanceRouter);
app.use(tickerRouter);
app.use(serverInfoRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

export const handler = serverless(app);