import React from 'react';
import './LogView.css';

interface LogEntry {
  time: string;
  message: string;
}

interface LogViewProps {
  logs: LogEntry[];
}

export const LogView: React.FC<LogViewProps> = ({ logs }) => (
  <div className="log-view">
    <h2 className="section-title">Log:</h2>
    <div className="log-entries">
      {logs.map((log, index) => (
        <div key={index} className="log-entry">
          <span className="log-time">- {log.time}:</span>
          <span className="log-message">{log.message}</span>
        </div>
      ))}
    </div>
  </div>
);