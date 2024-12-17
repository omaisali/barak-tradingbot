export interface Ticker {
  pair: string;
  last: number;
  daily: number;
  volume: number;
  timestamp: number;
}

export interface TradingParameters {
  tradeAmount: number;
  profitTarget: number;
  analysisInterval: number;
  maxOpenPositions: number;
  currency: 'TRY' | 'USDT';
}

export interface Trade {
  coin: string;
  action: 'BUY' | 'SELL';
  price: number;
  time: Date;
  status: 'OK' | 'FAILED';
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CoinRecommendation {
  ticker: Ticker;
  reason: string;
  confidence: number;
  selected: boolean;
}