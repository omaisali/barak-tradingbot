import React from 'react';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import type { CoinRecommendation } from '../types/trading';

interface Props {
  recommendations: CoinRecommendation[];
  loading?: boolean;
  error?: string | null;
  onSelect: (pair: string) => void;
  onRefresh?: () => void;
}

export default function RecommendedCoins({
  recommendations,
  loading = false,
  error = null,
  onSelect,
  onRefresh,
}: Props) {
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Recommended Coins</h2>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-red-500">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Recommended Coins</h2>
          </div>
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Recommended Coins</h2>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p>No recommendations available</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[500px] pr-2 -mr-2 space-y-4">
          {recommendations.map(({ ticker, reason, confidence, selected }) => (
            <div
              key={ticker.pair}
              className={`flex items-start p-4 border rounded-lg transition-colors ${
                selected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center h-5">
                <input
                  id={ticker.pair}
                  type="checkbox"
                  checked={selected}
                  onChange={() => onSelect(ticker.pair)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <label htmlFor={ticker.pair} className="font-medium text-gray-700">
                    {ticker.pair}
                  </label>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    confidence >= 0.7
                      ? 'bg-green-100 text-green-800'
                      : confidence >= 0.4
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {(confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{reason}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-gray-600">
                    Current: ${ticker.last.toFixed(2)}
                  </span>
                  <span className="text-gray-600">
                    24h Avg: ${ticker.daily.toFixed(2)}
                  </span>
                  <span className={`font-medium ${
                    ticker.last < ticker.daily ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {((ticker.last - ticker.daily) / ticker.daily * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}