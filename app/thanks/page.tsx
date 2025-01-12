"use client";

import { useRouter } from "next/navigation";

export default function ThanksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a] text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#00ff95] filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
        Gracias Amigo!
      </h1>
      <p className="text-xl md:text-2xl text-white mb-12">
        Uw kiekje komt dadelijk op het grote scherm.
      </p>
      <button
        onClick={() => router.push("/share")}
        className="w-full max-w-md p-4 rounded-lg bg-[#00ff95] text-black font-bold text-lg hover:bg-[#00ff95]/80 transition-colors shadow-lg shadow-[#00ff95]/20 hover:shadow-[#00ff95]/40"
      >
        Nog een foto maken
      </button>
    </main>
  );
}
