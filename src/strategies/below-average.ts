import { TradingStrategy, type StrategyResult } from './base';
import type { Ticker } from '../types/trading';

export class BelowAverageStrategy extends TradingStrategy {
  id = 'below-average';
  name = 'Price Below 24h Average';
  description = 'Identifies coins trading at least 5% below their 24-hour average price';

  analyze(ticker: Ticker): StrategyResult | null {
    const deviation = ((ticker.daily - ticker.last) / ticker.daily) * 100;
    
    if (deviation >= 5) {
      return {
        ticker,
        reason: `${deviation.toFixed(2)}% below 24-hour average price`,
        confidence: Math.min(deviation / 10, 1), // Higher deviation = higher confidence, max 1
      };
    }

    return null;
  }
}