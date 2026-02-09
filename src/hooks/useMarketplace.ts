import { useQuery } from "@tanstack/react-query";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useSolanaProvider } from "./useSolanaProvider";
import {
  getMarketplacePDA,
  getListingPDA,
  getEscrowPDA,
  MPL_CORE_PROGRAM_ID,
  PROGRAM_ID,
} from "../constant";
import type {
  MarketplaceAccount,
  EnrichedListing,
  NftMetadata,
  PortfolioAsset,
  ListingAccount,
  AdminAsset,
} from "../types/marketplace";

/** Listing account discriminator bytes (from IDL) */
const LISTING_DISCRIMINATOR = [218, 32, 50, 73, 43, 134, 26, 58];

/**
 * Expected byte size of a Listing account:
 * 8 (discriminator) + 32 (seller) + 32 (mint) + 8 (price) + 1 (bump) + 2 (tokenId) + 1 (isActive) + 1 (escrowBump) = 85
 */
const LISTING_ACCOUNT_SIZE = 85;

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

      // Use getProgramAccounts with dataSize filter instead of
      // program.account.listing.all() — this lets us catch deserialization
      // errors per-account rather than one bad account crashing the entire fetch.
      const rawAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          { dataSize: LISTING_ACCOUNT_SIZE },
        ],
      });

      console.log(`[Marketplace] Found ${rawAccounts.length} listing accounts on-chain`);

      const enriched: EnrichedListing[] = [];

      for (const { pubkey, account: accInfo } of rawAccounts) {
        try {
          // Verify discriminator before attempting full decode
          const data = accInfo.data;
          let isListing = true;
          for (let i = 0; i < 8; i++) {
            if (data[i] !== LISTING_DISCRIMINATOR[i]) {
              isListing = false;
              break;
            }
          }
          if (!isListing) continue;

          // Manually decode — skip accounts that fail deserialization
          const decoded = program.coder.accounts.decode(
            "listing",
            data
          );
          const account = decoded as unknown as ListingAccount;

          if (!account.isActive) continue;

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
            console.warn("[Marketplace] Failed to load metadata for listing", pubkey.toBase58(), metaErr);
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
            publicKey: pubkey,
            account,
            assetAddress,
            metadata,
            priceInSol,
            escrowPDA,
          });
        } catch (decodeErr) {
          console.warn("[Marketplace] Skipping undeserializable listing account", pubkey.toBase58(), decodeErr);
        }
      }

      console.log(`[Marketplace] Successfully enriched ${enriched.length} active listings`);
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
