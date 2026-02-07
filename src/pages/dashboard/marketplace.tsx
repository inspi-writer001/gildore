import { ListFilter, Loader2 } from "lucide-react"
import { ProductCard } from "../../components/dashboard/product-card"
import { useActiveListings } from "../../hooks/useMarketplace"

export const Marketplace = () => {
  const { data: listings, isLoading, error } = useActiveListings();

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
          <div className="w-full max-h-[calc(100vh_-_150px)] h-auto grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 overflow-y-auto pb-20 items-start">
            {listings.map((listing) => (
              <ProductCard key={listing.publicKey.toBase58()} listing={listing} />
            ))}
          </div>
        )}
    </div>
  )
}
