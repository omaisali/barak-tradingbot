import { HttpClient } from './http-client';
import { API_CONFIG } from './config';
import type { APIResponse } from '../types/api';
import { APIError } from './errors';

export class BTCTurkAPI extends HttpClient {
  async getTicker(): Promise<APIResponse> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_CONFIG.BASE_URL}/ticker`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        API_CONFIG.TIMEOUT
      );

      const data = await response.json();
      
      // Validate response structure
      if (!data || !Array.isArray(data.data)) {
        throw new APIError('Invalid response format');
      }

      return {
        data: data.data,
        success: true,
      };
    } catch (error) {
      console.error('Failed to fetch ticker:', error);
      throw new APIError('Failed to fetch ticker data');
    }
  }
}