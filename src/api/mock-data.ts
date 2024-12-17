// Mock data for development and testing
export const MOCK_TICKERS = [
  {
    pair: 'BTCUSDT',
    last: 45000,
    daily: 47000,
    volume: 1250000,
    timestamp: Date.now(),
  },
  {
    pair: 'ETHUSDT',
    last: 2800,
    daily: 3000,
    volume: 850000,
    timestamp: Date.now(),
  },
  {
    pair: 'BNBUSDT',
    last: 380,
    daily: 400,
    volume: 450000,
    timestamp: Date.now(),
  },
] as const;