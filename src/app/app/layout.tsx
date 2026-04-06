"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Map, Bell, LogOut, User } from "lucide-react";

const navItems = [
  { href: "/app/map", label: "Map", icon: Map },
  { href: "/app/alerts", label: "Alerts", icon: Bell },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-white/5 bg-forest flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src="/logo.svg" alt="Rezone" width={110} height={26} />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                  pathname === item.href
                    ? "text-cream bg-white/5"
                    : "text-cream/50 hover:text-cream hover:bg-white/5"
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-copper/10 border border-copper/20 mr-3">
            <div className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
            <span className="text-xs font-mono text-copper">
              New opportunities this week: 14
            </span>
          </div>

          <button className="relative p-2 text-cream/40 hover:text-cream transition-colors">
            <Bell size={16} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-copper" />
          </button>

          <button className="p-2 text-cream/40 hover:text-cream transition-colors">
            <User size={16} />
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 text-cream/40 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
