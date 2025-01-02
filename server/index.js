import express from 'express';
import cors from 'cors';
import { router as balanceRouter } from './routes/balance.js';
import { router as tickerRouter } from './routes/ticker.js';
import { router as serverInfoRouter } from './routes/server-info.js';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', balanceRouter);
app.use('/api', tickerRouter);
app.use('/api', serverInfoRouter);

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});