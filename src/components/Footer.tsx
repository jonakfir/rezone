import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Image src="/logo.svg" alt="Rezone" width={120} height={28} />
            <p className="text-cream/30 text-sm mt-4 leading-relaxed">
              AI-powered rezoning opportunity detection for serious real estate investors.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-wider text-cream/40 uppercase mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-cream/60 hover:text-cream transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-cream/60 hover:text-cream transition-colors">Pricing</a></li>
              <li><a href="#demo" className="text-sm text-cream/60 hover:text-cream transition-colors">Demo</a></li>
              <li><Link href="/app/map" className="text-sm text-cream/60 hover:text-cream transition-colors">Map</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-wider text-cream/40 uppercase mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-wider text-cream/40 uppercase mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/20 font-mono">
            &copy; {new Date().getFullYear()} Rezone, Inc. All rights reserved.
          </p>
          <p className="text-xs text-cream/20 font-mono">
            Built for professionals who move before the market.
          </p>
        </div>
      </div>
    </footer>
  );
}
