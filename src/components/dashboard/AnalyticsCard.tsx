import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useWalletBalance } from "../../hooks/useMarketplace";

interface AnalyticsCardProps {
  type?: "default" | "silver" | "gold";
  livePrice?: number | null;
  priceChange?: number | null;
  isPriceLoading?: boolean;
}

export const AnalyticsCard = ({
  type = "default",
  livePrice,
  priceChange,
  isPriceLoading,
}: AnalyticsCardProps) => {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();

  const formattedPrice =
    livePrice != null ? `$${livePrice.toFixed(2)}` : "--";
  const formattedChange =
    priceChange != null ? `${Math.abs(priceChange).toFixed(2)}%` : "--";
  const isPositive = priceChange != null && priceChange >= 0;

  return (
    <div className="flex w-full py-5 md:py-8 px-6 pb-10 md:pb-14 bg-card flex-col justify-between items-start h-[170px] md:h-[252px] relative overflow-hidden">
      {type === "default" && (
        <>
          <h5 className="anton text-xs md:text-sm uppercase font-semibold text-light-gray">
            Wallet Balance
          </h5>
          {balanceLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          ) : (
            <h2 className="anton text-2xl md:text-4xl">
              {balance !== undefined ? `${balance.toFixed(4)} SOL` : "--"}
            </h2>
          )}
        </>
      )}

      {type !== "default" && (
        <>
          <div className="w-full flex items-center justify-between">
            <h5
              className={cn(
                "anton text-xs md:text-sm uppercase font-semibold text-light-gray",
                type === "gold" && "text-[#FBC052]",
                type === "silver" && "text-[#BDBDBD]"
              )}
            >
            {type === "gold" ? "gildore gold" : type === "silver" ? "gildore silver" : "Wallet Balance"}
            </h5>

            <h5 className="anton text-xs md:text-sm uppercase font-semibold text-light-gray">
              Price/Gram
            </h5>
          </div>

          <div className="w-full flex justify-between">
              <div className="flex flex-col gap-1 items-start">
                <h3 className="anton uppercase text-2xl md:text-3xl">10.000<span className="text-sm md:text-lg opacity-80">gdg</span></h3>
                <h3 className="anton uppercase text-sm md:text-lg">$720.00</h3>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {isPriceLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                ) : (
                  <h3 className="anton uppercase text-2xl md:text-3xl text-right">
                    {formattedPrice}
                  </h3>
                )}
                <div className="flex items-end gap-2">
                    <h3 className="anton uppercase text-sm md:text-lg text-right">
                      {formattedChange}
                    </h3>
                    {isPositive ? (
                      <TrendingUp className="stroke-green-500 w-3 md:w-4 h-3 md:h-4" />
                    ) : (
                      <TrendingDown className="stroke-red-500 w-3 md:w-4 h-3 md:h-4" />
                    )}
                </div>
              </div>
          </div>
        </>
      )}

      <img
        src={`/images/dashboard/analytics-card-pattern-${type}.svg`}
        className="w-full h-auto absolute -bottom-4  md:bottom-0 left-0"
      />
    </div>
  );
};
