"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Loader2, Check } from "lucide-react";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { plan },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border border-teal/30 bg-teal/10 flex items-center justify-center mx-auto mb-6">
            <Check size={24} className="text-teal" />
          </div>
          <h1 className="font-editorial text-2xl mb-2">Check your email</h1>
          <p className="text-cream/50 mb-6">
            We sent a confirmation link to <strong className="text-cream">{email}</strong>.
            Click it to activate your account and start scanning.
          </p>
          <Link href="/auth/login" className="text-copper hover:text-copper-light text-sm transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-forest-light border-r border-white/5 items-center justify-center p-12">
        <div className="max-w-md">
          <Image src="/logo.svg" alt="Rezone" width={160} height={36} className="mb-12" />
          <h2 className="font-editorial text-3xl mb-4">
            Start finding rezoning opportunities today.
          </h2>
          <p className="text-cream/40 leading-relaxed mb-8">
            Free accounts get one county scan with weekly email digests. Upgrade
            anytime for more counties, daily alerts, and AI-powered analysis.
          </p>
          <div className="space-y-3">
            {["No credit card required", "Scan your first county in minutes", "Cancel or downgrade anytime"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check size={14} className="text-teal flex-shrink-0" />
                <span className="text-cream/60 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Image src="/logo.svg" alt="Rezone" width={120} height={28} />
          </div>

          <h1 className="font-editorial text-2xl mb-1">Create your account</h1>
          <p className="text-cream/40 text-sm mb-2">
            Get started with a free county scan.
          </p>
          {plan !== "free" && (
            <p className="text-xs font-mono text-copper mb-4">
              Selected plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4 mt-6">
            <div>
              <label htmlFor="signup-email" className="text-[10px] tracking-wider text-cream/30 uppercase block mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="text-[10px] tracking-wider text-cream/30 uppercase block mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-forest-light border border-white/10 text-cream px-4 py-3 text-sm placeholder:text-cream/20 focus:border-copper/40 focus:outline-none focus:ring-1 focus:ring-copper/30 transition-colors"
                placeholder="Min. 8 characters"
                minLength={8}
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
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-cream/30 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-copper hover:text-copper-light transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-cream/15 text-[10px] mt-8 text-center">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-forest" />}>
      <SignupForm />
    </Suspense>
  );
}
