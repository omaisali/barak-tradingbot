import express from 'express';
import { getServerInfo } from '../utils/system.js';

const router = express.Router();

router.get('/server-info', (_req, res) => {
  try {
    const info = getServerInfo();
    res.json(info);
  } catch (error) {
    console.error('Server info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve server information',
      message: error.message
    });
  }
});

export { router };