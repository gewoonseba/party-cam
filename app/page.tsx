import Image from "next/image";
import Link from "next/link";
import { QrCode, Camera } from "lucide-react";
import { getLatestPost } from "@/lib/supabase";

export default async function Home() {
  const post = await getLatestPost();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#1a1a1a]">
      <div className="w-[90%] max-w-5xl aspect-[4/3] relative rounded-lg overflow-hidden border-4 border-[#00ff95]/20">
        {post ? (
          <>
            <Image
              src={post.image_url}
              alt="Party moment"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xl">{post.caption}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-center p-4">
            <Camera className="w-16 h-16 text-[#00ff95] mb-4" />
            <p className="text-[#00ff95] text-2xl font-bold mb-2">
              No posts yet
            </p>
            <p className="text-gray-400">
              Be the first to share a party moment!
            </p>
            <Link
              href="/share"
              className="mt-6 bg-[#00ff95] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00ff95]/80 transition-colors"
            >
              Share a photo
            </Link>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <h1 className="text-6xl font-bold text-[#00ff95] filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
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
