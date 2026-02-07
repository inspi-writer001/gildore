import { AnalyticsCard } from './AnalyticsCard'
import type { PythPricesData } from '../../hooks/usePythPrices'

interface AnalyticsCardsProps {
  pythData: PythPricesData;
}

export const AnalyticsCards = ({ pythData }: AnalyticsCardsProps) => {
  const goldPrice = pythData.xau?.pricePerGram ?? null;
  const silverPrice = pythData.xag?.pricePerGram ?? null;

  // Compute change from historical candles when viewing that metal
  const candles = pythData.historicalCandles;
  const selectedPrice = pythData.selectedMetal === "XAU" ? goldPrice : silverPrice;
  const openPrice = candles.length > 0 ? candles[0].close : null;
  const change = selectedPrice && openPrice
    ? ((selectedPrice - openPrice) / openPrice) * 100
    : null;

  const goldChange = pythData.selectedMetal === "XAU" ? change : null;
  const silverChange = pythData.selectedMetal === "XAG" ? change : null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4'>
        <AnalyticsCard />
        <AnalyticsCard
          type="gold"
          livePrice={goldPrice}
          priceChange={goldChange}
          isPriceLoading={pythData.isLoading}
        />
        <AnalyticsCard
          type="silver"
          livePrice={silverPrice}
          priceChange={silverChange}
          isPriceLoading={pythData.isLoading}
        />
    </div>
  )
}
