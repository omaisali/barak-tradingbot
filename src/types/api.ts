import type { Ticker } from './trading';

export interface APIResponse {
  data: Ticker[];
  success: boolean;
  message?: Record<string, any>;
  code?: number;
}