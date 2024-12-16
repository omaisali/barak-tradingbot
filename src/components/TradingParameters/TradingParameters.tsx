import React from 'react';
import { TradingConfig } from '../../types/trading';
import { ParameterInput } from './ParameterInput';
import './TradingParameters.css';

interface TradingParametersProps {
  config: TradingConfig;
  onConfigChange: (updates: Partial<TradingConfig>) => void;
}

export const TradingParameters: React.FC<TradingParametersProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (key: keyof TradingConfig) => (value: number) => {
    onConfigChange({ [key]: value });
  };

  return (
    <div className="trading-parameters">
      <h2 className="section-title">Trading Parameters:</h2>
      <form className="parameters-form">
        <ParameterInput
          label="Trade Amount"
          value={config.tradeAmount}
          onChange={handleChange('tradeAmount')}
          min={0}
          step={100}
          suffix="USD"
        />
        <ParameterInput
          label="Profit Target"
          value={config.profitTarget}
          onChange={handleChange('profitTarget')}
          min={0.1}
          step={0.1}
          suffix="%"
          hint="min. 1%"
        />
        <ParameterInput
          label="Query Interval"
          value={config.queryInterval}
          onChange={handleChange('queryInterval')}
          min={1}
          max={60}
          suffix="s"
        />
        <ParameterInput
          label="Max Open Positions"
          value={config.maxOpenPositions}
          onChange={handleChange('maxOpenPositions')}
          min={1}
          max={10}
        />
      </form>
    </div>
  );
};