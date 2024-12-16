import React from 'react';
import { Trade } from '../../types/trading';
import { formatCurrency } from '../../utils/formatters';
import './TradeHistory.css';

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => (
  <div className="trade-history">
    <h2 className="section-title">Recent Actions:</h2>
    <div className="trade-table">
      <div className="trade-header">
        <span>Coin</span>
        <span>Action</span>
        <span>Price</span>
        <span>Time</span>
        <span>Status</span>
      </div>
      {trades.map((trade, index) => (
        <div key={index} className="trade-row">
          <span>{trade.coin}</span>
          <span className={trade.action.toLowerCase()}>{trade.action}</span>
          <span>{formatCurrency(trade.price)}</span>
          <span>{trade.time}</span>
          <span className={trade.status.toLowerCase()}>{trade.status}</span>
        </div>
      ))}
    </div>
  </div>
);