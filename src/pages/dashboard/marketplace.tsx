import { useState } from "react"
import { ListFilter, Loader2 } from "lucide-react"
import { ProductCard } from "../../components/dashboard/product-card"
import { ListingDetailPanel } from "../../components/dashboard/listing-detail-panel"
import { useActiveListings } from "../../hooks/useMarketplace"
import type { EnrichedListing } from "../../types/marketplace"

export const Marketplace = () => {
  const { data: listings, isLoading, error } = useActiveListings();
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);

  return (
    <div className="px-4">
        {/* filter menu */}
        <div className="flex items-center justify-end pb-4">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-card flex items-center justify-center cursor-pointer">
                <ListFilter />
            </div>
        </div>

        {/* market place list */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-400 text-sm">Failed to load listings. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && listings?.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/50 text-sm">No listings available at the moment.</p>
          </div>
        )}

        {!isLoading && !error && listings && listings.length > 0 && (
          <div className="flex gap-4">
            {/* Product grid — shrinks when panel is open */}
            <div
              className={`w-full max-h-[calc(100vh_-_150px)] h-auto grid gap-2 md:gap-4 overflow-y-auto pb-20 items-start ${
                selectedListing
                  ? "grid-cols-2 lg:grid-cols-2"
                  : "grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {listings.map((listing) => (
                <ProductCard
                  key={listing.publicKey.toBase58()}
                  listing={listing}
                  onSelect={setSelectedListing}
                />
              ))}
            </div>

            {/* Detail panel */}
            {selectedListing && (
              <ListingDetailPanel
                listing={selectedListing}
                onClose={() => setSelectedListing(null)}
              />
            )}
          </div>
        )}
    </div>
  )
}
