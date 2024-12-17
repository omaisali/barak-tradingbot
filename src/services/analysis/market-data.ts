import type { Ticker } from '../../types/trading';
import type { APIResponse } from '../../types/api';
import { APIError } from '../../api/errors';

export class MarketDataService {
  static processTickerData(response: APIResponse): Ticker[] {
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid ticker data format, using empty array');
      return [];
    }

    return response.data
      .filter(item => this.isValidTickerItem(item))
      .map(item => ({
        pair: item.pair,
        last: Number(item.last),
        daily: Number(item.daily),
        volume: Number(item.volume),
        timestamp: Date.now(),
      }));
  }

  private static isValidTickerItem(item: any): item is Ticker {
    return (
      item &&
      typeof item.pair === 'string' &&
      !isNaN(Number(item.last)) &&
      !isNaN(Number(item.daily)) &&
      !isNaN(Number(item.volume))
    );
  }
}