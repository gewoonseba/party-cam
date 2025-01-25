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
    <main className="min-h-screen flex flex-col items-center justify-center p-2 relative bg-black text-primary">
      <div className="max-w-[90vw] aspect-[4/3] h-[90vh] relative rounded-lg overflow-hidden">
        <PostCycle />
        <div className="absolute inset-x-0 top-0 p-4 ">
          <h1>Thirty</h1>
        </div>
      </div>

      <Link
        href="/share"
        className="absolute bottom-8 right-8  shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
      >
        <QR path={`share`} />
      </Link>
    </main>
  );
}
