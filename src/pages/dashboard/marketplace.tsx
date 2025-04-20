import { ListFilter } from "lucide-react"
import { ProductCard } from "../../components/dashboard/product-card"

export const Marketplace = () => {
  return (
    <div className="px-4">
        {/* filter menu */}
        <div className="flex items-center justify-end pb-4">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-card flex items-center justify-center cursor-pointer">
                <ListFilter />
            </div>
        </div>

        {/* market place list */}
        <div className="w-full max-h-[calc(100vh_-_150px)] h-auto grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 overflow-y-auto pb-20 items-start">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </div>
    </div>
  )
}
