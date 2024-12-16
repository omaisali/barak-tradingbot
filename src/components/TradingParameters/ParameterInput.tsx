import React from 'react';

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
}

export const ParameterInput: React.FC<ParameterInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  hint
}) => (
  <div className="parameter">
    <label className="parameter-label">
      {label}
      {hint && <span className="parameter-hint">({hint})</span>}
    </label>
    <div className="parameter-input-group">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="parameter-input"
      />
      {suffix && <span className="parameter-suffix">{suffix}</span>}
    </div>
  </div>
);