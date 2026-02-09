import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { EnrichedListing } from "../../types/marketplace";
import { usePurchaseNft } from "../../hooks/useTransactions";

interface ListingDetailPanelProps {
  listing: EnrichedListing;
  onClose: () => void;
}

export const ListingDetailPanel = ({
  listing,
  onClose,
}: ListingDetailPanelProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const purchase = usePurchaseNft();

  const handlePurchase = () => {
    purchase.mutate(
      {
        assetAddress: listing.assetAddress,
        seller: listing.account.seller,
      },
      {
        onSuccess: () => {
          setShowConfirm(false);
          onClose();
        },
        onError: () => {
          // keep confirm visible so user sees the error
        },
      }
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto lg:min-w-[360px] lg:max-w-[400px] bg-card overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center px-6 py-8">
          {/* Image */}
          <div className="w-[200px] h-[200px] flex items-center justify-center">
            {listing.metadata.image ? (
              <img
                src={listing.metadata.image}
                alt={listing.metadata.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src="/images/marketplace/gold-bar-product.png"
                alt={listing.metadata.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold anton uppercase text-white mt-6 text-center">
            {listing.metadata.name}
          </h2>

          {/* Price */}
          <p className="text-lg text-[#FBC052] font-semibold mt-1">
            {listing.priceInSol} SOL
          </p>

          {/* Traits / Attributes */}
          {listing.metadata.attributes &&
            listing.metadata.attributes.length > 0 && (
              <div className="w-full mt-6">
                <p className="text-xs uppercase font-glory text-light-gray tracking-wide mb-2">
                  Traits
                </p>
                <div className="bg-white/5 divide-y divide-white/10">
                  {listing.metadata.attributes.map((attr) => (
                    <div
                      key={attr.trait_type}
                      className="flex justify-between px-4 py-2.5"
                    >
                      <span className="text-xs uppercase font-glory text-light-gray tracking-wide">
                        {attr.trait_type}
                      </span>
                      <span className="text-sm text-white">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Description */}
          {listing.metadata.description && (
            <div className="w-full mt-6">
              <p className="text-xs uppercase font-glory text-light-gray tracking-wide mb-2">
                Description
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {listing.metadata.description}
              </p>
            </div>
          )}

          {/* Buy / Confirm section */}
          <div className="w-full mt-8">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 bg-[#FBC052] hover:bg-[#e5ad47] text-black font-bold uppercase text-sm tracking-wide transition-colors"
              >
                Buy ({listing.priceInSol} SOL)
              </button>
            ) : (
              <div className="bg-white/5 p-4 flex flex-col items-center gap-3">
                <p className="text-white text-sm text-center">
                  Purchase{" "}
                  <span className="font-bold">{listing.metadata.name}</span>{" "}
                  for{" "}
                  <span className="font-bold">
                    {listing.priceInSol} SOL
                  </span>
                  ?
                </p>

                {purchase.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#FBC052]" />
                ) : (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handlePurchase}
                      className="flex-1 py-2 bg-[#FBC052] hover:bg-[#e5ad47] text-black font-semibold text-xs uppercase tracking-wide transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                        purchase.reset();
                      }}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wide transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {purchase.isError && (
                  <p className="text-red-400 text-xs text-center">
                    Transaction failed. Please try again.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
