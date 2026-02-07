export type MetalType = "XAU" | "XAG";

export interface PythPriceData {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
}

export interface PythParsedFeed {
  id: string;
  price: PythPriceData["price"];
  ema_price: PythPriceData["ema_price"];
}

export interface PythHermesResponse {
  parsed: PythParsedFeed[];
}

export interface PriceTick {
  timestamp: number;
  pricePerOz: number;
  pricePerGram: number;
  confidence: number;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// TradingView history response from Pyth Benchmarks
export interface TradingViewHistoryResponse {
  s: string; // "ok" or "error"
  t: number[]; // timestamps (unix seconds)
  o: number[]; // open prices
  h: number[]; // high prices
  l: number[]; // low prices
  c: number[]; // close prices
  v: number[]; // volumes
}

export type TimeRange = "1H" | "1D" | "7D" | "30D";

export interface TimeRangeConfig {
  seconds: number; // total duration in seconds
  resolution: string; // candle resolution for Benchmarks API (e.g., "1", "5", "60", "1D")
}
