import { CheckCircle, Circle, Loader2 } from "lucide-react";

export type MintStep =
  | "idle"
  | "uploading-image"
  | "uploading-metadata"
  | "minting"
  | "complete"
  | "error";

interface MintProgressIndicatorProps {
  currentStep: MintStep;
  error?: string | null;
}

const STEPS = [
  { key: "uploading-image", label: "Uploading image" },
  { key: "uploading-metadata", label: "Uploading metadata" },
  { key: "minting", label: "Minting on-chain" },
] as const;

const STEP_ORDER: Record<string, number> = {
  "uploading-image": 0,
  "uploading-metadata": 1,
  minting: 2,
  complete: 3,
};

export function MintProgressIndicator({
  currentStep,
  error,
}: MintProgressIndicatorProps) {
  const currentIndex = STEP_ORDER[currentStep] ?? -1;

  return (
    <div className="flex flex-col gap-3 py-4">
      {STEPS.map((step, i) => {
        const isActive = currentIndex === i && currentStep !== "complete";
        const isDone = currentIndex > i || currentStep === "complete";

        return (
          <div key={step.key} className="flex items-center gap-3">
            {isDone ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : isActive ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#FBC052]" />
            ) : (
              <Circle className="w-5 h-5 text-white/20" />
            )}
            <span
              className={`text-sm ${
                isDone
                  ? "text-green-400"
                  : isActive
                    ? "text-white"
                    : "text-white/30"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}

      {currentStep === "error" && error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
