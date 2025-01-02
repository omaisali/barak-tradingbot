import React from 'react';
import { Server } from 'lucide-react';
import { useServerInfo } from '../../hooks/useServerInfo';

export default function ServerInfo() {
  const { serverInfo, serverUrl, loading, error } = useServerInfo();

  function formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Server Information</h2>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">API Server:</span>
          <span className="text-sm text-gray-600 font-mono">{serverUrl}</span>
        </div>
        
        {loading ? (
          <div className="text-sm text-gray-400">Loading server information...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : serverInfo && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Server IP:</span>
              <span className="text-sm text-gray-600 font-mono">{serverInfo.ip}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Hostname:</span>
              <span className="text-sm text-gray-600 font-mono">{serverInfo.hostname}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Platform:</span>
              <span className="text-sm text-gray-600 font-mono">{serverInfo.platform}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Uptime:</span>
              <span className="text-sm text-gray-600 font-mono">{formatUptime(serverInfo.uptime)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}