import axios from "axios";
import CryptoJS from "crypto-js";
import { API_CONFIG } from "../config/apiConfig";

export class BTCTurkAPI {
  private baseUrl: string;
  private publicKey: string;
  private privateKey: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.publicKey = API_CONFIG.PUBLIC_KEY;
    this.privateKey = API_CONFIG.PRIVATE_KEY;
  }

  private generateSignature(message: string): string {
    const key = CryptoJS.enc.Base64.parse(this.privateKey);
    return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Base64);
  }

  private getHeaders(
    method: string,
    path: string,
    body: string = "",
  ): Record<string, string> {
    const stamp = Date.now();
    const message = `${this.publicKey}${stamp}`;
    const signature = this.generateSignature(message);

    return {
      "X-PCK": this.publicKey,
      "X-Stamp": stamp.toString(),
      "X-Signature": signature,
      "Content-Type": "application/json",
    };
  }

  async getTicker(pair: string): Promise<any> {
    try {
      const path = `/api/v2/ticker?pairSymbol=${pair}`;
      const response = await axios.get(`${this.baseUrl}${path}`, {
        headers: this.getHeaders("GET", path),
      });
      return response.data.data[0];
    } catch (error) {
      console.error("Error fetching ticker:", error);
      throw error;
    }
  }

  async getBalance(): Promise<any> {
    try {
      const path = "/api/v1/users/balances";
      const response = await axios.get(`${this.baseUrl}${path}`, {
        headers: this.getHeaders("GET", path),
      });
      console.log("balance: ");
      console.log(response.data.data.length);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }

  async createOrder(
    pair: string,
    amount: number,
    price: number,
    side: "buy" | "sell",
  ): Promise<any> {
    try {
      const path = "/api/v1/order";
      const body = JSON.stringify({
        quantity: amount.toFixed(8),
        price: price.toFixed(2),
        stopPrice: 0,
        newOrderClientId: `bot_${Date.now()}`,
        orderMethod: "limit",
        orderType: side,
        pairSymbol: pair,
      });

      const response = await axios.post(`${this.baseUrl}${path}`, body, {
        headers: this.getHeaders("POST", path, body),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}
