import { BTCTurkAPI } from "./BTCTurkAPI";
import { logger } from "../utils/logger";
import { TradingConfig, Trade } from "../../types/trading";

export class TradingStrategy {
  private api: BTCTurkAPI;
  private config: TradingConfig;
  private lastPrices: Map<string, number>;
  private movingAverages: Map<string, number[]>;

  constructor(config: TradingConfig) {
    this.api = new BTCTurkAPI();
    this.config = config;
    this.lastPrices = new Map();
    this.movingAverages = new Map();
  }

  async evaluatePosition(pair: string): Promise<Trade | null> {
    try {
      const ticker = await this.api.getTicker(pair);
      const currentPrice = parseFloat(ticker.last);

      // Update price history
      if (!this.movingAverages.has(pair)) {
        this.movingAverages.set(pair, []);
      }

      const prices = this.movingAverages.get(pair)!;
      prices.push(currentPrice);
      if (prices.length > 24) {
        // Keep last 24 prices for 24-hour average
        prices.shift();
      }

      const average = prices.reduce((a, b) => a + b, 0) / prices.length;
      const priceChange = ((currentPrice - average) / average) * 100;

      // Strategy implementation
      if (priceChange < -this.config.profitTarget && prices.length >= 5) {
        const trade = await this.executeTrade(pair, "buy", currentPrice);
        return trade;
      } else if (priceChange > this.config.profitTarget && prices.length >= 5) {
        const trade = await this.executeTrade(pair, "sell", currentPrice);
        return trade;
      }

      return null;
    } catch (error) {
      logger.error("Error evaluating position:", error);
      return null;
    }
  }

  private async executeTrade(
    pair: string,
    action: "buy" | "sell",
    price: number,
  ): Promise<Trade> {
    try {
      const amount = this.config.tradeAmount / price;
      const order = await this.api.createOrder(pair, amount, price, action);

      return {
        coin: pair,
        action: action === "buy" ? "Buy" : "Sell",
        price: price,
        time: new Date().toLocaleTimeString(),
        status: order.success ? "OK" : "Failed",
      };
    } catch (error) {
      logger.error("Error executing trade:", error);
      return {
        coin: pair,
        action: action === "buy" ? "Buy" : "Sell",
        price: price,
        time: new Date().toLocaleTimeString(),
        status: "Failed",
      };
    }
  }
}
