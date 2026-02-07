import { PublicKey } from "@solana/web3.js";

export const privyApiKey = import.meta.env.VITE_PRIVY_APP_ID;

export const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com";

export const PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_PROGRAM_ID || "8Z935UApS1fPcyhTQ42KzWvYW83j3wrCEmJCiwVz7EVC"
);

export const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

let _marketplaceAdmin: PublicKey | null = null;

export function getMarketplaceAdmin(): PublicKey {
  if (!_marketplaceAdmin) {
    const key = import.meta.env.VITE_MARKETPLACE_ADMIN_PUBKEY;
    if (!key) {
      throw new Error(
        "VITE_MARKETPLACE_ADMIN_PUBKEY is not set. Add it to your .env file."
      );
    }
    _marketplaceAdmin = new PublicKey(key);
  }
  return _marketplaceAdmin;
}

export function getMarketplacePDA(): PublicKey {
  const admin = getMarketplaceAdmin();
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace"), admin.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getTreasuryPDA(marketplace: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), marketplace.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getListingPDA(
  marketplace: PublicKey,
  asset: PublicKey
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), marketplace.toBuffer(), asset.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getEscrowPDA(listing: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), listing.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}
