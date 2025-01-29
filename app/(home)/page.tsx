import Arrow from "@/app/components/Arrow";
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

      <div className="absolute bottom-8 right-8 grid grid-cols-[120px_120px] grid-rows-[120px_120px] gap-2">
        <Arrow className="row-span-2 text-primary h-32 self-end mb-8 ml-8" />
        <p className="text-primary font-outline self-end">
          <span className="font-display text-lg">Deel</span> je mooiste kiekjes
          met ons!
        </p>
        <Link href="/share">
          <QR path={`share`} />
        </Link>
      </div>
    </main>
  );
}
