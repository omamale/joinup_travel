'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Users, Star, MapPin, Zap, MessageCircle,
  CreditCard, Heart, AlertTriangle, ArrowRight, Menu, X,
  Bot, Clock, Wallet, Lock, Phone, CheckCircle, Globe,
  Sparkles, Camera, Navigation, Bell, TrendingUp, Search,
  Twitter, Instagram, Youtube, Facebook,
} from 'lucide-react';
import { ALL_DESTINATIONS } from '@/lib/destinations';

/* ── brand tokens ─────────────────────────────────────── */
const B = {
  blue:  '#0F4C81',
  blueL: '#1A6BAB',
  green: '#2BB673',
  orng:  '#FF8A3D',
  dark:  '#050D1A',
  darkC: '#0A1A2E',
} as const;

/* ── scroll-reveal hook ───────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, v };
}

const reveal = (v: boolean, delay = 0) => ({
  transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  opacity: v ? 1 : 0,
  transform: v ? 'none' : 'translateY(28px)',
});

/* ══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const router = useRouter();
  const [navScrolled, setNavScrolled] = useState(false);
  const [navDark, setNavDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const matched = search.length >= 1
    ? ALL_DESTINATIONS.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).slice(0, 4)
    : [];

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const darkIds = ['hero-section', 'features', 'ai-planner', 'waitlist'];
    const active = new Set<string>();
    const observers = darkIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) active.add(id); else active.delete(id);
        setNavDark(active.size > 0);
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
      io.observe(el);
      return io;
    });
    return () => observers.forEach(io => io?.disconnect());
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      const exact = ALL_DESTINATIONS.find(d => d.name.toLowerCase() === search.toLowerCase());
      router.push(`/destinations/${encodeURIComponent(exact?.name ?? search.trim())}`);
      setShowSearch(false);
    }
  };

  /* ── SECTION REFs ── */
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView();
  const s7 = useInView(); const s8 = useInView();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#fff' }}>

      {/* ────────────────────────── NAVBAR ────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3.5 pointer-events-none">
        <div
          className="max-w-6xl mx-auto rounded-2xl transition-all duration-500 pointer-events-auto"
          style={{
            background: navDark ? 'rgba(5,13,26,0.85)' : 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: navDark ? '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)' : '0 4px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: navDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
          }}
        >
          <div className="px-5 sm:px-6 flex items-center justify-between" style={{ height: 58 }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})` }}>
                <Navigation style={{ width: 16, height: 16, color: '#fff' }} />
              </div>
              <span className="text-base font-bold transition-colors duration-300" style={{ color: navDark ? '#fff' : B.dark }}>
                JoinUp<span style={{ color: B.orng }}> Travel</span>
              </span>
            </Link>

            {/* Nav links – desktop */}
            <div className="hidden md:flex items-center gap-7">
              {['Features', 'Safety', 'AI Planner', 'Community'].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium transition-colors duration-300 hover:opacity-100"
                  style={{ color: navDark ? 'rgba(255,255,255,0.75)' : '#4B5563' }}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* CTAs – desktop */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link
                href="/auth/login"
                className="text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-300"
                style={{ color: navDark ? 'rgba(255,255,255,0.8)' : B.blue }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: `0 4px 14px rgba(15,76,129,0.4)` }}
              >
                Join Waitlist
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-xl"
              style={{ color: navDark ? '#fff' : B.dark }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t" style={{ borderColor: navDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-4 flex flex-col gap-3">
                {['Features', 'Safety', 'AI Planner', 'Community'].map((l) => (
                  <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                    className="font-medium py-2 transition-colors"
                    style={{ color: navDark ? 'rgba(255,255,255,0.8)' : '#374151' }}
                    onClick={() => setMobileOpen(false)}>{l}</a>
                ))}
                <hr style={{ borderColor: navDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }} />
                <Link href="/auth/login" className="font-medium py-2" style={{ color: navDark ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>Sign In</Link>
                <Link href="/auth/register" className="text-center font-semibold py-3 rounded-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)` }}>Join Waitlist</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ────────────────────────── HERO ────────────────────────── */}
      <section id="hero-section" className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Video BG — group travel / friends exploring together */}
        <video
          autoPlay muted loop playsInline
          poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=85"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/6774799/6774799-hd_1920_1080_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/4127442/4127442-hd_1920_1080_24fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,13,26,0.65) 0%, rgba(5,13,26,0.55) 50%, rgba(5,13,26,0.82) 100%)' }} />

        {/* Floating ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20 animate-float-slow"
          style={{ background: `radial-gradient(circle, ${B.blue}, transparent 70%)`, filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full pointer-events-none opacity-15 animate-float"
          style={{ background: `radial-gradient(circle, ${B.green}, transparent 70%)`, filter: 'blur(50px)', animationDelay: '2s' }} />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-24 pb-36 sm:pb-40 md:pb-48">
          <div className="max-w-3xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-5 sm:mb-7 text-xs sm:text-sm font-medium text-white"
              style={{ background: 'rgba(43,182,115,0.2)', border: '1px solid rgba(43,182,115,0.4)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse-ring shrink-0" style={{ background: B.green }} />
              Trusted by 10,000+ verified travellers across India
            </div>

            <h1 className="font-extrabold text-white leading-[1.08] mb-5 sm:mb-6"
              style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', letterSpacing: '-0.03em' }}>
              Travel Together.<br />
              <span style={{
                background: `linear-gradient(135deg, ${B.green}, #7EDDB3)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Explore Safely.</span>
            </h1>

            <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 540 }}>
              Find verified travel companions, join trusted group trips, and plan unforgettable journeys with AI — all in one place.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mb-8">
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(16px)' }}>
                <Search className="w-5 h-5 shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} />
                <input
                  type="text"
                  value={search}
                  placeholder="Search a destination — Goa, Manali, Varanasi…"
                  onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 150)}
                  onKeyDown={handleSearch}
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-sm font-medium"
                />
              </div>
              {showSearch && (search.trim().length > 0) && (
                <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden z-50 shadow-2xl"
                  style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                  {matched.map(d => (
                    <Link key={d.name} href={`/destinations/${d.name}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: B.blue }} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.tagline}</p>
                      </div>
                    </Link>
                  ))}
                  {search.trim() && (
                    <Link href={`/destinations/${encodeURIComponent(search.trim())}`}
                      className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 hover:bg-blue-50 transition-colors">
                      <Search className="w-4 h-4 shrink-0" style={{ color: B.blue }} />
                      <p className="text-sm font-medium" style={{ color: B.blue }}>Explore &ldquo;{search.trim()}&rdquo; →</p>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <a href="#waitlist"
                className="flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: '0 8px 28px rgba(15,76,129,0.5)' }}>
                Join the Waitlist <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/trips"
                className="flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:bg-white/20 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>
                Explore Trips
              </Link>
            </div>
          </div>

          {/* Floating glass trip card */}
          <div className="hidden lg:block absolute right-8 xl:right-0 top-1/2 -translate-y-1/2 w-72 animate-float"
            style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.35))' }}>
            <div className="rounded-3xl overflow-hidden glass p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Featured Trip</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: `${B.green}30`, color: B.green }}>Open</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80" alt="Goa" className="w-full h-32 object-cover rounded-2xl" />
              <div>
                <h3 className="font-bold text-white text-base">Pune → Goa Weekend Trip</h3>
                <p className="text-sm text-white/60 mt-0.5">Dec 20 – Dec 24 · 4 nights</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Users, label: '8 Travelers' },
                  { icon: Shield, label: 'Verified' },
                  { icon: Wallet, label: '₹6,500' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <Icon className="w-4 h-4 text-white/80" />
                    <span className="text-xs text-white/70 font-medium text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 text-white"
                style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})` }}>
                Join This Trip →
              </button>
            </div>
          </div>
        </div>

        {/* Trust stats bar */}
        <div className="absolute bottom-0 left-0 right-0 py-5 border-t" style={{ background: 'rgba(5,13,26,0.7)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-row items-center justify-around gap-2 sm:gap-0">
              {[
                { icon: Shield, val: '10K+', label: 'ID Verified Users', color: B.green },
                { icon: Users, val: '500+', label: 'Safe Group Trips', color: B.orng },
                { icon: Star, val: '4.9★', label: 'Community Rating', color: '#FBBF24' },
              ].map(({ icon: Icon, val, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-extrabold text-white text-lg leading-none">{val}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── TICKER ────────────────────────── */}
      <div className="py-3 overflow-hidden" style={{ background: B.blue }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {Array(2).fill(['Goa Beach Vibes', 'Manali Snow Trek', 'Rajasthan Heritage', 'Kerala Backwaters', 'Ladakh High Altitude', 'Rishikesh Rafting', 'Darjeeling Sunrise', 'Coorg Coffee Trails', 'Andaman Escape', 'Mumbai by Night']).flat().map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 px-8">
              <MapPin className="w-3.5 h-3.5" style={{ color: B.orng }} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ────────────────────────── 1. PROBLEM ────────────────────────── */}
      <section id="features" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s1.ref} className="max-w-6xl mx-auto">
          <div style={reveal(s1.v)} className="text-center mb-10 md:mb-16">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.orng }}>The Problem</p>
            <h2 className="font-extrabold text-white text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Solo travel has a<br />few unsolved problems
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Users, title: "Friends aren't always free", body: "Everyone has conflicting schedules and budgets. Your dream trip keeps getting postponed.", color: B.orng, delay: 0 },
              { icon: AlertTriangle, title: "Solo travel feels unsafe", body: "Travelling alone in unfamiliar places carries real risks. One wrong decision can ruin the trip.", color: '#EF4444', delay: 0.12 },
              { icon: Clock, title: "Planning is exhausting", body: "Hotels, itineraries, transport, budgets — planning takes 20+ hours and it still might go wrong.", color: '#FBBF24', delay: 0.24 },
            ].map(({ icon: Icon, title, body, color, delay }) => (
              <div key={title} style={{ ...reveal(s1.v, delay), background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem' }}
                className="group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-white text-base sm:text-xl mb-2 sm:mb-3">{title}</h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────── 2. SOLUTION ────────────────────────── */}
      <section className="relative py-16 md:py-24 px-5 sm:px-8 overflow-hidden" style={{ background: 'transparent' }}>
        {/* Water / mountain river background — full opacity, overlay tints it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* Dark navy overlay — lets ~28% of water image show through */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,13,26,0.72)' }} />
        <div ref={s2.ref} className="relative max-w-6xl mx-auto">
          <div style={reveal(s2.v)} className="text-center mb-10 md:mb-16">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.green }}>How It Works</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-white" style={{ letterSpacing: '-0.02em' }}>
              Three steps to your<br />next great adventure
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Shield, title: 'Verify Your Profile', body: 'Complete our ID verification and get a trust score. Verified users get priority access to premium trips.', color: B.blue, delay: 0 },
              { step: '02', icon: Users, title: 'Join Trusted Trips', body: "Browse curated group trips by destination, dates, budget and style. See who's going before you commit.", color: B.green, delay: 0.12 },
              { step: '03', icon: Sparkles, title: 'Travel Confidently', body: 'Chat with your group, share expenses, and use our SOS button. Adventure without anxiety.', color: B.orng, delay: 0.24 },
            ].map(({ step, icon: Icon, title, body, color, delay }) => (
              <div key={step} style={reveal(s2.v, delay)} className="relative text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${color}30, ${color}45)`, border: `2px solid ${color}60` }}>
                    <Icon className="w-9 h-9" style={{ color }} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                    style={{ background: color, fontSize: 10 }}>{step}</span>
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">{title}</h3>
                <p className="leading-relaxed text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>{body}</p>
              </div>
            ))}
          </div>
          <div style={reveal(s2.v, 0.4)} className="text-center mt-12">
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})`, boxShadow: `0 8px 24px ${B.blue}50` }}>
              Get Verified Today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────── 3. FEATURES GRID ────────────────────────── */}
      <section style={{ background: '#fff' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s3.ref} className="max-w-6xl mx-auto">
          <div style={reveal(s3.v)} className="text-center mb-10 md:mb-16">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.blue }}>Everything You Need</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ color: B.dark, letterSpacing: '-0.02em' }}>
              Built for real travellers
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { icon: Shield, title: 'Identity Verification', body: "Government ID + selfie verification for every member. Know exactly who you're travelling with.", color: B.blue, delay: 0 },
              { icon: TrendingUp, title: 'Trust Score', body: 'Earn trust points for verified ID, completed trips, positive reviews and consistent behaviour.', color: B.green, delay: 0.05 },
              { icon: Bot, title: 'AI Trip Planner', body: 'Generate a complete day-by-day itinerary with hotels, food, budget breakdown in under 30 seconds.', color: '#8B5CF6', delay: 0.1 },
              { icon: MessageCircle, title: 'Group Chat', body: 'Real-time encrypted chat for your trip group. Share photos, locations, plans — all in one thread.', color: B.orng, delay: 0.15 },
              { icon: CreditCard, title: 'Expense Splitting', body: 'Track shared costs, split bills fairly, and settle up in one tap. Zero awkward money conversations.', color: '#EC4899', delay: 0.2 },
              { icon: Star, title: 'Ratings & Reviews', body: 'Rate your companions after every trip. Build a reputation that opens doors to premium groups.', color: '#FBBF24', delay: 0.25 },
              { icon: Heart, title: 'Girls-Only Trips', body: 'Dedicated verified women-only trips with extra safety layers and a moderated community.', color: '#F43F5E', delay: 0.3 },
              { icon: AlertTriangle, title: 'Emergency SOS', body: 'One-tap SOS sends your live location to emergency contacts and our safety team instantly.', color: '#EF4444', delay: 0.35 },
            ].map(({ icon: Icon, title, body, color, delay }) => (
              <div key={title} style={{ ...reveal(s3.v, delay), borderRadius: 16, border: '1px solid #f0f2f5', padding: '1rem' }}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default sm:p-6">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}12` }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────── 4. AI PLANNER ────────────────────────── */}
      <section id="ai-planner" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s4.ref} className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div style={reveal(s4.v)}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: B.green }}>AI-Powered Planning</p>
              <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-white mb-5 sm:mb-6" style={{ letterSpacing: '-0.02em' }}>
                Your personal<br />travel brain
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Tell us your destination, budget, and travel style. Our AI generates a complete itinerary — hotels, restaurants, activities, and local tips — in under 30 seconds.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Bot, label: 'Day-by-day itinerary', sub: 'Personalised for your travel style' },
                  { icon: Globe, label: 'Hotel & restaurant picks', sub: 'Budget-matched recommendations' },
                  { icon: Wallet, label: 'Full budget breakdown', sub: 'Transport, food, activities, stays' },
                  { icon: Camera, label: 'Local insider tips', sub: 'Hidden gems beyond the tourist trail' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${B.green}20` }}>
                      <Icon className="w-5 h-5" style={{ color: B.green }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{sub}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 ml-auto shrink-0" style={{ color: B.green }} />
                  </div>
                ))}
              </div>
              <Link href="/ai-planner"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${B.green}, #1DA05E)`, boxShadow: `0 8px 24px ${B.green}40` }}>
                Try AI Planner Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Bikers Photo Card */}
            <div style={reveal(s4.v, 0.2)} className="animate-float-slow">
              <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90"
                  alt="Bikers on mountain road adventure"
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/3', display: 'block' }}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,13,26,0.08) 0%, rgba(5,13,26,0.0) 40%, rgba(5,13,26,0.82) 100%)' }} />
                {/* Live AI badge */}
                <div className="absolute top-5 left-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${B.green}28`, border: `1px solid ${B.green}50`, backdropFilter: 'blur(8px)' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: B.green, display: 'block' }} />
                    <span className="text-xs font-semibold text-white">AI-Planned Route</span>
                  </div>
                </div>
                {/* Trip info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${B.green}25`, border: `1px solid ${B.green}40` }}>
                      <Bot className="w-5 h-5" style={{ color: B.green }} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Pune → Ladakh Ride</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>AI Planned · 12 Days · ₹45,000/person</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: MapPin, label: '8 Stops' },
                      { icon: Users, label: '6 Riders' },
                      { icon: Shield, label: 'Verified' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}>
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: B.green }} />
                        <span className="text-xs text-white font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── 5. SAFETY ────────────────────────── */}
      <section id="safety" className="relative py-16 md:py-24 px-5 sm:px-8 overflow-hidden" style={{ background: 'transparent' }}>
        {/* Hiking / mountain rescue background — full opacity, overlay tints it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=85"
          alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center top' }}
        />
        {/* Dark navy overlay — lets ~25% of hiking image show through */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,13,26,0.75)' }} />
        <div ref={s5.ref} className="relative max-w-6xl mx-auto">
          <div style={reveal(s5.v)} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6B6B' }}>Safety First</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-white" style={{ letterSpacing: '-0.02em' }}>
              Every trip.<br />Every traveller. Protected.
            </h2>
            <p className="text-lg mt-4 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Safety is not a feature on JoinUp — it's the foundation every single thing is built on.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5">
            {[
              { icon: Shield, title: 'Verified Profiles', body: 'Government ID + live selfie match. Every member is who they say they are.', color: B.blue, delay: 0 },
              { icon: Users, title: 'Group-First Travel', body: 'We never let you travel alone into risk. Every trip has trusted co-members.', color: B.green, delay: 0.08 },
              { icon: Bell, title: 'Moderation Team', body: '24/7 human moderation. Any concern gets a real person responding in minutes.', color: B.orng, delay: 0.16 },
              { icon: Phone, title: 'Emergency SOS', body: 'One tap sends your GPS to emergency contacts and our India-wide safety network.', color: '#EF4444', delay: 0.24 },
              { icon: Lock, title: 'Secure Payments', body: 'All payments are encrypted and escrowed. Funds release only after trip confirmation.', color: '#8B5CF6', delay: 0.32 },
            ].map(({ icon: Icon, title, body, color, delay }) => (
              <div key={title}
                style={{ ...reveal(s5.v, delay), background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '1.75rem' }}
                className="text-center group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}28` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────── 6. SOCIAL PROOF ────────────────────────── */}
      <section style={{ background: '#F8FAFC' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s6.ref} className="max-w-6xl mx-auto">
          {/* Stats */}
          <div style={reveal(s6.v)} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { val: '10K+', label: 'Verified Members', color: B.blue },
              { val: '500+', label: 'Trips Completed', color: B.green },
              { val: '4.9★', label: 'Avg Trust Score', color: '#FBBF24' },
              { val: '0',   label: 'Safety Incidents', color: '#EF4444' },
            ].map(({ val, label, color }) => (
              <div key={label} className="text-center p-6 rounded-3xl" style={{ background: '#fff', border: '1px solid #f0f2f5' }}>
                <p className="font-extrabold text-4xl mb-1" style={{ color }}>{val}</p>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>

          <div style={reveal(s6.v, 0.1)} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.blue }}>Community</p>
            <h2 className="font-extrabold text-3xl md:text-4xl" style={{ color: B.dark }}>What travellers are saying</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: 'Priya Sharma', location: 'Pune → Goa', avatar: 'PS', text: "JoinUp's verification made me feel completely safe. The girls-only Goa trip was the best experience of my life!", rating: 5, delay: 0 },
              { name: 'Rohan Mehta', location: 'Mumbai → Manali', avatar: 'RM', text: 'The AI planner saved me hours of research. Within 2 minutes I had a full Manali itinerary that was better than anything I could have planned myself. Incredible.', rating: 5, delay: 0.1 },
              { name: 'Ananya Patel', location: 'Bangalore → Rishikesh', avatar: 'AP', text: "Met three amazing people on a Rishikesh rafting trip. We're planning our second JoinUp trip together now. This platform completely changed how I travel.", rating: 5, delay: 0.2 },
            ].map(({ name, location, avatar, text, rating, delay }) => (
              <div key={name} style={{ ...reveal(s6.v, delay), background: '#fff', border: '1px solid #f0f2f5', borderRadius: 24, padding: '1.75rem' }}
                className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array(rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 text-sm">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})` }}>{avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────── 7. DESTINATIONS ────────────────────────── */}
      <section id="community" style={{ background: '#fff' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s7.ref} className="max-w-6xl mx-auto">
          <div style={reveal(s7.v)} className="flex items-end justify-between mb-8 sm:mb-12 flex-wrap gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: B.orng }}>Popular Destinations</p>
              <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl" style={{ color: B.dark }}>Where is everyone going?</h2>
            </div>
            <Link href="/trips" className="flex items-center gap-2 font-semibold text-sm transition-colors hover:underline" style={{ color: B.blue }}>
              View all trips <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Goa', tag: 'Beach', trips: 42, img: 'photo-1512343879784-a960bf40e7f2' },
              { name: 'Manali', tag: 'Mountains', trips: 28, img: 'photo-1558618666-fcd25c85cd64' },
              { name: 'Rishikesh', tag: 'Adventure', trips: 35, img: 'photo-1591951425328-48c78ec28a97' },
              { name: 'Rajasthan', tag: 'Culture', trips: 19, img: 'photo-1524492412937-b28074a5d7da' },
              { name: 'Kerala', tag: 'Nature', trips: 23, img: 'photo-1602301878688-72303a3e3d30' },
              { name: 'Ladakh', tag: 'High Altitude', trips: 15, img: 'photo-1508193638397-1c4234db14d8' },
            ].map(({ name, tag, trips, img }, i) => (
              <div key={name} style={reveal(s7.v, i * 0.06)}>
                <Link href={`/destinations/${name}`}
                  className="group relative overflow-hidden rounded-3xl block hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
                <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: '4/3' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://images.unsplash.com/${img}?w=600&q=80`} alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: `${B.orng}CC` }}>{tag}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-bold text-white text-xl">{name}</h3>
                    <p className="text-white/70 text-sm mt-1">{trips} active trips</p>
                  </div>
                </div>
              </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────── 8. WAITLIST CTA ────────────────────────── */}
      <section id="waitlist" style={{ background: B.dark }} className="py-20 md:py-28 px-5 sm:px-8">
        <div ref={s8.ref} className="max-w-2xl mx-auto text-center">
          <div style={reveal(s8.v)} className="mb-10">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ background: `${B.orng}20`, border: `1px solid ${B.orng}30` }}>
              <Navigation className="w-8 h-8" style={{ color: B.orng }} />
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
              Your next adventure<br />starts with the right people.
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Join 10,000+ travellers on the waitlist. Be first to access verified group trips, the AI planner, and an exclusive launch offer.
            </p>
          </div>

          {joined ? (
            <div style={{ ...reveal(s8.v, 0.1), background: `${B.green}15`, border: `1px solid ${B.green}40`, borderRadius: 20, padding: '2rem' }} className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: B.green }} />
              <h3 className="font-bold text-white text-xl mb-2">You're on the list!</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>We'll email you at <strong className="text-white">{email}</strong> when we launch. Get ready to explore.</p>
            </div>
          ) : (
            <form onSubmit={handleJoin} style={reveal(s8.v, 0.1)} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-2xl text-base outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
              />
              <button type="submit"
                className="px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95 shrink-0"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: '0 8px 24px rgba(15,76,129,0.5)' }}>
                Join Waitlist →
              </button>
            </form>
          )}
          <p style={{ color: 'rgba(255,255,255,0.3)', ...reveal(s8.v, 0.2) }} className="text-xs mt-4">
            No spam. Unsubscribe anytime. We hate spam as much as you do.
          </p>
        </div>
      </section>

      {/* ────────────────────────── FOOTER ────────────────────────── */}
      <footer style={{ background: '#020810', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="pt-12 sm:pt-16 pb-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})` }}>
                  <Navigation className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                </div>
                <span className="text-lg font-bold text-white">JoinUp<span style={{ color: B.orng }}> Travel</span></span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                India's first verified travel companion platform. Travel together. Explore safely.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Instagram, href: '#' },
                  { Icon: Twitter, href: '#' },
                  { Icon: Youtube, href: '#' },
                  { Icon: Facebook, href: '#' },
                ].map(({ Icon, href }) => (
                  <a key={href + Icon.name} href={href}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Explore Trips', 'AI Planner', 'Group Chat', 'Trust Score', 'SOS Safety'] },
              { title: 'Company', links: ['About Us', 'Safety', 'FAQ', 'Contact', 'Blog'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-white text-sm mb-5">{title}</h4>
                <ul className="space-y-3">
                  {links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2025 JoinUp Travel Pvt Ltd. Made with ❤️ in Pune, India.</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <Lock className="w-3 h-3" />
              <span>SSL Secured · RazorPay Protected · DPIIT Recognised Startup</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
