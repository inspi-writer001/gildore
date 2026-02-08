import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/input";

interface TraitRowProps {
  traitType: string;
  value: string;
  traitTypeOptions: string[];
  onTraitTypeChange: (val: string) => void;
  onValueChange: (val: string) => void;
  onRemove: () => void;
  onCreateNewTraitType: (name: string) => void;
}

export function TraitRow({
  traitType,
  value,
  traitTypeOptions,
  onTraitTypeChange,
  onValueChange,
  onRemove,
  onCreateNewTraitType,
}: TraitRowProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(traitType);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(traitType);
  }, [traitType]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = traitTypeOptions.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );
  const exactMatch = traitTypeOptions.some(
    (o) => o.toLowerCase() === search.trim().toLowerCase()
  );

  return (
    <div className="flex items-start gap-2">
      {/* Trait type combobox */}
      <div className="relative flex-1" ref={wrapperRef}>
        <Input
          placeholder="Trait type"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {open && (filtered.length > 0 || search.trim()) && (
          <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1a2e] border border-white/10 rounded-md max-h-40 overflow-y-auto shadow-lg">
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearch(opt);
                  onTraitTypeChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
            {search.trim() && !exactMatch && (
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-[#FBC052] hover:bg-white/10 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const name = search.trim().toLowerCase();
                  onCreateNewTraitType(name);
                  onTraitTypeChange(name);
                  setOpen(false);
                }}
              >
                Create "{search.trim()}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* Value input */}
      <div className="flex-1">
        <Input
          placeholder="Value"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="mt-3 p-2 text-white/40 hover:text-red-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
