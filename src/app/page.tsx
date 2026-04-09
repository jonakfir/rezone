'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Scan, Zap, Bell, ArrowRight, Check, Menu, X,
} from 'lucide-react';

/* ───────────────────────────────────────────── helpers ── */

function useCountUp(end: number, suffix = '', duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, end, duration]);
  return { count, ref, suffix };
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ───────────────────────────────── NAVBAR ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b
        ${scrolled
          ? 'bg-[#0a1f0f]/80 backdrop-blur-xl border-white/5 shadow-2xl shadow-black/30'
          : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Rezone" width={140} height={32} priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Demo', 'Pricing'].map((t) => (
            <a key={t} href={`#${t.toLowerCase()}`}
              className="text-sm text-cream/60 hover:text-cream transition-colors relative after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-copper after:transition-all hover:after:w-full">
              {t}
            </a>
          ))}
          <Link href="/auth/login" className="text-sm text-cream/80 hover:text-cream transition-colors">Log in</Link>
          <Link href="/auth/signup" className="btn-primary text-sm px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-copper/20 transition-all hover:scale-[1.03] active:scale-[0.98]">
            Start Free
          </Link>
        </div>

        <button className="md:hidden text-cream/70" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a1f0f]/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {['Features', 'Demo', 'Pricing'].map((t) => (
                <a key={t} href={`#${t.toLowerCase()}`}
                  className="text-cream/80 py-2" onClick={() => setMenuOpen(false)}>{t}</a>
              ))}
              <Link href="/auth/signup" className="mt-2 btn-primary text-center rounded-lg">Start Free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ───────────────────────────────── HERO ── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-copper/[0.06] blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-teal/[0.04] blur-[100px]" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0a1f0f]/80 blur-[80px]" />
        </motion.div>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(224,123,57,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(224,123,57,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp} custom={0}
            className="font-editorial text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
            Find land <span className="text-copper">before</span>
            <br />
            the market does.
          </motion.h1>

          <motion.p variants={fadeUp} custom={1}
            className="text-cream/50 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            AI-powered rezoning opportunity detection for serious real estate investors.
          </motion.p>

          <motion.div variants={fadeUp} custom={2}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup"
              className="group btn-primary flex items-center gap-2 text-base rounded-xl hover:shadow-2xl hover:shadow-copper/20 hover:scale-[1.03] active:scale-[0.98] transition-all">
              Start your free county scan
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#demo" className="btn-secondary text-base rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              See live demo
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} custom={3}
            className="mt-20 flex items-center justify-center gap-8 text-xs font-mono text-cream/30">
            <span className="hover:text-cream/50 transition-colors">2.4M+ parcels indexed</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span className="hover:text-cream/50 transition-colors">47 signal types</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span className="hover:text-cream/50 transition-colors">Updated daily</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-cream/20 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-cream/20 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}

/* ───────────────────────────────── FEATURES ── */
const featureData = [
  {
    Icon: Scan,
    title: 'Parcel Intelligence',
    desc: 'Deep data on every parcel \u2014 ownership, assessments, zoning classifications, and lot characteristics pulled from county records.',
    stat: 2400000,
    statDisplay: '2.4M+',
    statLabel: 'parcels indexed',
  },
  {
    Icon: Zap,
    title: 'Zoning Signals',
    desc: 'Our scoring engine detects parcels where nearby variance approvals, zone changes, and permit activity signal upcoming rezoning potential.',
    stat: 47,
    statDisplay: '47',
    statLabel: 'signal types tracked',
  },
  {
    Icon: Bell,
    title: 'Weekly Alerts',
    desc: 'Get notified when new high-score parcels appear in your target counties. Daily alerts for Pro. Real-time for Institutional.',
    stat: 24,
    statDisplay: '< 24hr',
    statLabel: 'alert latency',
  },
];

function FeatureCard({ f, i, inView }: { f: typeof featureData[0]; i: number; inView: boolean }) {
  const counter = useCountUp(f.stat === 2400000 ? 2.4 : f.stat);
  const displayValue = f.stat === 2400000
    ? `${counter.count.toFixed(1)}M+`
    : f.stat === 24
      ? `< ${counter.count}hr`
      : `${counter.count}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] transition-all duration-500 hover:bg-white/[0.04] hover:border-copper/20 hover:shadow-2xl hover:shadow-copper/[0.08] hover:-translate-y-1">
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-copper/0 to-copper/0 group-hover:from-copper/[0.04] group-hover:to-transparent transition-all duration-500" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl border border-copper/20 bg-copper/[0.06] group-hover:border-copper/40 group-hover:bg-copper/10 transition-all duration-300">
              <f.Icon size={18} className="text-copper" />
            </div>
            <h3 className="font-editorial text-lg">{f.title}</h3>
          </div>
          <p className="text-cream/60 text-sm leading-relaxed mb-6">{f.desc}</p>
          <div className="flex items-baseline gap-2 pt-5 border-t border-white/[0.06]">
            <span ref={counter.ref} className="font-mono text-2xl text-teal font-bold">
              {displayValue}
            </span>
            <span className="text-xs text-cream/50 uppercase tracking-wider">{f.statLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="py-32 px-6 border-y border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal/[0.02] rounded-full blur-[120px]" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-copper font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-4">Platform Capabilities</p>
          <h2 className="font-editorial text-4xl md:text-5xl mb-4">Intelligence at every layer</h2>
          <p className="text-cream/50 max-w-lg mx-auto">From raw parcel data to actionable investment signals.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {featureData.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────── DEMO ── */
function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="demo" className="py-32 px-6 relative">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-copper/[0.03] rounded-full blur-[100px]" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-copper font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-4">Interactive Preview</p>
          <h2 className="font-editorial text-4xl md:text-5xl mb-4">See it in <span className="text-teal">action</span></h2>
          <p className="text-cream/50 max-w-lg">Explore sample rezoning opportunities in Los Angeles County. Click any parcel to see the full analysis.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative group">
            {/* Glow border effect */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-copper/20 via-teal/10 to-copper/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
            <div className="relative w-full h-[600px] bg-forest-light rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
              {/* Animated grid inside */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,204,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,204,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
                <span className="text-cream/50 font-mono text-sm">Loading map...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────── PRICING ── */
const plans = [
  {
    name: 'Starter', desc: 'For solo investors getting started', price: '$29', period: '/month',
    features: ['1 county scan', 'Weekly email digest', 'Basic opportunity scores', 'Map view', '10 AI summaries/mo'],
    href: '/auth/signup?plan=starter', popular: false,
  },
  {
    name: 'Pro', desc: 'For active investors and dev shops', price: '$79', period: '/month',
    features: ['10 county scans', 'Daily email alerts', 'Unlimited AI summaries', 'Permit history timeline', 'Sales comps', 'CSV export', 'Priority email support'],
    href: '/auth/signup?plan=pro', popular: true,
  },
  {
    name: 'Enterprise', desc: 'For firms and fund managers', price: '$349', period: '/month',
    features: ['Unlimited counties', 'Real-time alerts', 'Unlimited AI analysis', 'API access', 'Custom scoring models', 'CSV + bulk API export', 'Dedicated Slack support'],
    href: '/auth/signup?plan=enterprise', popular: false,
  },
];

function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="pricing" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-copper/[0.03] rounded-full blur-[120px]" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-copper font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-4">Pricing</p>
          <h2 className="font-editorial text-4xl md:text-5xl mb-4">Precision tools, <span className="text-copper">clear pricing</span></h2>
          <p className="text-cream/60 max-w-lg mx-auto">3-day free trial on every plan. No credit card required. Cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm
                ${p.popular
                  ? 'bg-copper/[0.06] border-2 border-copper/30 shadow-2xl shadow-copper/10'
                  : 'bg-white/[0.02] border border-white/10 hover:border-white/[0.15]'}`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-6 px-3 py-1 bg-copper text-white text-[10px] tracking-wider font-bold uppercase rounded-full shadow-lg shadow-copper/30">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-editorial text-xl mb-1">{p.name}</h3>
                  <p className="text-cream/60 text-sm">{p.desc}</p>
                </div>

                <div className="mb-2">
                  <span className="font-editorial text-4xl">{p.price}</span>
                  <span className="text-cream/60 text-sm">{p.period}</span>
                </div>
                <p className="text-xs font-mono text-teal mb-8">3-day free trial</p>

                <ul className="space-y-3 mb-10">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-cream/80">
                      <Check size={14} className="text-teal flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={p.href}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]
                    ${p.popular
                      ? 'bg-copper text-white hover:bg-[#c46628] shadow-lg shadow-copper/20 hover:shadow-copper/40'
                      : 'border border-white/20 text-cream/80 hover:border-copper/40 hover:text-copper'}`}
                >
                  Start Free Trial
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────── CTA ── */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-copper/[0.04] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-editorial text-4xl md:text-5xl mb-6">
            Stop reacting. <span className="text-copper">Start detecting.</span>
          </h2>
          <p className="text-cream/50 text-lg mb-10">
            Join investors and developers who find rezoning opportunities before they hit the market.
          </p>
          <Link href="/auth/signup"
            className="group btn-primary inline-flex items-center gap-2 text-lg px-10 py-5 rounded-xl hover:shadow-2xl hover:shadow-copper/30 hover:scale-[1.03] active:scale-[0.98] transition-all">
            Start your free county scan
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────── FOOTER ── */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Image src="/logo.svg" alt="Rezone" width={120} height={28} />
            <p className="text-cream/30 text-sm mt-4 leading-relaxed">AI-powered rezoning opportunity detection for serious real estate investors.</p>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-cream/40 uppercase mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[['Features', '#features'], ['Pricing', '#pricing'], ['Demo', '#demo'], ['Map', '/app/map']].map(([t, h]) => (
                <li key={t}><a href={h} className="text-sm text-cream/60 hover:text-cream transition-colors">{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-cream/40 uppercase mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map((t) => (
                <li key={t}><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-wider text-cream/40 uppercase mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy', 'Terms', 'Security'].map((t) => (
                <li key={t}><a href="#" className="text-sm text-cream/60 hover:text-cream transition-colors">{t}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/20 font-mono">&copy; 2026 Rezone, Inc. All rights reserved.</p>
          <p className="text-xs text-cream/20 font-mono">Built for professionals who move before the market.</p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────────────── PAGE ── */
export default function LandingPage() {
  return (
    <main className="bg-forest text-cream font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
