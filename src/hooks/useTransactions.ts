import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useSolanaProvider } from "./useSolanaProvider";
import {
  getMarketplacePDA,
  getListingPDA,
  getEscrowPDA,
  getTreasuryPDA,
  MPL_CORE_PROGRAM_ID,
} from "../constant";

interface PurchaseParams {
  assetAddress: PublicKey;
  seller: PublicKey;
}

interface RedeemParams {
  assetAddress: PublicKey;
  seller: PublicKey;
}

export function usePurchaseNft() {
  const { program, publicKey } = useSolanaProvider();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetAddress, seller }: PurchaseParams) => {
      if (!program || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const marketplacePDA = getMarketplacePDA();
      const listingPDA = getListingPDA(marketplacePDA, assetAddress);
      const escrowPDA = getEscrowPDA(listingPDA);
      const treasuryPDA = getTreasuryPDA(marketplacePDA);

      const tx = await program.methods
        .purchaseNft()
        .accountsPartial({
          buyer: publicKey,
          seller: seller,
          asset: assetAddress,
          collection: null,
          escrow: escrowPDA,
          listing: listingPDA,
          marketplace: marketplacePDA,
          treasury: treasuryPDA,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function useRedeemAsset() {
  const { program, publicKey } = useSolanaProvider();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetAddress, seller }: RedeemParams) => {
      if (!program || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const marketplacePDA = getMarketplacePDA();
      const listingPDA = getListingPDA(marketplacePDA, assetAddress);
      const escrowPDA = getEscrowPDA(listingPDA);
      const treasuryPDA = getTreasuryPDA(marketplacePDA);

      const tx = await program.methods
        .redeemAsset()
        .accountsPartial({
          owner: publicKey,
          asset: assetAddress,
          seller: seller,
          marketplace: marketplacePDA,
          treasury: treasuryPDA,
          listing: listingPDA,
          escrow: escrowPDA,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}
