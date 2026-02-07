import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@coral-xyz/anchor";

export interface ListingAccount {
  seller: PublicKey;
  mint: PublicKey;
  price: BN;
  bump: number;
  tokenId: number;
  isActive: boolean;
  escrowBump: number;
}

export interface MarketplaceAccount {
  admin: PublicKey;
  treasuryBump: number;
  bump: number;
  feeBps: number;
  name: string;
}

export interface NftMetadata {
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface EnrichedListing {
  publicKey: PublicKey;
  account: ListingAccount;
  assetAddress: PublicKey;
  metadata: NftMetadata;
  priceInSol: number;
  escrowPDA: PublicKey;
}

export interface AdminAsset {
  address: PublicKey;
  name: string;
  uri: string;
  isListed: boolean;
}

export interface PortfolioAsset {
  address: PublicKey;
  name: string;
  uri: string;
  metadata: NftMetadata | null;
  listing: {
    publicKey: PublicKey;
    seller: PublicKey;
    escrowPDA: PublicKey;
    price: BN;
    isActive: boolean;
  } | null;
}
