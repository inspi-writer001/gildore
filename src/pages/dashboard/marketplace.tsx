import { useState } from "react"
import { ListFilter, Loader2, X } from "lucide-react"
import { ProductCard } from "../../components/dashboard/product-card"
import { ListingDetailPanel } from "../../components/dashboard/listing-detail-panel"
import { MarketplaceFilterBar } from "../../components/dashboard/marketplace-filter-bar"
import { useActiveListings } from "../../hooks/useMarketplace"
import { useTraitTypes } from "../../hooks/useTraitTypes"
import { useMarketplaceFilters } from "../../hooks/useMarketplaceFilters"
import type { EnrichedListing } from "../../types/marketplace"

export const Marketplace = () => {
  const { data: listings, error } = useActiveListings();
  const { traitTypes } = useTraitTypes();
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const traitTypeNames = traitTypes.map((t) => t.name);

  const {
    categoryFilter,
    setCategoryFilter,
    traitFilters,
    setTraitFilter,
    availableTraitValues,
    filteredListings,
    activeFilterCount,
    clearAll,
  } = useMarketplaceFilters(listings, traitTypeNames);

  return (
    <div className="px-4">
        {/* filter menu */}
        <div className="flex items-center justify-end pb-4">
            <div
              className="w-10 md:w-12 h-10 md:h-12 bg-card flex items-center justify-center cursor-pointer relative"
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
                {filtersOpen ? (
                  <X className="text-[#FBC052]" />
                ) : (
                  <ListFilter className={activeFilterCount > 0 ? "text-[#FBC052]" : ""} />
                )}
                {activeFilterCount > 0 && !filtersOpen && (
                  <span className="absolute -top-1 -right-1 bg-[#FBC052] text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
            </div>
        </div>

        {/* filter bar */}
        {filtersOpen && listings && (
          <MarketplaceFilterBar
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            traitFilters={traitFilters}
            onTraitFilterChange={setTraitFilter}
            availableTraitValues={availableTraitValues}
            activeFilterCount={activeFilterCount}
            onClearAll={clearAll}
          />
        )}

        {/* market place list */}
        {!listings && !error && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-400 text-sm">Failed to load listings. Please try again.</p>
          </div>
        )}

        {listings?.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/50 text-sm">No listings available at the moment.</p>
          </div>
        )}

        {listings && listings.length > 0 && filteredListings.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-white/50 text-sm mb-2">No listings match your filters.</p>
              <button
                onClick={clearAll}
                className="text-[#FBC052] text-sm hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {filteredListings.length > 0 && (
          <div className="flex gap-4">
            {/* Product grid — shrinks when panel is open */}
            <div
              className={`w-full max-h-[calc(100vh_-_150px)] h-auto grid gap-2 md:gap-4 overflow-y-auto pb-20 items-start ${
                selectedListing
                  ? "grid-cols-2 lg:grid-cols-2"
                  : "grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredListings.map((listing) => (
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
