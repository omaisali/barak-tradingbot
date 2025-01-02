import express from 'express';

const router = express.Router();

router.get('/ticker', async (req, res) => {
  try {
    const response = await fetch('https://api.btcturk.com/api/v2/ticker', {
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
    res.json({
      success: true,
      data: data.data,
    });
  } catch (error) {
    console.error('Error fetching from BTC Turk API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticker data',
    });
  }
});

export { router };