import React from 'react';
import './Strategy.css';

export const Strategy: React.FC = () => (
  <div className="strategy-card">
    <h2 className="section-title">Strategy:</h2>
    <ul className="strategy-list">
      <li className="strategy-item">
        <span className="strategy-bullet">○</span>
        Price below 24-hour average
      </li>
      <li className="strategy-item">
        <span className="strategy-bullet">○</span>
        Continuous uptrend
      </li>
    </ul>
  </div>
);