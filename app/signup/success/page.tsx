import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a] text-white">
      <h1 className="text-6xl font-bold text-[#00ff95] mb-6 filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
        Thirty
      </h1>
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold mb-4">Check your email!</h2>
        <p className="text-gray-300 mb-8">
          We've sent you a confirmation link. Click the link in your email to
          activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block w-full p-4 rounded-lg bg-[#00ff95] text-black font-bold text-lg hover:bg-[#00ff95]/80 transition-colors shadow-lg shadow-[#00ff95]/20 hover:shadow-[#00ff95]/40"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}
