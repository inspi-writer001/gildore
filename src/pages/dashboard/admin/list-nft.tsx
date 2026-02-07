import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { Input } from "../../../components/ui/input";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useListNft } from "../../../hooks/useAdminTransactions";
import { useAdminAssets } from "../../../hooks/useMarketplace";

export const ListNft = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [price, setPrice] = useState("");
  const [tokenId, setTokenId] = useState("");
  const listNft = useListNft();
  const { data: assets, isLoading: assetsLoading } = useAdminAssets();

  const unlistedAssets = assets?.filter((a) => !a.isListed) ?? [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !price || !tokenId) return;

    const priceNum = parseFloat(price);
    const tokenIdNum = parseInt(tokenId, 10);

    if (isNaN(priceNum) || priceNum <= 0) return;
    if (isNaN(tokenIdNum) || tokenIdNum < 0) return;

    listNft.mutate(
      {
        assetAddress: new PublicKey(selectedAsset),
        price: priceNum,
        tokenId: tokenIdNum,
      },
      {
        onSuccess: (tx) => {
          setSelectedAsset("");
          setPrice("");
          setTokenId("");
          alert(`NFT listed!\nTx: ${tx}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-16 items-center max-w-[32.563rem] mx-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 flex items-center justify-center">
          <img
            src="/images/marketplace/gold-bar-product.png"
            alt="list nft"
            className="w-12 h-12 object-contain"
          />
        </div>
        <p className="font-glory text-2xl font-bold">List NFT</p>
        <p className="text-white/50 text-sm text-center">
          Set a price and list an owned asset on the marketplace
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Select Asset
            </label>
            {assetsLoading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                <span className="text-sm text-white/50">Loading assets...</span>
              </div>
            ) : unlistedAssets.length === 0 ? (
              <p className="text-white/50 text-sm py-4">
                No unlisted assets found. Create an NFT first.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {unlistedAssets.map((asset) => (
                  <button
                    key={asset.address.toBase58()}
                    type="button"
                    onClick={() => setSelectedAsset(asset.address.toBase58())}
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      selectedAsset === asset.address.toBase58()
                        ? "border-[#FBC052] bg-[#FBC052]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-white/40 font-mono truncate mt-0.5">
                      {asset.address.toBase58()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Price (SOL)
            </label>
            <Input
              type="number"
              step="0.001"
              min="0"
              placeholder="e.g. 1.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Token ID
            </label>
            <Input
              type="number"
              min="0"
              max="65535"
              step="1"
              placeholder="e.g. 1"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              required
            />
          </div>
        </div>

        {listNft.isError && (
          <p className="text-red-400 text-sm mt-4">
            {listNft.error instanceof Error
              ? listNft.error.message
              : "Failed to list NFT. Please try again."}
          </p>
        )}

        <div className="mt-8">
          {listNft.isPending ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#FBC052]" />
              <span className="ml-2 text-sm text-white/70">
                Listing NFT...
              </span>
            </div>
          ) : (
            <PrimaryButton>List on Marketplace</PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
};
