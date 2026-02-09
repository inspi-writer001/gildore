import type { CategoryFilter } from "../../hooks/useMarketplaceFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MarketplaceFilterBarProps {
  categoryFilter: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  traitFilters: Record<string, string>;
  onTraitFilterChange: (traitType: string, value: string) => void;
  availableTraitValues: Map<string, string[]>;
  activeFilterCount: number;
  onClearAll: () => void;
}

export function MarketplaceFilterBar({
  categoryFilter,
  onCategoryChange,
  traitFilters,
  onTraitFilterChange,
  availableTraitValues,
  activeFilterCount,
  onClearAll,
}: MarketplaceFilterBarProps) {
  return (
    <div className="bg-card border border-white/10 p-4 mb-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Category filter */}
        <div>
          <label className="text-xs uppercase font-glory text-light-gray tracking-wide block mb-1">
            Category
          </label>
          <Select
            value={categoryFilter}
            onValueChange={(v) => onCategoryChange(v as CategoryFilter)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic trait filters */}
        {Array.from(availableTraitValues.entries()).map(([traitType, values]) => (
          <div key={traitType}>
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide block mb-1 capitalize">
              {traitType}
            </label>
            <Select
              value={traitFilters[traitType] || "all"}
              onValueChange={(v) =>
                onTraitFilterChange(traitType, v === "all" ? "" : v)
              }
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {values.map((val) => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* Clear all */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[#FBC052] text-sm hover:underline cursor-pointer pb-1"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
