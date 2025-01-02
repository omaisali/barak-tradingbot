import { ServerInfo } from '../../types/server';

export async function fetchServerInfo(): Promise<ServerInfo> {
  try {
    const response = await fetch('/api/server-info');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server info fetch error:', error);
    throw error;
  }
}