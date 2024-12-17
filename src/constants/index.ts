// Trading-related constants
export const TRADING_CONSTANTS = {
  MIN_PROFIT_TARGET: 1,
  MAX_PROFIT_TARGET: 100,
  MIN_TRADE_AMOUNT: 1,
  MAX_OPEN_POSITIONS: 10,
  ANALYSIS_INTERVALS: [1, 5, 15] as const,
  DEFAULT_CURRENCY: 'USDT',
} as const;

// API-related constants
export const API_CONSTANTS = {
  BASE_RETRY_DELAY: 1000,
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT: 10000,
} as const;

// Strategy-related constants
export const STRATEGY_CONSTANTS = {
  MIN_CONFIDENCE: 0.4,
  MAX_RECOMMENDATIONS: 10,
  PRICE_HISTORY_LENGTH: 12,
} as const;