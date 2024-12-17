import type { Ticker } from '../../types/trading';
import type { TradingStrategy, StrategyResult } from '../../strategies/base';

export class StrategyExecutor {
  constructor(private strategies: TradingStrategy[]) {}

  execute(tickers: Ticker[]): StrategyResult[] {
    const results: StrategyResult[] = [];
    const errors: Error[] = [];

    for (const ticker of tickers) {
      for (const strategy of this.strategies) {
        try {
          const result = strategy.analyze(ticker);
          if (result) {
            results.push({
              ...result,
              strategyId: strategy.id,
            });
          }
        } catch (error) {
          errors.push(new Error(
            `Strategy ${strategy.id} failed for ${ticker.pair}: ${error instanceof Error ? error.message : 'Unknown error'}`
          ));
        }
      }
    }

    if (errors.length > 0) {
      console.error('Strategy execution errors:', errors);
    }

    return results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }
}