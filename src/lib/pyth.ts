import type {
  PythParsedFeed,
  PriceTick,
  CandleData,
  TimeRange,
  TimeRangeConfig,
  TradingViewHistoryResponse,
} from "../types/pyth";

export const PYTH_FEED_IDS = {
  XAU: "0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2",
  XAG: "0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e",
} as const;

export const TROY_OZ_TO_GRAMS = 31.1035;

const HERMES_BASE_URL = "https://hermes.pyth.network";

export const PYTH_BENCHMARKS_URL = "https://benchmarks.pyth.network";

export const PYTH_SYMBOLS = {
  XAU: "XAUUSD",
  XAG: "XAGUSD",
} as const;

export const TIME_RANGE_CONFIGS: Record<TimeRange, TimeRangeConfig> = {
  "1H": { seconds: 3600, resolution: "1" },
  "1D": { seconds: 86400, resolution: "5" },
  "7D": { seconds: 604800, resolution: "60" },
  "30D": { seconds: 2592000, resolution: "1D" },
};

export function buildPythPriceUrl(feedIds: string[]): string {
  const params = feedIds.map((id) => `ids[]=${id}`).join("&");
  return `${HERMES_BASE_URL}/v2/updates/price/latest?${params}&parsed=true`;
}

export function parsePythPrice(feed: PythParsedFeed): PriceTick {
  const rawPrice = Number(feed.price.price);
  const expo = feed.price.expo;
  const pricePerOz = rawPrice * Math.pow(10, expo);
  const pricePerGram = pricePerOz / TROY_OZ_TO_GRAMS;
  const confidence =
    (Number(feed.price.conf) * Math.pow(10, expo)) / TROY_OZ_TO_GRAMS;

  return {
    timestamp: feed.price.publish_time * 1000,
    pricePerOz,
    pricePerGram,
    confidence,
  };
}

export async function fetchHistoricalCandles(
  symbol: string,
  timeRange: TimeRange
): Promise<CandleData[]> {
  const config = TIME_RANGE_CONFIGS[timeRange];
  const now = Math.floor(Date.now() / 1000);
  const from = now - config.seconds;

  const url = `${PYTH_BENCHMARKS_URL}/v1/shims/tradingview/history?symbol=${encodeURIComponent(symbol)}&resolution=${config.resolution}&from=${from}&to=${now}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pyth Benchmarks error: ${res.status}`);

  const data: TradingViewHistoryResponse = await res.json();
  if (data.s !== "ok") throw new Error(`Pyth Benchmarks status: ${data.s}`);

  const candles: CandleData[] = [];
  for (let i = 0; i < data.t.length; i++) {
    candles.push({
      timestamp: data.t[i] * 1000, // convert to ms
      open: data.o[i] / TROY_OZ_TO_GRAMS,
      high: data.h[i] / TROY_OZ_TO_GRAMS,
      low: data.l[i] / TROY_OZ_TO_GRAMS,
      close: data.c[i] / TROY_OZ_TO_GRAMS,
    });
  }

  return candles;
}
