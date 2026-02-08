import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ImageUploadZone({ file, onFileChange }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      if (f.size > MAX_FILE_SIZE) {
        setError("File must be under 10MB");
        return;
      }
      if (!f.type.startsWith("image/")) {
        setError("Only image files are accepted");
        return;
      }
      onFileChange(f);
    },
    [onFileChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase font-glory text-light-gray tracking-wide">
        Image
      </label>

      {preview ? (
        <div className="relative rounded-md overflow-hidden border border-white/10">
          <img
            src={preview}
            alt="NFT preview"
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 h-64 rounded-md border-2 border-dashed cursor-pointer transition-colors ${
            dragActive
              ? "border-[#FBC052] bg-[#FBC052]/10"
              : "border-white/20 bg-white/5 hover:border-white/40"
          }`}
        >
          <Upload className="w-8 h-8 text-white/40" />
          <p className="text-sm text-white/50">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-white/30">PNG, JPG, GIF — max 10MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
