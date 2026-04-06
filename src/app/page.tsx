import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureStrip from "@/components/FeatureStrip";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const CityGridCanvas = dynamic(() => import("@/components/CityGridCanvas"), {
  ssr: false,
});

const DemoMap = dynamic(() => import("@/components/DemoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-forest-light border border-white/5 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
        <span className="text-cream/50 font-mono text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

export default function LandingPage() {
  return (
    <main>
      <Navbar transparent />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <CityGridCanvas />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
            Find land{" "}
            <span className="text-copper">before</span>
            <br />
            the market does.
          </h1>
          <p className="text-cream/50 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            AI-powered rezoning opportunity detection for serious real estate investors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="btn-primary flex items-center gap-2 text-base"
            >
              Start your free county scan
              <ArrowRight size={18} />
            </Link>
            <a href="#demo" className="btn-secondary text-base">
              See live demo
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-xs font-mono text-cream/30">
            <span>2.4M+ parcels indexed</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span>47 signal types</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span>Updated daily</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-cream/20 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-cream/20 to-transparent" />
        </div>
      </section>

      {/* Feature Strip */}
      <FeatureStrip />

      {/* Demo Map */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="font-editorial text-4xl md:text-5xl mb-4">
              See it in <span className="text-teal">action</span>
            </h2>
            <p className="text-cream/50 max-w-lg">
              Explore sample rezoning opportunities in Los Angeles County.
              Click any parcel to see the full analysis.
            </p>
          </div>
          <DemoMap />
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-editorial text-4xl md:text-5xl mb-6">
            Stop reacting.{" "}
            <span className="text-copper">Start detecting.</span>
          </h2>
          <p className="text-cream/50 text-lg mb-10">
            Join investors and developers who find rezoning opportunities before
            they hit the market.
          </p>
          <Link
            href="/auth/signup"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            Start your free county scan
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
