import PostCycle from "@/app/components/PostCycle";
import QR from "@/app/components/QR";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
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

      <Link
        href="/share"
        className="absolute bottom-8 right-8 bg-[#00ff95] text-black p-4 rounded-lg shadow-lg shadow-[#00ff95]/20 hover:shadow-[#00ff95]/40 transition-shadow"
      >
        <QR url={`https://www.gewoonseba.com`} />
      </Link>
    </main>
  );
}
