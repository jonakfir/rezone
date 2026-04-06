"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-forest/90 backdrop-blur-xl border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Rezone" width={140} height={32} priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-cream/60 hover:text-cream transition-colors">
            Features
          </a>
          <a href="#demo" className="text-sm text-cream/60 hover:text-cream transition-colors">
            Demo
          </a>
          <a href="#pricing" className="text-sm text-cream/60 hover:text-cream transition-colors">
            Pricing
          </a>
          <Link
            href="/auth/login"
            className="text-sm text-cream/80 hover:text-cream transition-colors"
          >
            Log in
          </Link>
          <Link href="/auth/signup" className="btn-primary text-sm px-5 py-2">
            Start Free
          </Link>
        </div>

        <button
          className="md:hidden text-cream/70"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-forest border-t border-white/5 px-6 py-4 space-y-4">
          <a href="#features" className="block text-cream/60 hover:text-cream">Features</a>
          <a href="#demo" className="block text-cream/60 hover:text-cream">Demo</a>
          <a href="#pricing" className="block text-cream/60 hover:text-cream">Pricing</a>
          <Link href="/auth/login" className="block text-cream/80">Log in</Link>
          <Link href="/auth/signup" className="btn-primary block text-center text-sm">
            Start Free
          </Link>
        </div>
      )}
    </nav>
  );
}
