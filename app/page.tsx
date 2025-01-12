"use client";

import { supabase } from "@/lib/supabase";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PostCycle from "./components/PostCycle";
export default async function Home() {
  const session = await supabase.auth.getSession();

  if (session) {
    console.log("🔑 Session found, redirecting to /");
  } else {
    console.log("🔑 No session found, redirecting to /login");
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-2 relative bg-[#1a1a1a]">
      <div className="w-[90%] max-w-7xl aspect-[4/3] relative rounded-lg overflow-hidden border-4 border-[#00ff95]/20">
        <PostCycle />
        <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <h1 className="text-6xl font-bold text-[#00ff95] filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)] text-center w-full">
            Thirty
          </h1>
        </div>
      </div>

      <div className="absolute top-4 right-4 text-white text-right">
        <p>Sharing is</p>
        <p>caring</p>
      </div>

      <Link
        href="/share"
        className="absolute bottom-8 right-8 bg-[#00ff95] text-black p-4 rounded-lg shadow-lg shadow-[#00ff95]/20 hover:shadow-[#00ff95]/40 transition-shadow"
      >
        <QrCode className="w-6 h-6" />
      </Link>
    </main>
  );
}
