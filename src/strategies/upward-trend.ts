import { TradingStrategy, type StrategyResult } from './base';
import type { Ticker } from '../types/trading';

export class UpwardTrendStrategy extends TradingStrategy {
  id = 'upward-trend';
  name = 'Continuous Upward Trend';
  description = 'Identifies coins showing a stable upward trend based on recent price action';
  
  private priceHistory: Map<string, number[]> = new Map();
  private readonly HISTORY_LENGTH = 12;

  analyze(ticker: Ticker): StrategyResult | null {
    // Update price history
    const history = this.priceHistory.get(ticker.pair) || [];
    history.push(ticker.last);
    if (history.length > this.HISTORY_LENGTH) {
      history.shift();
    }
    this.priceHistory.set(ticker.pair, history);

    if (history.length < this.HISTORY_LENGTH) {
      return null;
    }

    // Check if prices are consistently increasing
    let increasingCount = 0;
    for (let i = 1; i < history.length; i++) {
      if (history[i] > history[i - 1]) {
        increasingCount++;
      }
    }

    const trendStrength = increasingCount / (history.length - 1);
    if (trendStrength >= 0.7) { // At least 70% of price changes are increases
      return {
        ticker,
        reason: `${(trendStrength * 100).toFixed(0)}% upward price movement in recent history`,
        confidence: trendStrength,
      };
    }

    return null;
  }
}