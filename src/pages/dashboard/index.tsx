import { AnalyticsCards } from "../../components/dashboard/AnalyticsCards";
import { BuyGoldCard } from "../../components/dashboard/BuyGoldCard";
import { PriceChart } from "../../components/dashboard/charts";
import { usePythPrices } from "../../hooks/usePythPrices";

export const Dashboard = () => {
  const pythData = usePythPrices();

  return (
    <div className="w-full flex flex-col gap-4 overflow-y-auto">
      <AnalyticsCards pythData={pythData} />

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 h-full">
        <div className="block md:hidden w-full mb-4">
          <BuyGoldCard />
        </div>

        <PriceChart pythData={pythData} />

        <div className="hidden md:block">
          <BuyGoldCard />
        </div>
      </div>
    </div>
  );
};
