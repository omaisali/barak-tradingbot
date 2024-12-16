import { TradingStrategy } from './TradingStrategy';
import { TradingConfig, Trade } from '../../types/trading';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export class TradingBot extends EventEmitter {
  private strategy: TradingStrategy;
  isRunning: boolean = false;
  private config: TradingConfig;
  private supportedPairs: string[];
  private interval: NodeJS.Timeout | null = null;

  constructor(config: TradingConfig, supportedPairs: string[]) {
    super();
    this.config = config;
    this.strategy = new TradingStrategy(config);
    this.supportedPairs = supportedPairs;
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    logger.info('Trading bot started');
    this.emit('status', { status: 'started' });
    
    this.runTradingLoop();
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    logger.info('Trading bot stopped');
    this.emit('status', { status: 'stopped' });
  }

  private runTradingLoop(): void {
    const runLoop = async () => {
      try {
        for (const pair of this.supportedPairs) {
          const trade = await this.strategy.evaluatePosition(pair);
          
          if (trade) {
            this.emit('trade', trade);
          }
        }
      } catch (error) {
        logger.error('Error in trading loop:', error);
        this.emit('error', error);
      }
    };

    // Run immediately and then set interval
    runLoop();
    this.interval = setInterval(runLoop, this.config.queryInterval * 1000);
  }

  updateConfig(newConfig: TradingConfig): void {
    this.config = newConfig;
    this.strategy = new TradingStrategy(newConfig);
    logger.info('Trading bot configuration updated');
    
    // Restart the trading loop with new interval if running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}