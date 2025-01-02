import React from 'react';
import { Play, Pause } from 'lucide-react';
import TradingParameters from './components/TradingParameters';
import StrategySelector from './components/StrategySelector';
import RecommendedCoins from './components/RecommendedCoins';
import TradeHistory from './components/TradeHistory';
import ApiKeyForm from './components/auth/ApiKeyForm';
import AccountBalance from './components/balance/AccountBalance';
import AuthPage from './pages/AuthPage';
import UserMenu from './components/auth/UserMenu';
import ServerInfo from './components/server/ServerInfo';
import { useTrading } from './hooks/useTrading';
import { useRecommendations } from './hooks/useRecommendations';
import { useAuth } from './hooks/useAuth';
import { exportTradesToCSV } from './utils/csv';

export default function App() {
  const { user, loading: authLoading } = useAuth();

  const {
    isRunning,
    parameters,
    trades,
    strategies,
    setParameters,
    toggleBot,
    toggleStrategy,
    executeTrade,
  } = useTrading({
    tradeAmount: 1000,
    profitTarget: 1.5,
    analysisInterval: 5,
    maxOpenPositions: 3,
    currency: 'USDT',
  });

  const {
    recommendations,
    loading,
    error,
    refreshRecommendations,
    toggleSelection,
  } = useRecommendations();

  const handleExport = () => {
    exportTradesToCSV(trades);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BTC Turk Trading Bot</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleBot}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors ${
                isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Bot
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Bot
                </>
              )}
            </button>
            <UserMenu />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ServerInfo />
            <ApiKeyForm />
            <AccountBalance />
            <TradingParameters
              parameters={parameters}
              onUpdate={setParameters}
            />
            <StrategySelector
              strategies={strategies}
              onToggle={toggleStrategy}
            />
          </div>
          <div className="space-y-8">
            <RecommendedCoins
              recommendations={recommendations}
              loading={loading}
              error={error}
              onSelect={toggleSelection}
              onRefresh={refreshRecommendations}
            />
            <TradeHistory
              trades={trades}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}