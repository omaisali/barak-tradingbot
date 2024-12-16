import { useState } from 'react';
import { TradingConfig } from '../types/trading';
import { tradingConfig as initialConfig } from '../config/tradingConfig';

export const useTradingConfig = () => {
  const [config, setConfig] = useState<TradingConfig>(initialConfig);

  const updateConfig = (updates: Partial<TradingConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    config,
    updateConfig
  };
};