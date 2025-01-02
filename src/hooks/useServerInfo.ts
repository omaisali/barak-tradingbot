import { useState, useEffect } from 'react';
import { fetchServerInfo } from '../services/server/server-api';
import type { ServerInfo } from '../types/server';

export function useServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverUrl] = useState(() => new URL('/api', window.location.href).origin);

  useEffect(() => {
    let mounted = true;

    async function getServerInfo() {
      try {
        setLoading(true);
        setError(null);
        const info = await fetchServerInfo();
        if (mounted) {
          setServerInfo(info);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch server info');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getServerInfo();
    return () => { mounted = false; };
  }, []);

  return { serverInfo, serverUrl, loading, error };
}