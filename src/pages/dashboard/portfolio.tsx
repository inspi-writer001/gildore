import { Loader2 } from "lucide-react";
import { usePortfolioAssets } from "../../hooks/useMarketplace";
import { PortfolioCard } from "../../components/dashboard/portfolio-card";

export const Porfolio = () => {
  const { data: assets, error } = usePortfolioAssets();

  return (
    <div className="px-4">
      <h2 className="anton text-2xl uppercase text-white pb-4">My Assets</h2>

      {!assets && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-400 text-sm">Failed to load portfolio. Please try again.</p>
        </div>
      )}

      {assets?.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/50 text-sm">You don't own any assets yet. Visit the marketplace to purchase.</p>
        </div>
      )}

      {assets && assets.length > 0 && (
        <div className="w-full max-h-[calc(100vh_-_150px)] h-auto grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 overflow-y-auto pb-20 items-start">
          {assets.map((asset) => (
            <PortfolioCard key={asset.address.toBase58()} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
};
