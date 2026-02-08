import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useTraitTypes() {
  const traitTypes = useQuery(api.traitTypes.list);
  const createMutation = useMutation(api.traitTypes.create);

  return {
    traitTypes: traitTypes ?? [],
    isLoading: traitTypes === undefined,
    createTraitType: (name: string) => createMutation({ name }),
  };
}
