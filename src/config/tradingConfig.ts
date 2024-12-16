import { TradingConfig, CoinConfig } from '../types/trading';

export const tradingConfig: TradingConfig = {
  tradeAmount: 1000.00,
  profitTarget: 1.0,
  queryInterval: 10,
  maxOpenPositions: 5
};

export const supportedCoins: Record<string, CoinConfig> = {
  BTCUSDT: { name: 'Bitcoin', threshold: -6 },
  ETHUSDT: { name: 'Ethereum', trend: 'uptrend' },
  XRPUSDT: { name: 'Ripple', volatility: 4 }
};