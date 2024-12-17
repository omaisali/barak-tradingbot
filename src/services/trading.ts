import { BTCTurkAPI } from '../api/btcturk';
import { MarketAnalyzer } from './market-analyzer';
import { BelowAverageStrategy } from '../strategies/below-average';
import { UpwardTrendStrategy } from '../strategies/upward-trend';
import type { Trade } from '../types/trading';
import type { StrategyResult } from '../strategies/base';

export class TradingService {
  private analyzer: MarketAnalyzer;
  private interval: number | null = null;
  private api: BTCTurkAPI;

  constructor(api: BTCTurkAPI) {
    this.api = api;
    const strategies = [
      new BelowAverageStrategy(),
      new UpwardTrendStrategy(),
    ];
    this.analyzer = new MarketAnalyzer(api, strategies);
  }

  async executeTrade(trade: Omit<Trade, 'time' | 'status'>): Promise<Trade> {
    try {
      const response = await this.api.placeOrder({
        pairSymbol: trade.coin,
        quantity: trade.price,
        price: trade.price,
        orderMethod: 'limit',
        orderType: trade.action.toLowerCase() as 'buy' | 'sell',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Order failed: ${response.statusText}`);
      }

      return {
        ...trade,
        time: new Date(),
        status: 'OK',
      };
    } catch (error) {
      console.error('Trade execution failed:', error);
      return {
        ...trade,
        time: new Date(),
        status: 'FAILED',
      };
    }
  }

  startAnalysis(intervalMinutes: number, callback: (results: StrategyResult[]) => void) {
    if (this.interval) {
      this.stopAnalysis();
    }

    const analyze = async () => {
      try {
        const results = await this.analyzer.analyzeTickers();
        if (results.length > 0) {
          callback(results);
        }
      } catch (error) {
        console.error('Analysis failed:', error);
        // Don't stop the analysis on error, just skip this iteration
      }
    };

    // Initial analysis with a small delay to ensure setup is complete
    setTimeout(analyze, 1000);
    this.interval = window.setInterval(analyze, intervalMinutes * 60 * 1000);
  }

  stopAnalysis() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
  }
}