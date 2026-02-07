import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  PythHermesResponse,
  PriceTick,
  CandleData,
  MetalType,
  TimeRange,
} from "../types/pyth";
import {
  PYTH_FEED_IDS,
  PYTH_SYMBOLS,
  buildPythPriceUrl,
  parsePythPrice,
  fetchHistoricalCandles,
} from "../lib/pyth";

export interface PythPricesData {
  xau: PriceTick | null;
  xag: PriceTick | null;
  historicalCandles: CandleData[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  isError: boolean;
  selectedMetal: MetalType;
  selectedTimeRange: TimeRange;
  setMetal: (metal: MetalType) => void;
  setTimeRange: (range: TimeRange) => void;
}

export function usePythPrices(): PythPricesData {
  const [selectedMetal, setMetal] = useState<MetalType>("XAU");
  const [selectedTimeRange, setTimeRange] = useState<TimeRange>("1D");

  // Live price polling (both metals, 60s interval)
  const {
    data: liveData,
    isLoading: isLiveLoading,
    isError,
  } = useQuery({
    queryKey: ["pyth-live"],
    queryFn: async () => {
      const url = buildPythPriceUrl([PYTH_FEED_IDS.XAU, PYTH_FEED_IDS.XAG]);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Pyth API error: ${res.status}`);
      const json: PythHermesResponse = await res.json();

      let xau: PriceTick | null = null;
      let xag: PriceTick | null = null;

      for (const feed of json.parsed) {
        const tick = parsePythPrice(feed);
        const feedId = `0x${feed.id}`;
        if (feedId === PYTH_FEED_IDS.XAU) xau = tick;
        if (feedId === PYTH_FEED_IDS.XAG) xag = tick;
      }

      return { xau, xag };
    },
    refetchInterval: 60_000,
    staleTime: 55_000,
  });

  // Historical candle data
  const { data: historicalCandles, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["pyth-history", selectedMetal, selectedTimeRange],
    queryFn: () =>
      fetchHistoricalCandles(PYTH_SYMBOLS[selectedMetal], selectedTimeRange),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    xau: liveData?.xau ?? null,
    xag: liveData?.xag ?? null,
    historicalCandles: historicalCandles ?? [],
    isLoading: isLiveLoading,
    isHistoryLoading,
    isError,
    selectedMetal,
    selectedTimeRange,
    setMetal,
    setTimeRange,
  };
}
