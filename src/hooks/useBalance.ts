import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { validateApiKeys } from '../utils/api-validation';

interface Balance {
  asset: string;
  free: string;
  locked: string;
  total: string;
}

export function useBalance() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: keys, error: dbError } = await supabase
        .from('user_api_keys')
        .select('public_key, private_key')
        .limit(1)
        .single();

      if (dbError || !keys) {
        throw new Error('Please add your API keys first');
      }

      // Validate API keys before making the request
      const isValid = await validateApiKeys(keys.public_key, keys.private_key);
      if (!isValid) {
        throw new Error('Invalid API keys. Please check your credentials.');
      }

      const response = await fetch('/api/balance', {
        headers: {
          'X-Public-Key': keys.public_key,
          'X-Private-Key': keys.private_key,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to fetch balance: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from server');
      }

      setBalances(data.data);
      setError(null);
    } catch (err) {
      console.error('Balance fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (mounted) {
        await fetchBalance();
      }
    };

    init();

    const interval = setInterval(() => {
      if (mounted) {
        fetchBalance();
      }
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchBalance]);

  return {
    balances,
    loading,
    error,
    refresh: fetchBalance,
  };
}