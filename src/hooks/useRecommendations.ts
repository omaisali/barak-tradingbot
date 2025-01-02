import { useState, useEffect, useCallback } from 'react';
import type { CoinRecommendation } from '../types/trading';
import { withRetry } from '../api/retry';
import { API_CONSTANTS } from '../constants';

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<CoinRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await withRetry(
        () => fetch('/api/ticker'),
        {
          attempts: API_CONSTANTS.MAX_RETRY_ATTEMPTS,
          delay: API_CONSTANTS.BASE_RETRY_DELAY,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ticker data');
      }

      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }

      // Process recommendations
      const newRecommendations: CoinRecommendation[] = data.data
        .filter(ticker => 
          ticker.pair && 
          !isNaN(ticker.last) && 
          !isNaN(ticker.daily) && 
          !isNaN(ticker.volume)
        )
        .map(ticker => {
          const last = Number(ticker.last);
          const daily = Number(ticker.daily);
          
          // Calculate percentage difference from 24h average
          const percentChange = ((last - daily) / daily) * 100;
          const confidence = Math.min(Math.abs(percentChange) / 10, 1);

          return {
            ticker: {
              pair: ticker.pair,
              last,
              daily,
              volume: Number(ticker.volume),
              timestamp: Date.now(),
            },
            reason: `${Math.abs(percentChange).toFixed(2)}% ${last > daily ? 'above' : 'below'} 24-hour average price`,
            confidence,
            selected: false,
          };
        })
        .filter(rec => rec.confidence >= 0.4)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10);

      setRecommendations(newRecommendations);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSelection = useCallback((pair: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.ticker.pair === pair
          ? { ...rec, selected: !rec.selected }
          : rec
      )
    );
  }, []);

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 30000);
    return () => clearInterval(interval);
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: fetchRecommendations,
    toggleSelection,
  };
}