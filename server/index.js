import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// BTC Turk API endpoint
const BTC_TURK_API = 'https://api.btcturk.com/api/v2/ticker';

app.get('/api/ticker', async (req, res) => {
  try {
    const response = await fetch(BTC_TURK_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`BTC Turk API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the data to match our expected format
    const transformedData = {
      data: data.data
        .filter(item => 
          item.pair && 
          item.last && 
          item.daily && 
          item.volume &&
          // Only include USDT pairs for simplicity
          item.pair.endsWith('USDT')
        )
        .map(item => ({
          pair: item.pair,
          last: parseFloat(item.last),
          daily: parseFloat(item.daily),
          volume: parseFloat(item.volume),
        })),
      success: true,
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching from BTC Turk API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticker data',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});