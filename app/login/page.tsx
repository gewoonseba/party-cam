"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          router.push("/");
          router.refresh();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a] text-white">
      <div className="w-full max-w-md">
        <h1 className="text-6xl font-bold text-[#00ff95] mb-6 text-center filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
          Thirty
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-lg bg-[#00ff95] text-black font-bold text-lg disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-[#00ff95] hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </main>
  );
}
