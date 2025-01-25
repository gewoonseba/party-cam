"use client";

import { useRouter } from "next/navigation";

export default function ThanksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-center">
      <h1 className="text-4xl">Gracias Amigo!</h1>
      <p className="text-xl md:text-2xl text-white mb-12">
        Uw kiekje komt dadelijk op het grote scherm.
      </p>
      <button
        onClick={() => router.push("/share")}
        className="w-full max-w-md p-4 bg-primary text-black font-bold text-lg hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/40"
      >
        Nog een foto maken
      </button>
    </main>
  );
}
