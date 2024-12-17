import type { Ticker } from '../../types/trading';

export class TickerProcessor {
  static processTickerData(data: any): Ticker[] {
    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error('Invalid ticker data format');
    }

    return data.data
      .filter((item: any) => 
        typeof item.pair === 'string' &&
        !isNaN(parseFloat(item.last)) &&
        !isNaN(parseFloat(item.daily)) &&
        !isNaN(parseFloat(item.volume))
      )
      .map((item: any) => ({
        pair: item.pair,
        last: parseFloat(item.last),
        daily: parseFloat(item.daily),
        volume: parseFloat(item.volume),
        timestamp: Date.now(),
      }));
  }
}