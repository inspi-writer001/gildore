import { AnalyticsCards } from "../../components/dashboard/AnalyticsCards";
import { BuyGoldCard } from "../../components/dashboard/BuyGoldCard";

export const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-4 overflow-y-auto">
      <AnalyticsCards />

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 h-full">
        <div className="block md:hidden w-full mb-4">
          <BuyGoldCard />
        </div>

        <div className="col-span-2 min-h-[300px] h-full bg-card py-4"></div>

        <div className="hidden md:block">
          <BuyGoldCard />
        </div>
      </div>
    </div>
  );
};
