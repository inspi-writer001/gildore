import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { PortfolioAsset } from "../../types/marketplace";
import { useRedeemAsset } from "../../hooks/useTransactions";

interface PortfolioCardProps {
  asset: PortfolioAsset;
}

export const PortfolioCard = ({ asset }: PortfolioCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const redeem = useRedeemAsset();

  const canRedeem = !!asset.listing;
  const image = asset.metadata?.image;
  const name = asset.metadata?.name || asset.name;

  const handleRedeem = () => {
    if (!asset.listing) return;

    redeem.mutate(
      {
        assetAddress: asset.address,
        seller: asset.listing.seller,
      },
      {
        onSuccess: () => {
          setShowConfirm(false);
        },
        onError: () => {
          setShowConfirm(false);
        },
      }
    );
  };

  return (
    <div className="w-full py-4 bg-card flex flex-col justify-center items-center cursor-pointer h-[286px] relative overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-[66px] h-[66px] object-contain"
        />
      ) : (
        <img
          src="/images/marketplace/gold-bar-product.png"
          className="w-[66px] h-auto"
          alt={name}
        />
      )}

      <h5 className="text-center text-2xl font-bold anton uppercase text-white pt-4">
        {name}
      </h5>

      {asset.listing && (
        <p className="text-sm text-center text-[#D1D1D1] pt-1">
          {asset.listing.price.toNumber() / LAMPORTS_PER_SOL} SOL
        </p>
      )}

      {canRedeem && !showConfirm && (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-3 px-6 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wide transition-colors"
        >
          Redeem
        </button>
      )}

      {showConfirm && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4">
          <p className="text-white text-sm text-center font-bold">Redeem Asset</p>
          <p className="text-white/70 text-xs text-center">
            A half-fee will be charged and this asset will be burned for physical fulfillment.
          </p>

          {redeem.isPending ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleRedeem}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {redeem.isError && (
            <p className="text-red-400 text-xs text-center mt-1">
              Redeem failed. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
