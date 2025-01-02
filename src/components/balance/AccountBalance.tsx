import React from 'react';
import { Wallet } from 'lucide-react';
import { useBalance } from '../../hooks/useBalance';

export default function AccountBalance() {
  const { balances, loading, error, refresh } = useBalance();

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold">Account Balance</h2>
          </div>
          <button
            onClick={refresh}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-200 rounded" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Account Balance</h2>
        </div>
        <button
          onClick={refresh}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>
      
      {balances.length === 0 ? (
        <p className="text-gray-500 text-sm">No balance information available</p>
      ) : (
        <div className="space-y-4">
          {balances.map((balance) => (
            <div key={balance.asset} className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{balance.asset}</span>
              <span className="text-gray-900">
                {parseFloat(balance.free).toFixed(8)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}