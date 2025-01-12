import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a1a1a] text-white">
      <h1 className="text-6xl font-bold text-[#00ff95] mb-6 filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
        Thirty
      </h1>
      <div className="w-full max-w-md">
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-[#00ff95] transition-colors"
              placeholder="naam@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-[#00ff95] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              formAction={login}
              className="w-full p-4 rounded-lg bg-[#00ff95] text-black font-bold text-lg hover:bg-[#00ff95]/80 transition-colors shadow-lg shadow-[#00ff95]/20 hover:shadow-[#00ff95]/40"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="w-full p-4 rounded-lg border-2 border-[#00ff95] text-[#00ff95] font-bold text-lg hover:bg-[#00ff95]/10 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
