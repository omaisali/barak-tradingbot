import { useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { TradingConfig, Trade } from '../types/trading';

export let socket: Socket | null = null;

export const useSocket = (
  onTrade: (trade: Trade) => void,
  onStatus: (status: { status: string }) => void,
  onError: (error: string) => void
) => {
  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:3000');
    }

    socket.on('trade', onTrade);
    socket.on('status', onStatus);
    socket.on('error', onError);

    return () => {
      if (socket) {
        socket.off('trade', onTrade);
        socket.off('status', onStatus);
        socket.off('error', onError);
      }
    };
  }, [onTrade, onStatus, onError]);

  const startBot = useCallback(() => {
    socket?.emit('start-bot');
  }, []);

  const stopBot = useCallback(() => {
    socket?.emit('stop-bot');
  }, []);

  const updateBotConfig = useCallback((config: TradingConfig) => {
    socket?.emit('update-config', config);
  }, []);

  return {
    startBot,
    stopBot,
    updateBotConfig
  };
};