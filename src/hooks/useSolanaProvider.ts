import { useMemo } from "react";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
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
  const { user } = usePrivy();
  const { wallets } = useSolanaWallets();

  // Wallet addresses linked to the current authenticated user
  const linkedAddresses = useMemo(() => {
    if (!user?.linkedAccounts) return new Set<string>();
    const addresses = new Set<string>();
    for (const account of user.linkedAccounts) {
      if ("address" in account && typeof account.address === "string") {
        addresses.add(account.address);
      }
    }
    return addresses;
  }, [user?.linkedAccounts]);

  // Embedded wallets are always owned by the current user (created by Privy).
  // External wallets must be verified against linkedAccounts to prevent
  // stale wallets from a previous session being picked up via auto-connect.
  const solanaWallet = useMemo(() => {
    if (wallets.length === 0) return null;

    const ownedExternalWallets = wallets.filter(
      (w) => w.walletClientType !== "privy" && linkedAddresses.has(w.address)
    );
    const embeddedWallets = wallets.filter(
      (w) => w.walletClientType === "privy"
    );

    return ownedExternalWallets[0] || embeddedWallets[0] || null;
  }, [wallets, linkedAddresses]);

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

  // Always create a provider — uses real wallet when available, otherwise a
  // read-only dummy so that the Anchor Program can decode/fetch accounts
  // without requiring a connected wallet.
  const provider = useMemo(() => {
    const wallet = anchorWallet ?? {
      publicKey: PublicKey.default,
      signTransaction: async <T extends Transaction | VersionedTransaction>(): Promise<T> => {
        throw new Error("Wallet not connected");
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(): Promise<T[]> => {
        throw new Error("Wallet not connected");
      },
    };
    return new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
  }, [connection, anchorWallet]);

  // Program is always available for read operations (decoding, fetching).
  // Signing transactions will fail unless a real wallet is connected.
  const program = useMemo(
    () => new Program<AnchorMarketplace>(idl as AnchorMarketplace, provider),
    [provider]
  );

  return {
    connection,
    provider,
    program,
    walletAddress: solanaWallet?.address ?? null,
    publicKey: anchorWallet?.publicKey ?? null,
    isWalletReady: !!anchorWallet,
  };
}
