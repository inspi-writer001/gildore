import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useSolanaProvider } from "./useSolanaProvider";
import {
  getMarketplacePDA,
  getListingPDA,
  getEscrowPDA,
  MPL_CORE_PROGRAM_ID,
} from "../constant";

interface CreateNftParams {
  name: string;
  uri: string;
}

interface ListNftParams {
  assetAddress: PublicKey;
  price: number; // in SOL
  tokenId: number;
}

export function useCreateNft() {
  const { program, publicKey } = useSolanaProvider();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, uri }: CreateNftParams) => {
      if (!program || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const asset = Keypair.generate();
      const marketplacePDA = getMarketplacePDA();

      const tx = await program.methods
        .createNft({ name, uri })
        .accountsPartial({
          creator: publicKey,
          asset: asset.publicKey,
          collection: null,
          marketplace: marketplacePDA,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([asset])
        .rpc();

      return { tx, assetAddress: asset.publicKey };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-assets"] });
    },
  });
}

export function useListNft() {
  const { program, publicKey } = useSolanaProvider();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetAddress, price, tokenId }: ListNftParams) => {
      if (!program || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const marketplacePDA = getMarketplacePDA();
      const listingPDA = getListingPDA(marketplacePDA, assetAddress);
      const escrowPDA = getEscrowPDA(listingPDA);

      const lamports = new BN(Math.floor(price * 1e9));

      const tx = await program.methods
        .listNft({ price: lamports, tokenId })
        .accountsPartial({
          seller: publicKey,
          asset: assetAddress,
          collection: null,
          marketplace: marketplacePDA,
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
      queryClient.invalidateQueries({ queryKey: ["admin-assets"] });
    },
  });
}
