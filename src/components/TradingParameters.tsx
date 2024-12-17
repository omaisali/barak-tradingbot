import React from 'react';
import { Settings } from 'lucide-react';
import type { TradingParameters } from '../types/trading';

interface Props {
  parameters: TradingParameters;
  onUpdate: (params: TradingParameters) => void;
}

export default function TradingParameters({ parameters, onUpdate }: Props) {
  const handleChange = (field: keyof TradingParameters, value: string | number) => {
    onUpdate({
      ...parameters,
      [field]: typeof value === 'string' ? parseFloat(value) : value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Trading Parameters</h2>
      </div>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trade Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              min="1"
              value={parameters.tradeAmount}
              onChange={(e) => handleChange('tradeAmount', e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 pl-3 pr-12 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">{parameters.currency}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profit Target (%)</label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={parameters.profitTarget}
            onChange={(e) => handleChange('profitTarget', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Analysis Interval (minutes)</label>
          <select
            value={parameters.analysisInterval}
            onChange={(e) => handleChange('analysisInterval', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Open Positions</label>
          <input
            type="number"
            min="1"
            value={parameters.maxOpenPositions}
            onChange={(e) => handleChange('maxOpenPositions', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}