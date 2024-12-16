export interface Trade {
  coin: string;
  action: "Buy" | "Sell";
  price: number;
  time: string;
  status: "OK" | "Failed";
}

export interface CoinStatus {
  name: string;
  trend?: string;
  volatility?: number;
  threshold?: number;
}

export interface CoinConfig {
  name: string;
  trend?: string;
  volatility?: number;
  threshold?: number;
}

export interface TradingConfig {
  tradeAmount: number;
  profitTarget: number;
  queryInterval: number;
  maxOpenPositions: number;
}

export interface BalanceItem {
  asset: string;
  assetname: string;
  balance: string;
  locked: string;
  free: string;
  orderFund: string;
  requestFund: string;
  precision: number;
}

export interface SocketEvents {
  trade: (trade: Trade) => void;
  status: (status: { status: string }) => void;
  error: (error: string) => void;
  balance: (balance: BalanceItem[]) => void;
}
