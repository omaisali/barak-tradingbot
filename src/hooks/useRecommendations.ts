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
          const deviation = ((ticker.daily - ticker.last) / ticker.daily) * 100;
          const confidence = Math.min(Math.abs(deviation) / 10, 1);

          return {
            ticker: {
              pair: ticker.pair,
              last: Number(ticker.last),
              daily: Number(ticker.daily),
              volume: Number(ticker.volume),
              timestamp: Date.now(),
            },
            reason: deviation >= 5 
              ? `${deviation.toFixed(2)}% below 24-hour average price`
              : deviation <= -5
              ? `${Math.abs(deviation).toFixed(2)}% above 24-hour average price`
              : 'Price within normal range',
            confidence,
            selected: false,
          };
        })
        .filter(rec => rec.confidence >= 0.4) // Only show recommendations with decent confidence
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10); // Show top 10 recommendations

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

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 30000); // Update every 30 seconds
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