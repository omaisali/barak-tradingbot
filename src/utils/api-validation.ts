import { supabase } from '../lib/supabase';

export async function validateApiKeys(publicKey: string, privateKey: string): Promise<boolean> {
  if (!publicKey || !privateKey) {
    return false;
  }

  try {
    const response = await fetch('/api/balance', {
      headers: {
        'X-Public-Key': publicKey,
        'X-Private-Key': privateKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
}

export async function updateApiKeyValidStatus(valid: boolean): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_api_keys')
      .update({ is_valid: valid })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error('Failed to update API key status:', error);
    }
  } catch (err) {
    console.error('Error updating API key status:', err);
  }
}