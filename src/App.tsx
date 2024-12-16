import React, { useState, useCallback, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { Balance } from "./components/Balance/Balance";
import { CoinList } from "./components/CoinList/CoinList";
import { TradingParameters } from "./components/TradingParameters/TradingParameters";
import { TradeHistory } from "./components/TradeHistory/TradeHistory";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { Strategy } from "./components/Strategy/Strategy";
import { LogView } from "./components/LogView/LogView";
import { ActionButtons } from "./components/ActionButtons/ActionButtons";
import { supportedCoins } from "./config/tradingConfig";
import { useTradingConfig } from "./hooks/useTradingConfig";
import { useSocket } from "./hooks/useSocket";
import { useBalance } from "./hooks/useBalance";
import { Trade, CoinStatus } from "./types/trading";
import "./App.css";

const App: React.FC = () => {
  const { config, updateConfig } = useTradingConfig();
  const balances = useBalance();
  const [isRunning, setIsRunning] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<{ time: string; message: string }[]>([]);
  const [status, setStatus] = useState("Idle");

  // Convert supported coins to CoinStatus array for display
  const coins: CoinStatus[] = Object.entries(supportedCoins).map(
    ([symbol, config]) => ({
      name: symbol,
      ...config,
    }),
  );

  // Socket event handlers
  const handleTrade = useCallback((trade: Trade) => {
    setTrades((prev) => [trade, ...prev].slice(0, 10)); // Keep last 10 trades
    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        message: `${trade.action} ${trade.coin} at ${trade.price} USD ${trade.status === "OK" ? "successful" : "failed"}.`,
      },
      ...prev,
    ]);
  }, []);

  const handleStatus = useCallback(
    ({ status: newStatus }: { status: string }) => {
      setIsRunning(newStatus === "started");
      setStatus(newStatus === "started" ? "Running" : "Stopped");
      setLogs((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          message: `Bot ${newStatus === "started" ? "started" : "stopped"}`,
        },
        ...prev,
      ]);
    },
    [],
  );

  const handleError = useCallback((error: string) => {
    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        message: `Error: ${error}`,
      },
      ...prev,
    ]);
  }, []);

  // Initialize socket connection and handlers
  const { startBot, stopBot, updateBotConfig } = useSocket(
    handleTrade,
    handleStatus,
    handleError,
  );

  // Handle config updates
  const handleConfigUpdate = useCallback(
    (updates: Partial<typeof config>) => {
      const newConfig = { ...config, ...updates };
      updateConfig(newConfig);
      updateBotConfig(newConfig);
    },
    [config, updateConfig, updateBotConfig],
  );

  // Handle bot start/stop
  const handleStart = useCallback(() => {
    startBot();
  }, [startBot]);

  const handleStop = useCallback(() => {
    stopBot();
  }, [stopBot]);

  return (
    <div className="app">
      <Header />
      <StatusBar status={status} />
      <div className="content">
        <Balance balances={balances} />
        <CoinList coins={coins} />
        <TradingParameters
          config={config}
          onConfigChange={handleConfigUpdate}
        />
        <Strategy />
      </div>
      <div className="main-section">
        <ActionButtons
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
        />
        <TradeHistory trades={trades} />
        <LogView logs={logs} />
      </div>
    </div>
  );
};

export default App;
