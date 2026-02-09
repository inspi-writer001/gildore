import type { EnrichedListing } from "../../types/marketplace";

interface ProductCardProps {
  listing: EnrichedListing;
  onSelect: (listing: EnrichedListing) => void;
}

export const ProductCard = ({ listing, onSelect }: ProductCardProps) => {
  return (
    <div
      onClick={() => onSelect(listing)}
      className="w-full py-4 bg-card flex flex-col justify-center items-center cursor-pointer h-[286px] hover:bg-white/5 transition-colors"
    >
      {listing.metadata.image ? (
        <img
          src={listing.metadata.image}
          alt={listing.metadata.name}
          className="w-[66px] h-[66px] object-contain"
        />
      ) : (
        <img
          src="/images/marketplace/gold-bar-product.png"
          className="w-[66px] h-auto"
          alt={listing.metadata.name}
        />
      )}

      <h5 className="text-center text-2xl font-bold anton uppercase text-white pt-4">
        {listing.metadata.name}
      </h5>

      <p className="text-sm text-center text-[#D1D1D1] pt-1">
        {listing.priceInSol} SOL
      </p>
    </div>
  );
};
