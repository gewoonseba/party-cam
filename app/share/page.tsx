"use client";

import { createClient } from "@/utils/supabase/client";
import { createPost } from "@/utils/supabase/queries";
import imageCompression from "browser-image-compression";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PreviewData = {
  file: File;
  previewUrl: string;
} | null;

const MAX_FILE_SIZE_MB = 5;
const MB_TO_BYTES = 1024 * 1024;

export default function SharePage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<PreviewData>(null);

  async function compressImageIfNeeded(file: File): Promise<File> {
    if (file.size <= MAX_FILE_SIZE_MB * MB_TO_BYTES) {
      return file; // No compression needed
    }

    console.log(
      `Compressing image of size: ${(file.size / MB_TO_BYTES).toFixed(2)}MB`
    );

    const options = {
      maxSizeMB: MAX_FILE_SIZE_MB,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Compressed to: ${(compressedFile.size / MB_TO_BYTES).toFixed(2)}MB`
      );
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // Return original file if compression fails
    }
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setPreview({ file, previewUrl });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) return;

    try {
      setUploading(true);

      // Compress image if needed
      const compressedFile = await compressImageIfNeeded(preview.file);

      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await createClient()
        .storage.from("images")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = createClient().storage.from("images").getPublicUrl(filePath);

      await createPost(caption, publicUrl);

      router.push("/thanks");
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-[#1a1a1a] text-white">
      <h1 className="text-6xl font-bold text-[#00ff95] mb-2 filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
        Thirty
      </h1>
      <p className="text-xl mb-4">Sharing is caring, deel iets met ons!</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {preview ? (
          <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden mb-4">
            <Image
              src={preview.previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg hover:bg-black/70"
            >
              Change
            </button>
          </div>
        ) : (
          <label className="w-full aspect-[4/3] border-2 border-dashed border-[#00ff95]/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00ff95]/60 transition-colors mb-4">
            <Upload className="w-12 h-12 text-[#00ff95] mb-4" />
            <p className="text-[#00ff95] font-bold">LACHE VOOR DE FOTOO</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileSelected}
            />
          </label>
        )}

        <p className="mt-4 mb-1 text-gray-400">
          1 woord zegt meer dan 1000 foto&apos;s
        </p>
        <textarea
          placeholder="Today is where your book begins, the rest is still unwritten"
          className="w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-white mb-4 min-h-[100px] resize-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          type="submit"
          className="w-full p-4 rounded-lg bg-[#00ff95] text-black font-bold text-lg disabled:opacity-50 transition-opacity"
          disabled={uploading || !preview}
        >
          {uploading ? "Uploading..." : "Okaaaaaaay let&apos;s go"}
        </button>
      </form>
    </main>
  );
}
