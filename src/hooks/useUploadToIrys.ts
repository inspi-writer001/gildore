import { useCallback } from "react";
import { createGenericFile } from "@metaplex-foundation/umi";
import { useUmi } from "./useUmi";

export type UploadStep =
  | "uploading-image"
  | "uploading-metadata"
  | "complete";

interface NftFormData {
  imageFile: File;
  name: string;
  symbol: string;
  description: string;
  traits: Array<{ trait_type: string; value: string }>;
  creatorAddress: string;
}

export function useUploadToIrys() {
  const umi = useUmi();

  const uploadNftMetadata = useCallback(
    async (
      formData: NftFormData,
      onStepChange?: (step: UploadStep) => void
    ): Promise<string> => {
      if (!umi) throw new Error("UMI not initialized — wallet not connected");

      // Step 1: Upload image
      onStepChange?.("uploading-image");
      const buffer = await formData.imageFile.arrayBuffer();
      const genericFile = createGenericFile(
        new Uint8Array(buffer),
        formData.imageFile.name,
        { contentType: formData.imageFile.type }
      );
      const [imageUri] = await umi.uploader.upload([genericFile]);

      // Step 2: Build and upload metadata JSON
      onStepChange?.("uploading-metadata");
      const metadata = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        image: imageUri,
        attributes: formData.traits.filter(
          (t) => t.trait_type.trim() && t.value.trim()
        ),
        properties: {
          files: [
            {
              uri: imageUri,
              type: formData.imageFile.type,
            },
          ],
        },
        creators: [
          {
            address: formData.creatorAddress,
            share: 100,
          },
        ],
      };

      const metadataUri = await umi.uploader.uploadJson(metadata);
      onStepChange?.("complete");

      return metadataUri;
    },
    [umi]
  );

  return {
    uploadNftMetadata,
    isReady: umi !== null,
  };
}
