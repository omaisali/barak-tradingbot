import { useState, useEffect, useCallback } from 'react';
import { BTCTurkAPI } from '../api/btcturk';
import { TradingService } from '../services/trading';
import type { Trade, TradingParameters, Strategy, CoinRecommendation } from '../types/trading';
import type { StrategyResult } from '../strategies/base';

const api = new BTCTurkAPI({
  publicKey: '88f2d306-b3b5-4a69-8a80-1d0d1e76bf75',
  privateKey: 'pmufvGDC0zu09N6+51iWhBvafDBbZm3z',
});

const availableStrategies: Strategy[] = [
  {
    id: 'below-average',
    name: 'Price Below 24h Average',
    description: 'Identifies coins trading at least 5% below their 24-hour average price',
    isActive: true,
  },
  {
    id: 'upward-trend',
    name: 'Continuous Upward Trend',
    description: 'Identifies coins showing a stable upward trend based on recent price action',
    isActive: true,
  },
];

export function useTrading(initialParameters: TradingParameters) {
  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState(initialParameters);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [recommendations, setRecommendations] = useState<CoinRecommendation[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>(availableStrategies);
  const [error, setError] = useState<string | null>(null);

  const tradingService = new TradingService(api);

  const handleAnalysisResults = useCallback((results: StrategyResult[]) => {
    // Convert strategy results to recommendations
    const newRecommendations = results
      .filter(result => {
        // Only include results from active strategies
        const strategy = strategies.find(s => s.id === result.strategyId);
        return strategy?.isActive;
      })
      .map(result => ({
        ...result,
        selected: false,
      }));

    setRecommendations(newRecommendations);
    setError(null);
  }, [strategies]);

  const toggleStrategy = useCallback((strategyId: string) => {
    setStrategies(prevStrategies => 
      prevStrategies.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, isActive: !strategy.isActive }
          : strategy
      )
    );
  }, []);

  const toggleBot = useCallback(() => {
    try {
      if (!isRunning) {
        tradingService.startAnalysis(parameters.analysisInterval, handleAnalysisResults);
      } else {
        tradingService.stopAnalysis();
      }
      setIsRunning(!isRunning);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle bot');
      setIsRunning(false);
    }
  }, [isRunning, parameters.analysisInterval, tradingService, handleAnalysisResults]);

  const executeTrade = useCallback(async (trade: Omit<Trade, 'time' | 'status'>) => {
    try {
      const result = await tradingService.executeTrade(trade);
      setTrades(prev => [result, ...prev]);
      
      // Update recommendation selection status
      setRecommendations(prev => 
        prev.map(rec => 
          rec.ticker.pair === trade.coin
            ? { ...rec, selected: true }
            : rec
        )
      );
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute trade');
    }
  }, [tradingService]);

  useEffect(() => {
    return () => {
      tradingService.stopAnalysis();
    };
  }, [tradingService]);

  return {
    isRunning,
    parameters,
    trades,
    recommendations,
    strategies,
    error,
    setParameters,
    toggleBot,
    toggleStrategy,
    executeTrade,
  };
}