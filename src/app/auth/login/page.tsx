"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/app/map";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-forest-light border-r border-white/5 items-center justify-center p-12">
        <div className="max-w-md">
          <Image src="/logo.svg" alt="Rezone" width={160} height={36} className="mb-12" />
          <h2 className="font-editorial text-3xl mb-4">
            Precision land intelligence for serious investors.
          </h2>
          <p className="text-cream/40 leading-relaxed">
            Rezone scans county records, permit histories, and zoning
            classifications to find parcels with untapped rezoning potential
            before the market catches on.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <Stat value="2.4M+" label="Parcels indexed" />
            <Stat value="47" label="Signal types" />
            <Stat value="92%" label="Accuracy rate" />
            <Stat value="< 24hr" label="Alert latency" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Image src="/logo.svg" alt="Rezone" width={120} height={28} />
          </div>

          <h1 className="font-editorial text-2xl mb-1">Welcome back</h1>
          <p className="text-cream/40 text-sm mb-8">
            Sign in to access your county scans.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-[10px] tracking-wider text-cream/30 uppercase block mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-forest-light border border-white/10 text-cream px-4 py-3 text-sm placeholder:text-cream/20 focus:border-copper/40 focus:outline-none focus:ring-1 focus:ring-copper/30 transition-colors"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-[10px] tracking-wider text-cream/30 uppercase block mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-forest-light border border-white/10 text-cream px-4 py-3 text-sm placeholder:text-cream/20 focus:border-copper/40 focus:outline-none focus:ring-1 focus:ring-copper/30 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-cream/30 text-sm mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-copper hover:text-copper-light transition-colors">
              Start free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-xl text-teal font-bold">{value}</div>
      <div className="text-[10px] text-cream/30 tracking-wider uppercase">{label}</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-forest" />}>
      <LoginForm />
    </Suspense>
  );
}
