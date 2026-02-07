import { useMemo } from "react";
import { useSolanaWallets } from "@privy-io/react-auth";
import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { SOLANA_RPC_URL } from "../constant";
import type { AnchorMarketplace } from "../../program/types/anchor_marketplace";
import idl from "../../program/idl/anchor_marketplace.json";

interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
}

export function useSolanaProvider() {
  const { wallets } = useSolanaWallets();

  // Prefer external wallets (Phantom, Solflare, etc.) over embedded wallets
  const solanaWallet = useMemo(() => {
    if (wallets.length === 0) return null;

    // Find first external wallet (imported)
    const externalWallet = wallets.find(w => w.walletClientType !== 'privy');

    // Fall back to embedded wallet, or first wallet if none found
    return externalWallet || wallets[0];
  }, [wallets]);

  const connection = useMemo(
    () => new Connection(SOLANA_RPC_URL, "confirmed"),
    []
  );

  const anchorWallet = useMemo<AnchorWallet | null>(() => {
    if (!solanaWallet?.address) return null;

    const pubkey = new PublicKey(solanaWallet.address);

    return {
      publicKey: pubkey,
      signTransaction: async <T extends Transaction | VersionedTransaction>(
        tx: T
      ): Promise<T> => {
        const signed = await solanaWallet.signTransaction(tx);
        return signed as T;
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(
        txs: T[]
      ): Promise<T[]> => {
        const signed: T[] = [];
        for (const tx of txs) {
          const s = await solanaWallet.signTransaction(tx);
          signed.push(s as T);
        }
        return signed;
      },
    };
  }, [solanaWallet]);

  const provider = useMemo(() => {
    if (!anchorWallet) return null;
    return new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
  }, [connection, anchorWallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program<AnchorMarketplace>(
      idl as AnchorMarketplace,
      provider
    );
  }, [provider]);

  return {
    connection,
    provider,
    program,
    walletAddress: solanaWallet?.address ?? null,
    publicKey: anchorWallet?.publicKey ?? null,
    isWalletReady: !!anchorWallet && !!program,
  };
}
