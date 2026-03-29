import { X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "gildore-test-environment-banner-dismissed";

export const TestEnvironmentBanner = () => {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    const isDismissed = window.localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(isDismissed);
  }, []);

  if (dismissed === null || dismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden border border-[#FAC35D]/25 bg-[linear-gradient(135deg,rgba(250,195,93,0.16),rgba(23,23,23,0.94)_40%,rgba(212,137,0,0.16))] px-4 py-3 text-sm text-[#F5E7B2] shadow-[0_0_30px_rgba(212,137,0,0.08)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,195,93,0.16),transparent_38%)]" />
      <div className="relative flex items-start gap-3 pr-8">
        <div className="mt-0.5 border border-[#FAC35D]/40 bg-[#FAC35D]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FAC35D]">
          Testnet
        </div>
        <p className="flex-1 leading-6">
          Gildore is still in Test environment and assets in Marketplace are not
          real.
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "true");
            setDismissed(true);
          }}
          className="absolute right-0 top-0 rounded-full p-1 text-[#D9C27B] transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Dismiss test environment banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
