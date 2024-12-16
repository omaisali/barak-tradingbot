import { Trade } from '../types/trading';
import { PriceService } from './priceService';
import { tradingConfig, supportedCoins } from '../config/tradingConfig';

export class TradingService {
  private priceService: PriceService;
  private openPositions: Map<string, Trade>;

  constructor() {
    this.priceService = new PriceService();
    this.openPositions = new Map();
  }

  async executeTrade(coin: string, action: 'Buy' | 'Sell', price: number): Promise<Trade> {
    const trade: Trade = {
      coin,
      action,
      price,
      time: new Date().toLocaleTimeString(),
      status: 'OK'
    };
    
    if (action === 'Buy') {
      this.openPositions.set(coin, trade);
    } else {
      this.openPositions.delete(coin);
    }

    return trade;
  }

  async evaluatePosition(coin: string): Promise<string | null> {
    const currentPrice = await this.priceService.getCurrentPrice(coin);
    const dailyAverage = await this.priceService.getDailyAverage(coin);
    const trend = await this.priceService.analyzeTrend(coin);

    if (currentPrice < dailyAverage && trend === 'uptrend') {
      return 'Buy';
    }
    
    return null;
  }
}