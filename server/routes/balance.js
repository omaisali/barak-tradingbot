import express from 'express';
import crypto from 'crypto';

const router = express.Router();

function computeSignature(nonce, privateKey) {
  const message = nonce.toString();
  return crypto
    .createHmac('sha256', privateKey)
    .update(message)
    .digest('base64');
}

router.get('/balance', async (req, res) => {
  try {
    const publicKey = req.headers['x-public-key'];
    const privateKey = req.headers['x-private-key'];

    if (!publicKey || !privateKey) {
      return res.status(400).json({
        success: false,
        message: 'Missing API keys',
      });
    }

    const nonce = Date.now();
    const signature = computeSignature(nonce, privateKey);

    const response = await fetch('https://api.btcturk.com/api/v1/users/balances', {
      method: 'GET',
      headers: {
        'X-PCK': publicKey,
        'X-Stamp': nonce.toString(),
        'X-Signature': signature,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || `API error: ${response.statusText}`,
      });
    }

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid response format from exchange',
      });
    }

    res.json({
      success: true,
      data: data.data.map(balance => ({
        asset: balance.asset,
        free: balance.free,
        locked: balance.locked,
        total: balance.total,
      })),
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balance. Please check your API keys and try again.',
    });
  }
});

export { router };