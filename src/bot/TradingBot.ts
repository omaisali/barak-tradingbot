import { TradingService } from '../services/tradingService';
import { supportedCoins, tradingConfig } from '../config/tradingConfig';
import { Trade } from '../types/trading';

export class TradingBot {
  private tradingService: TradingService;
  private isRunning: boolean = false;
  private trades: Trade[] = [];

  constructor() {
    this.tradingService = new TradingService();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    this.runTradingLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  private async runTradingLoop(): Promise<void> {
    while (this.isRunning) {
      for (const [coin, config] of Object.entries(supportedCoins)) {
        const action = await this.tradingService.evaluatePosition(coin);
        
        if (action) {
          const price = await this.tradingService.getCurrentPrice(coin);
          const trade = await this.tradingService.executeTrade(coin, action, price);
          this.trades.push(trade);
        }
      }

      await new Promise(resolve => setTimeout(resolve, tradingConfig.queryInterval * 1000));
    }
  }

  getRecentTrades(): Trade[] {
    return this.trades.slice(-10);
  }
}