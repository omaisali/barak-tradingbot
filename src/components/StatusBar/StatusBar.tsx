import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  status: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => (
  <div className="status-bar">
    <span className="status-label">Status:</span>
    <span className="status-value">{status}</span>
  </div>
);