import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ImageUploadZone } from "../../../components/admin/ImageUploadZone";
import { TraitRow } from "../../../components/admin/TraitRow";
import {
  MintProgressIndicator,
  type MintStep,
} from "../../../components/admin/MintProgressIndicator";
import { useCreateNft } from "../../../hooks/useAdminTransactions";
import { useTraitTypes } from "../../../hooks/useTraitTypes";
import { useUploadToIrys } from "../../../hooks/useUploadToIrys";
import { useSolanaProvider } from "../../../hooks/useSolanaProvider";
import toast from "react-hot-toast";

interface Trait {
  trait_type: string;
  value: string;
}

export const CreateNft = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState<Trait[]>([]);
  const [mintStep, setMintStep] = useState<MintStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const createNft = useCreateNft();
  const { traitTypes, createTraitType } = useTraitTypes();
  const { uploadNftMetadata, isReady: isUploadReady } = useUploadToIrys();
  const { walletAddress } = useSolanaProvider();

  const traitTypeOptions = traitTypes.map((t) => t.name);
  const isBusy = mintStep !== "idle" && mintStep !== "complete" && mintStep !== "error";

  const addTrait = () => {
    setTraits((prev) => [...prev, { trait_type: "", value: "" }]);
  };

  const updateTrait = (index: number, field: keyof Trait, val: string) => {
    setTraits((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: val } : t))
    );
  };

  const removeTrait = (index: number) => {
    setTraits((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setImageFile(null);
    setName("");
    setSymbol("");
    setDescription("");
    setTraits([]);
    setMintStep("idle");
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageFile || !walletAddress) return;

    setError(null);

    try {
      // Steps 1-2: upload image + metadata to Irys
      const metadataUri = await uploadNftMetadata(
        {
          imageFile,
          name: name.trim(),
          symbol: symbol.trim(),
          description: description.trim(),
          traits: traits.filter((t) => t.trait_type.trim() && t.value.trim()),
          creatorAddress: walletAddress,
        },
        (step) => setMintStep(step)
      );

      // Step 3: mint on-chain
      setMintStep("minting");
      const result = await createNft.mutateAsync({
        name: name.trim(),
        uri: metadataUri,
      });

      setMintStep("complete");
      toast.success(
        `NFT created! Asset: ${result.assetAddress.toBase58()}`
      );
      resetForm();
    } catch (err) {
      setMintStep("error");
      setError(
        err instanceof Error ? err.message : "Failed to create NFT. Please try again."
      );
    }
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
          Upload an image, add metadata, and mint a new MPL Core asset
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <ImageUploadZone file={imageFile} onFileChange={setImageFile} />

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
              disabled={isBusy}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Symbol
            </label>
            <Input
              type="text"
              placeholder="e.g. GLD"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              disabled={isBusy}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Description
            </label>
            <Textarea
              placeholder="Describe this NFT..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isBusy}
            />
          </div>

          {/* Traits section */}
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
              Traits
            </label>
            {traits.map((trait, i) => (
              <TraitRow
                key={i}
                traitType={trait.trait_type}
                value={trait.value}
                traitTypeOptions={traitTypeOptions}
                onTraitTypeChange={(val) => updateTrait(i, "trait_type", val)}
                onValueChange={(val) => updateTrait(i, "value", val)}
                onRemove={() => removeTrait(i)}
                onCreateNewTraitType={createTraitType}
              />
            ))}
            <button
              type="button"
              onClick={addTrait}
              disabled={isBusy}
              className="flex items-center gap-2 text-sm text-[#FBC052] hover:text-[#FBC052]/80 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Trait
            </button>
          </div>
        </div>

        <div className="mt-8">
          {isBusy || mintStep === "complete" ? (
            <MintProgressIndicator currentStep={mintStep} error={error} />
          ) : mintStep === "error" ? (
            <>
              <MintProgressIndicator currentStep={mintStep} error={error} />
              <PrimaryButton>Retry</PrimaryButton>
            </>
          ) : (
            <PrimaryButton>
              {!isUploadReady ? "Connect Wallet to Mint" : "Create NFT"}
            </PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
};
