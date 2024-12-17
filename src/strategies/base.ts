import type { Ticker } from '../types/trading';

export interface StrategyResult {
  ticker: Ticker;
  reason: string;
  confidence: number; // 0-1 score indicating how strongly the strategy recommends this trade
  strategyId: string; // Added to track which strategy generated the result
}

export abstract class TradingStrategy {
  abstract id: string;
  abstract name: string;
  abstract description: string;

  abstract analyze(ticker: Ticker): StrategyResult | null;

  protected createResult(
    ticker: Ticker,
    reason: string,
    confidence: number
  ): StrategyResult {
    return {
      ticker,
      reason,
      confidence,
      strategyId: this.id,
    };
  }
}