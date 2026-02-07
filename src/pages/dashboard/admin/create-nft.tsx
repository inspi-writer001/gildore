import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useCreateNft } from "../../../hooks/useAdminTransactions";

export const CreateNft = () => {
  const [name, setName] = useState("");
  const [uri, setUri] = useState("");
  const createNft = useCreateNft();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !uri.trim()) return;

    createNft.mutate(
      { name: name.trim(), uri: uri.trim() },
      {
        onSuccess: (result) => {
          setName("");
          setUri("");
          alert(
            `NFT created!\nAsset: ${result.assetAddress.toBase58()}\nTx: ${result.tx}`
          );
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-16 items-center max-w-[32.563rem] mx-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 flex items-center justify-center">
          <img
            src="/images/dashboard/admin_icon_active.svg"
            alt="create nft"
            className="w-12 h-12"
          />
        </div>
        <p className="font-glory text-2xl font-bold">Create NFT</p>
        <p className="text-white/50 text-sm text-center">
          Mint a new MPL Core asset to this wallet
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Gildore Gold 250g"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Metadata URI
            </label>
            <Input
              type="url"
              placeholder="https://arweave.net/..."
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              required
            />
          </div>
        </div>

        {createNft.isError && (
          <p className="text-red-400 text-sm mt-4">
            {createNft.error instanceof Error
              ? createNft.error.message
              : "Failed to create NFT. Please try again."}
          </p>
        )}

        <div className="mt-8">
          {createNft.isPending ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#FBC052]" />
              <span className="ml-2 text-sm text-white/70">
                Creating NFT...
              </span>
            </div>
          ) : (
            <PrimaryButton>Create NFT</PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
};
