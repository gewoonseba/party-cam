import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <h1>Thirty</h1>
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
              className="w-full p-4 bg-gray text-white focus:outline-none focus:border-primary transition-colors"
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
              className="w-full p-4 bg-gray text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              formAction={login}
              className="w-full p-4 
               bg-primary text-black font-bold text-lg hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="w-full p-4 
               border-2 border-primary text-primary font-bold text-lg hover:bg-primary/10 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
