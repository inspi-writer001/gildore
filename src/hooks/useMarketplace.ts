import { useQuery } from "@tanstack/react-query";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useSolanaProvider } from "./useSolanaProvider";
import {
  getMarketplacePDA,
  getListingPDA,
  getEscrowPDA,
  MPL_CORE_PROGRAM_ID,
} from "../constant";
import type {
  MarketplaceAccount,
  EnrichedListing,
  NftMetadata,
  PortfolioAsset,
  ListingAccount,
  AdminAsset,
} from "../types/marketplace";

/**
 * Read a uint32 LE from a Uint8Array/Buffer at the given offset.
 * Uses DataView for cross-platform browser compatibility.
 */
function readU32LE(data: Uint8Array, offset: number): number {
  return (
    data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16) |
    ((data[offset + 3] << 24) >>> 0)
  ) >>> 0;
}

const textDecoder = new TextDecoder();

/**
 * Parse the URI from a raw MPL Core BaseAssetV1 account buffer.
 *
 * Layout (after the 1-byte Key discriminator):
 *   owner:            32 bytes
 *   updateAuthority:  1 byte enum tag + 0 or 32 bytes
 *   name:             4 byte len + utf8
 *   uri:              4 byte len + utf8
 */
function parseMplCoreAsset(data: Uint8Array): {
  owner: PublicKey;
  name: string;
  uri: string;
} {
  let offset = 1; // skip Key discriminator byte

  // owner - 32 bytes
  const owner = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;

  // updateAuthority - enum tag (1 byte)
  const uaTag = data[offset];
  offset += 1;
  if (uaTag === 1 || uaTag === 2) {
    // Address or Collection variant: has a 32-byte pubkey
    offset += 32;
  }
  // uaTag === 0 (None): no extra data

  // name - borsh string: 4 byte LE length + utf8 bytes
  const nameLen = readU32LE(data, offset);
  offset += 4;
  const name = textDecoder.decode(data.slice(offset, offset + nameLen));
  offset += nameLen;

  // uri - borsh string: 4 byte LE length + utf8 bytes
  const uriLen = readU32LE(data, offset);
  offset += 4;
  const uri = textDecoder.decode(data.slice(offset, offset + uriLen));

  return { owner, name, uri };
}

async function fetchNftMetadata(uri: string): Promise<NftMetadata> {
  try {
    const res = await fetch(uri);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { name: "Unknown", image: "", description: "" };
  }
}

export function useMarketplaceAccount() {
  const { program } = useSolanaProvider();

  return useQuery<MarketplaceAccount | null>({
    queryKey: ["marketplace"],
    queryFn: async () => {
      if (!program) return null;
      const marketplacePDA = getMarketplacePDA();
      const account = await program.account.marketplace.fetch(marketplacePDA);
      return account as unknown as MarketplaceAccount;
    },
    enabled: !!program,
  });
}

export function useActiveListings() {
  const { program, connection } = useSolanaProvider();

  return useQuery<EnrichedListing[]>({
    queryKey: ["listings", "active"],
    queryFn: async () => {
      if (!program) return [];

      const allListings = await program.account.listing.all();
      const activeListings = allListings.filter((l) => {
        const acct = l.account as unknown as ListingAccount;
        return acct.isActive;
      });

      const enriched: EnrichedListing[] = [];

      for (const listing of activeListings) {
        try {
          const account = listing.account as unknown as ListingAccount;
          const assetAddress = account.mint;
          const marketplacePDA = getMarketplacePDA();
          const listingPDA = getListingPDA(marketplacePDA, assetAddress);
          const escrowPDA = getEscrowPDA(listingPDA);

          let metadata: NftMetadata = {
            name: "Unknown",
            image: "",
            description: "",
          };

          try {
            const assetInfo = await connection.getAccountInfo(assetAddress);
            if (assetInfo?.data) {
              const parsed = parseMplCoreAsset(
                new Uint8Array(assetInfo.data)
              );
              metadata = await fetchNftMetadata(parsed.uri);
              if (!metadata.name || metadata.name === "Unknown") {
                metadata.name = parsed.name;
              }
            }
          } catch (metaErr) {
            console.warn("Failed to load metadata for listing", listing.publicKey.toBase58(), metaErr);
          }

          let priceInSol = 0;
          try {
            priceInSol = account.price.toNumber() / LAMPORTS_PER_SOL;
          } catch {
            // BN too large for toNumber — fall back to string conversion
            priceInSol =
              Number(account.price.toString()) / LAMPORTS_PER_SOL;
          }

          enriched.push({
            publicKey: listing.publicKey,
            account,
            assetAddress,
            metadata,
            priceInSol,
            escrowPDA,
          });
        } catch (listingErr) {
          console.error("Failed to process listing", listing.publicKey.toBase58(), listingErr);
        }
      }

      return enriched;
    },
    enabled: !!program,
  });
}

export function useWalletBalance() {
  const { connection, walletAddress } = useSolanaProvider();

  return useQuery<number>({
    queryKey: ["balance", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return 0;
      const balance = await connection.getBalance(new PublicKey(walletAddress));
      return balance / LAMPORTS_PER_SOL;
    },
    enabled: !!walletAddress,
    refetchInterval: 15_000,
  });
}

export function usePortfolioAssets() {
  const { connection, walletAddress, program } = useSolanaProvider();

  return useQuery<PortfolioAsset[]>({
    queryKey: ["portfolio", walletAddress],
    queryFn: async () => {
      if (!walletAddress || !program) return [];

      const ownerPubkey = new PublicKey(walletAddress);

      // Fetch all accounts owned by the MPL Core program for this user.
      // MPL Core assets have a Key byte of 1 (AssetV1) at offset 0.
      const accounts = await connection.getProgramAccounts(
        MPL_CORE_PROGRAM_ID,
        {
          filters: [
            { memcmp: { offset: 0, bytes: "2" } }, // Key::AssetV1 = 1, base58 encoded
            { memcmp: { offset: 1, bytes: ownerPubkey.toBase58() } }, // owner at offset 1
          ],
        }
      );

      const marketplacePDA = getMarketplacePDA();
      const assets: PortfolioAsset[] = [];

      for (const { pubkey, account: accInfo } of accounts) {
        const parsed = parseMplCoreAsset(new Uint8Array(accInfo.data));

        let metadata: NftMetadata | null = null;
        try {
          metadata = await fetchNftMetadata(parsed.uri);
          if (metadata.name === "Unknown") {
            metadata.name = parsed.name;
          }
        } catch {
          // metadata remains null
        }

        // Check if there's a listing for this asset
        let listingInfo: PortfolioAsset["listing"] = null;
        try {
          const listingPDA = getListingPDA(marketplacePDA, pubkey);
          const listingAccount = await program.account.listing.fetch(
            listingPDA
          );
          const typed = listingAccount as unknown as ListingAccount;
          const escrowPDA = getEscrowPDA(listingPDA);
          listingInfo = {
            publicKey: listingPDA,
            seller: typed.seller,
            escrowPDA,
            price: typed.price,
            isActive: typed.isActive,
          };
        } catch {
          // No listing exists for this asset
        }

        assets.push({
          address: pubkey,
          name: parsed.name,
          uri: parsed.uri,
          metadata,
          listing: listingInfo,
        });
      }

      return assets;
    },
    enabled: !!walletAddress && !!program,
  });
}

export function useAdminAssets() {
  const { connection, walletAddress, program } = useSolanaProvider();

  return useQuery<AdminAsset[]>({
    queryKey: ["admin-assets", walletAddress],
    queryFn: async () => {
      if (!walletAddress || !program) return [];

      const ownerPubkey = new PublicKey(walletAddress);
      const accounts = await connection.getProgramAccounts(
        MPL_CORE_PROGRAM_ID,
        {
          filters: [
            { memcmp: { offset: 0, bytes: "2" } },
            { memcmp: { offset: 1, bytes: ownerPubkey.toBase58() } },
          ],
        }
      );

      const marketplacePDA = getMarketplacePDA();
      const assets: AdminAsset[] = [];

      for (const { pubkey, account: accInfo } of accounts) {
        const parsed = parseMplCoreAsset(new Uint8Array(accInfo.data));

        let isListed = false;
        try {
          const listingPDA = getListingPDA(marketplacePDA, pubkey);
          const listingAccount = await program.account.listing.fetch(listingPDA);
          const typed = listingAccount as unknown as ListingAccount;
          isListed = typed.isActive;
        } catch {
          // not listed
        }

        assets.push({
          address: pubkey,
          name: parsed.name,
          uri: parsed.uri,
          isListed,
        });
      }

      return assets;
    },
    enabled: !!walletAddress && !!program,
  });
}
