import React from 'react';
import { CoinStatus } from '../../types/trading';
import './CoinList.css';

interface CoinListProps {
  coins: CoinStatus[];
}

export const CoinList: React.FC<CoinListProps> = ({ coins }) => (
  <div className="coin-list">
    <h2 className="section-title">Recommended Coins:</h2>
    {coins.map(coin => (
      <div key={coin.name} className="coin-item">
        <span className="coin-symbol">{coin.name}</span>
        <span className="coin-status">
          {coin.trend === 'uptrend' ? 'Uptrend detected' : 
           `${Math.abs(coin.volatility)}% ${coin.volatility > 0 ? 'above' : 'below'} average`}
        </span>
      </div>
    ))}
  </div>
);