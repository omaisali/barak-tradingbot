import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { Strategy } from '../types/trading';

interface Props {
  strategies: Strategy[];
  onToggle: (strategyId: string) => void;
}

export default function StrategySelector({ strategies, onToggle }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Trading Strategies</h2>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={strategy.id}
                type="checkbox"
                checked={strategy.isActive}
                onChange={() => onToggle(strategy.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={strategy.id} className="font-medium text-gray-700">
                {strategy.name}
              </label>
              <p className="text-gray-500">{strategy.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}