import { useSolanaProvider } from "./useSolanaProvider";
import { getMarketplaceAdmin } from "../constant";

export function useIsAdmin(): boolean {
  const { walletAddress } = useSolanaProvider();

  if (!walletAddress) return false;

  try {
    const admin = getMarketplaceAdmin();
    return walletAddress === admin.toBase58();
  } catch {
    return false;
  }
}
