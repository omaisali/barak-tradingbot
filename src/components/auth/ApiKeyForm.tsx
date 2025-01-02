import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { validateApiKeys } from '../../utils/api-validation';

export default function ApiKeyForm() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingKeyId, setExistingKeyId] = useState<string | null>(null);

  useEffect(() => {
    loadExistingKeys();
  }, []);

  const loadExistingKeys = async () => {
    try {
      const { data: keys, error } = await supabase
        .from('user_api_keys')
        .select('id, public_key, private_key')
        .limit(1)
        .single();

      if (keys && !error) {
        setPublicKey(keys.public_key);
        setPrivateKey(keys.private_key);
        setExistingKeyId(keys.id);
      }
    } catch (err) {
      console.error('Error loading API keys:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidating(true);

    try {
      // First validate the API keys
      const isValid = await validateApiKeys(publicKey, privateKey);
      if (!isValid) {
        throw new Error('Invalid API keys. Please check your credentials.');
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // If we have an existing key, update it
      if (existingKeyId) {
        const { error: updateError } = await supabase
          .from('user_api_keys')
          .update({
            public_key: publicKey,
            private_key: privateKey,
            is_valid: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingKeyId);

        if (updateError) throw updateError;
      } else {
        // Otherwise, insert a new key
        const { error: insertError } = await supabase
          .from('user_api_keys')
          .insert({
            user_id: userId,
            public_key: publicKey,
            private_key: privateKey,
            is_valid: true,
          });

        if (insertError) throw insertError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API keys');
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">API Keys</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700">
            Public Key
          </label>
          <input
            id="publicKey"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700">
            Private Key
          </label>
          <input
            id="privateKey"
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || validating}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {validating ? 'Validating...' : loading ? 'Saving...' : existingKeyId ? 'Update API Keys' : 'Save API Keys'}
        </button>
      </form>
    </div>
  );
}