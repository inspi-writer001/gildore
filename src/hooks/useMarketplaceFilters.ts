import { useState, useMemo, useCallback } from "react";
import type { EnrichedListing } from "../types/marketplace";

export type CategoryFilter = "all" | "gold" | "silver";

export interface MarketplaceFilterState {
  categoryFilter: CategoryFilter;
  traitFilters: Record<string, string>;
}

export function useMarketplaceFilters(
  listings: EnrichedListing[] | undefined,
  traitTypeNames: string[]
) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [traitFilters, setTraitFilters] = useState<Record<string, string>>({});

  const availableTraitValues = useMemo(() => {
    const map = new Map<string, Set<string>>();
    if (!listings) return new Map<string, string[]>();

    for (const listing of listings) {
      const attrs = listing.metadata.attributes;
      if (!attrs) continue;
      for (const attr of attrs) {
        if (!traitTypeNames.includes(attr.trait_type)) continue;
        if (!map.has(attr.trait_type)) map.set(attr.trait_type, new Set());
        if (attr.value) map.get(attr.trait_type)!.add(attr.value);
      }
    }

    const result = new Map<string, string[]>();
    for (const [key, values] of map) {
      if (values.size > 0) {
        result.set(key, Array.from(values).sort());
      }
    }
    return result;
  }, [listings, traitTypeNames]);

  const filteredListings = useMemo(() => {
    if (!listings) return [];

    return listings.filter((listing) => {
      // Category filter
      if (categoryFilter !== "all") {
        const name = listing.metadata.name?.toLowerCase() ?? "";
        const desc = listing.metadata.description?.toLowerCase() ?? "";
        const materialAttr = listing.metadata.attributes?.find(
          (a) => a.trait_type.toLowerCase() === "material"
        );
        const materialVal = materialAttr?.value?.toLowerCase() ?? "";

        const matches =
          name.includes(categoryFilter) ||
          desc.includes(categoryFilter) ||
          materialVal.includes(categoryFilter);

        if (!matches) return false;
      }

      // Trait filters
      for (const [traitType, value] of Object.entries(traitFilters)) {
        if (!value) continue;
        const attrs = listing.metadata.attributes;
        if (!attrs) return false;
        const attr = attrs.find((a) => a.trait_type === traitType);
        if (!attr || attr.value !== value) return false;
      }

      return true;
    });
  }, [listings, categoryFilter, traitFilters]);

  const activeFilterCount = useMemo(() => {
    let count = categoryFilter !== "all" ? 1 : 0;
    for (const value of Object.values(traitFilters)) {
      if (value) count++;
    }
    return count;
  }, [categoryFilter, traitFilters]);

  const setTraitFilter = useCallback((traitType: string, value: string) => {
    setTraitFilters((prev) => ({ ...prev, [traitType]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setCategoryFilter("all");
    setTraitFilters({});
  }, []);

  return {
    categoryFilter,
    setCategoryFilter,
    traitFilters,
    setTraitFilter,
    availableTraitValues,
    filteredListings,
    activeFilterCount,
    clearAll,
  };
}
