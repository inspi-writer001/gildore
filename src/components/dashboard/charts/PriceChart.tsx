import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, RefreshCw } from "lucide-react";
import type { PythPricesData } from "../../../hooks/usePythPrices";
import type { MetalType, TimeRange } from "../../../types/pyth";

interface PriceChartProps {
  pythData: PythPricesData;
}

const METAL_COLORS: Record<MetalType, string> = {
  XAU: "#FBC052",
  XAG: "#BDBDBD",
};

const TIME_RANGES: TimeRange[] = ["7D", "30D"];

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export const PriceChart = ({ pythData }: PriceChartProps) => {
  const {
    selectedMetal: metal,
    selectedTimeRange: timeRange,
    setMetal,
    setTimeRange,
    historicalCandles: candles,
    isHistoryLoading,
    isHistoryError,
    refetchHistory,
  } = pythData;

  const currentTick = metal === "XAU" ? pythData.xau : pythData.xag;
  const accent = METAL_COLORS[metal];
  const hasData = candles.length > 0;

  // For area chart, map candles to {timestamp, pricePerGram} using close price
  const areaData = candles.map((c) => ({
    timestamp: c.timestamp,
    pricePerGram: c.close,
  }));

  return (
    <div className="col-span-2 min-h-[300px] h-full bg-card py-4 px-4 md:px-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Metal tabs */}
          <div className="flex bg-background/50 rounded-md overflow-hidden">
            {(["XAU", "XAG"] as MetalType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetal(m)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
                  metal === m
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Time range selector */}
          <div className="flex bg-background/50 rounded-md overflow-hidden">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  timeRange === r
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Current price + Pyth indicator */}
        <div className="flex items-center gap-3">
          {currentTick && (
            <div className="text-right">
              <p className="anton text-lg md:text-xl" style={{ color: accent }}>
                ${currentTick.pricePerGram.toFixed(2)}
                <span className="text-xs text-white/40 ml-1">/gram</span>
              </p>
              <p className="text-[10px] text-white/30">
                ${currentTick.pricePerOz.toFixed(2)}/oz
              </p>
            </div>
          )}
          {/* Pyth freshness dot */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  backgroundColor: currentTick ? "#22c55e" : "#ef4444",
                }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{
                  backgroundColor: currentTick ? "#22c55e" : "#ef4444",
                }}
              />
            </span>
            <span className="text-[10px] text-white/30">Pyth</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0">
        {isHistoryLoading && !hasData ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : isHistoryError ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-white/30 text-sm">Failed to load price data</p>
            <button
              onClick={() => refetchHistory()}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white/60 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-sm">No price data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient
                  id={`gradient-${metal}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(ts) => formatTimestamp(ts)}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                width={65}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  fontSize: 12,
                }}
                labelFormatter={(ts) =>
                  new Date(ts as number).toLocaleString()
                }
                formatter={(value) => [
                  `$${Number(value).toFixed(4)}`,
                  "Price/gram",
                ]}
              />
              <Area
                type="monotone"
                dataKey="pricePerGram"
                stroke={accent}
                strokeWidth={2}
                fill={`url(#gradient-${metal})`}
                dot={false}
                activeDot={{ r: 3, fill: accent }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
