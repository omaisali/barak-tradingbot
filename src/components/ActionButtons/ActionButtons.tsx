import React from 'react';
import classNames from 'classnames';
import './ActionButtons.css';

interface ActionButtonsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isRunning,
  onStart,
  onStop
}) => (
  <div className="actions">
    <button 
      className={classNames('action-button', 'start', { disabled: isRunning })}
      onClick={onStart}
      disabled={isRunning}
    >
      Start Bot
    </button>
    <button 
      className={classNames('action-button', 'stop', { disabled: !isRunning })}
      onClick={onStop}
      disabled={!isRunning}
    >
      Stop Bot
    </button>
  </div>
);