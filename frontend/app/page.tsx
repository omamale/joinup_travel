'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield, Users, Star, MapPin, ArrowRight, Menu, X,
  Bot, Wallet, Lock, Phone, CheckCircle, Globe,
  Sparkles, Camera, Navigation, Bell, TrendingUp,
  Instagram, Linkedin, ChevronDown, ChevronUp,
  UserCheck, ScanFace, LocateFixed, Flag, BadgeCheck,
  Copy, MessageCircle, Heart, AlertTriangle, CreditCard,
  Share2, Rocket,
} from 'lucide-react';

/* ── brand ── */
const B = { blue: '#0F4C81', blueL: '#1A6BAB', green: '#2BB673', orng: '#FF8A3D', dark: '#050D1A' } as const;

/* ── analytics helper ── */
const track = (action: string, label: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, { event_label: label });
  }
};

/* ── scroll reveal ── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return { ref, v };
}
const reveal = (v: boolean, delay = 0) => ({
  transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  opacity: v ? 1 : 0,
  transform: v ? 'none' : 'translateY(24px)',
});

/* ── data ── */
const PUNE_TRIPS = [
  { from: 'Pune', to: 'Goa', duration: '3 nights', budget: '₹5,500', type: 'Beach', img: 'photo-1512343879784-a960bf40e7f2', color: B.blue },
  { from: 'Pune', to: 'Lonavala', duration: '1 night', budget: '₹2,200', type: 'Hills', img: 'photo-1548013146-72479768bada', color: B.green },
  { from: 'Pune', to: 'Mahabaleshwar', duration: '2 nights', budget: '₹3,800', type: 'Nature', img: 'photo-1591951425328-48c78ec28a97', color: B.orng },
];

const FAQS = [
  { q: 'How do you verify users?', a: 'Every member submits a government-issued ID (Aadhaar, PAN, or Passport) plus a live selfie match. Our team manually reviews each submission before approving access to any trip.' },
  { q: 'Are women-only trips available?', a: 'Yes. JoinUp has dedicated Women-Only trips with extra verification, a moderated community, and 24/7 support. Safety is our top priority for solo women travellers.' },
  { q: 'Is JoinUp Travel free?', a: 'Creating a profile and joining the waitlist is completely free. We plan a freemium model — basic features free, premium features (AI planner, priority matching) for a small subscription.' },
  { q: 'What happens if someone doesn\'t show up?', a: 'We have a strict no-show policy. Last-minute cancellations result in a trust penalty. Repeat offenders are removed from the platform. Trip funds are held in escrow until departure.' },
  { q: 'How are payments handled?', a: 'All trip payments go through our escrow system. Money is held securely and released only after trip confirmation. You get a full refund if the trip is cancelled before departure.' },
  { q: 'When will the app launch?', a: 'We are launching in Pune first. Join the waitlist to get early access before the public launch. Founding members get exclusive perks and first access to all new features.' },
];

/* ── phone mockup component ── */
function PhoneMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 220, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))' }}>
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] overflow-hidden"
        style={{ background: 'rgba(15,25,40,0.95)', border: '2px solid rgba(255,255,255,0.12)', padding: '8px' }}>
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full z-10"
          style={{ background: 'rgba(10,20,35,1)' }} />
        {/* Screen */}
        <div className="rounded-[2rem] overflow-hidden" style={{ background: '#0A1628', minHeight: 400 }}>
          {/* Status bar */}
          <div className="flex justify-between items-center px-4 pt-6 pb-2">
            <span className="text-white text-[9px] font-bold">9:41</span>
            <span className="text-white/60 text-[8px]">●●●</span>
          </div>
          {/* Header */}
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white/50 text-[8px]">Good morning,</p>
                <p className="text-white font-bold text-[11px]">Priya ✌️</p>
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${B.green}30` }}>
                <BadgeCheck className="w-3.5 h-3.5" style={{ color: B.green }} />
              </div>
            </div>
            {/* Trust score */}
            <div className="rounded-xl p-2 mb-2" style={{ background: `linear-gradient(135deg, ${B.blue}40, ${B.blueL}30)`, border: `1px solid ${B.blue}40` }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] text-white/60">Trust Score</span>
                <span className="text-[8px] font-bold" style={{ color: B.green }}>Verified ✓</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-lg font-extrabold text-white leading-none">87</span>
                <span className="text-[7px] text-white/40 mb-0.5">/100</span>
              </div>
              <div className="w-full h-1 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: '87%', background: B.green }} />
              </div>
            </div>
            {/* Trip card */}
            <div className="rounded-xl overflow-hidden mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=70" alt="Goa" className="w-full object-cover" style={{ height: 60 }} />
              <div className="p-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-[9px]">Pune → Goa</p>
                    <p className="text-white/50 text-[7px]">Dec 20 · 4 nights</p>
                  </div>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: B.green }}>Open</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3].map(n => (
                    <div key={n} className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ background: `hsl(${n*80},60%,45%)` }}>{n}</div>
                  ))}
                  <span className="text-[7px] text-white/40 ml-0.5">+5 going</span>
                </div>
              </div>
            </div>
            {/* Chat preview */}
            <div className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageCircle className="w-3 h-3" style={{ color: B.orng }} />
                <span className="text-[8px] font-bold text-white">Goa Trip Chat</span>
                <span className="ml-auto text-[6px] text-white/30">now</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#8B5CF6' }} />
                  <p className="text-[7px] text-white/60">Rahul: Anyone from Pune?</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: B.green }} />
                  <p className="text-[7px] text-white/60">Sneha: Yes! Let's meet up</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 px-2.5 py-1 rounded-full text-[9px] font-bold text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${B.green}, #1DA05E)` }}>
        ID Verified ✓
      </div>
      <div className="absolute -bottom-3 -left-3 px-2.5 py-1 rounded-full text-[9px] font-bold text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${B.orng}, #E07000)` }}>
        🛡 SOS Ready
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
export default function LandingPage() {
  const [navDark, setNavDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', city: '', ageGroup: '', destination: '', soloTravelled: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const darkIds = ['hero-section', 'features', 'ai-planner', 'waitlist', 'trust-safety'];
    const active = new Set<string>();
    const observers = darkIds.map(id => {
      const el = document.getElementById(id); if (!el) return null;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) active.add(id); else active.delete(id);
        setNavDark(active.size > 0);
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
      io.observe(el); return io;
    });
    return () => observers.forEach(io => io?.disconnect());
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    return e;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const code = btoa(form.email).replace(/[^A-Z0-9]/gi, '').slice(0, 8).toUpperCase();
    setReferralCode(code);
    setJoined(true);
    setSubmitting(false);
    track('waitlist_join', form.email);
  };

  const referralLink = `https://joinuptravell.vercel.app?ref=${referralCode}`;
  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track('referral_copy', referralCode);
  };
  const whatsappShare = () => {
    const msg = encodeURIComponent(`Join me on JoinUp Travel — a verified travel companion platform launching in Pune! Sign up here: ${referralLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    track('referral_whatsapp', referralCode);
  };

  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView();
  const s7 = useInView(); const s8 = useInView();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#fff' }}>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 pointer-events-none">
        <div className="max-w-6xl mx-auto rounded-2xl transition-all duration-500 pointer-events-auto"
          style={{
            background: navDark ? 'rgba(5,13,26,0.88)' : 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            boxShadow: navDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.08)',
            border: navDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
          }}>
          <div className="px-4 sm:px-6 flex items-center justify-between" style={{ height: 56 }}>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})` }}>
                <Navigation style={{ width: 15, height: 15, color: '#fff' }} />
              </div>
              <span className="font-bold text-base" style={{ color: navDark ? '#fff' : B.dark }}>
                JoinUp<span style={{ color: B.orng }}> Travel</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {[['How It Works', '#how-it-works'], ['Safety', '#trust-safety'], ['Trips', '#city-trips'], ['FAQ', '#faq']].map(([l, h]) => (
                <a key={l} href={h} className="text-sm font-medium" style={{ color: navDark ? 'rgba(255,255,255,0.75)' : '#4B5563' }}>{l}</a>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login" className="text-sm font-medium px-4 py-2 rounded-xl" style={{ color: navDark ? 'rgba(255,255,255,0.8)' : B.blue }}>Sign In</Link>
              <a href="#waitlist" onClick={() => track('cta_click', 'nav_join_waitlist')}
                className="text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)` }}>Join Waitlist</a>
            </div>
            <button className="md:hidden p-2 rounded-xl" style={{ color: navDark ? '#fff' : B.dark }} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileOpen && (
            <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3" style={{ borderColor: navDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }}>
              {[['How It Works', '#how-it-works'], ['Safety', '#trust-safety'], ['Trips', '#city-trips'], ['FAQ', '#faq']].map(([l, h]) => (
                <a key={l} href={h} className="font-medium py-2" style={{ color: navDark ? 'rgba(255,255,255,0.8)' : '#374151' }} onClick={() => setMobileOpen(false)}>{l}</a>
              ))}
              <hr style={{ borderColor: navDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }} />
              <a href="#waitlist" className="text-center font-semibold py-3 rounded-xl text-white"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)` }} onClick={() => setMobileOpen(false)}>Join Waitlist</a>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero-section" className="relative flex flex-col overflow-hidden" style={{ minHeight: '100svh' }}>

        {/* ── DESKTOP: friends around campfire at night — landscape crop ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1209177/pexels-photo-1209177.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Group of friends around a campfire at night"
          loading="eager"
          decoding="async"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 42%' }}
        />

        {/* ── MOBILE: same scene — portrait crop, faces & fire centred ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1209177/pexels-photo-1209177.jpeg?auto=compress&cs=tinysrgb&w=750&h=1400&fit=crop"
          alt="Group of friends around a campfire at night"
          loading="eager"
          decoding="async"
          className="md:hidden absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 35%' }}
        />

        {/* ── Shared: warm fire-glow radial (both devices) ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 45%, rgba(255,110,10,0.18) 0%, rgba(180,50,0,0.08) 55%, transparent 80%)' }} />

        {/* ── Shared: cinematic vignette — dark edges pull focus to fire ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />

        {/* ── Desktop: text-readability gradient ── */}
        <div className="hidden md:block absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.68) 100%)' }} />

        {/* ── Mobile: stronger bottom gradient for CTA area ── */}
        <div className="md:hidden absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.06) 28%, rgba(0,0,0,0.75) 52%, rgba(0,0,0,0.97) 100%)' }} />

        {/* ── Mobile spacer — reserves top 44% for the photo/faces ── */}
        <div className="md:hidden shrink-0" style={{ height: '44vh' }} aria-hidden />

        {/* ── Content: floats to bottom on mobile, centered on desktop ── */}
        <div className="relative z-10 flex-1 flex items-end md:items-center">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full
            pb-10 md:pb-44 md:pt-28
            grid lg:grid-cols-2 gap-5 md:gap-10 items-center">

            <div>
              {/* 1. Launch badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 md:mb-6 text-xs font-semibold text-white"
                style={{ background: 'rgba(43,182,115,0.2)', border: '1px solid rgba(43,182,115,0.45)' }}>
                <Rocket className="w-3.5 h-3.5" style={{ color: B.green }} />
                Launching first in Pune
              </div>

              {/* 2. Headline */}
              <h1 className="font-extrabold text-white leading-[1.05] mb-2 md:mb-4"
                style={{ fontSize: 'clamp(2.1rem, 9vw, 5rem)', letterSpacing: '-0.03em' }}>
                Never Travel Alone.
              </h1>

              {/* 3. Subheadline */}
              <p className="text-sm sm:text-base md:text-xl mb-4 md:mb-8 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 480 }}>
                Find verified travel companions, join safe group trips, and plan your journey with AI.
              </p>

              {/* 4. Trust badges — 2×2 grid on mobile, flex row on sm+ */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4 md:mb-8">
                {[
                  { icon: BadgeCheck, label: 'ID Verified' },
                  { icon: Users,      label: 'Group-First' },
                  { icon: Heart,      label: 'Women-Only'  },
                  { icon: Sparkles,   label: 'AI Planning' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label}
                    className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 md:py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: B.green }} />
                    {label}
                  </div>
                ))}
              </div>

              {/* 5+6. CTAs — full-width stacked on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#waitlist" onClick={() => track('cta_click', 'hero_join_waitlist')}
                  className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: '0 8px 28px rgba(15,76,129,0.5)' }}>
                  Join the Waitlist <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#how-it-works" onClick={() => track('cta_click', 'hero_how_it_works')}
                  className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all hover:bg-white/20 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  See How It Works
                </a>
              </div>
            </div>

            {/* Phone mockup — large desktop only */}
            <div className="hidden lg:flex items-center justify-center">
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Bottom stats bar — desktop only ── */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 py-4 border-t"
          style={{ background: 'rgba(5,13,26,0.75)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-6xl mx-auto px-5 flex flex-row items-center justify-around gap-2">
            {[
              { icon: MapPin, label: 'Launching in Pune',      color: B.orng  },
              { icon: Users,  label: 'Join early access',       color: B.green },
              { icon: Shield, label: 'Verified-only platform',  color: B.blue  },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-sm font-medium text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="py-3 overflow-hidden" style={{ background: B.blue }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {Array(2).fill(['Goa Beach Vibes', 'Manali Snow Trek', 'Lonavala Monsoon', 'Kerala Backwaters', 'Ladakh Ride', 'Rishikesh Rafting', 'Mahabaleshwar Hills', 'Coorg Coffee', 'Andaman Escape', 'Pune Weekend Trips']).flat().map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 px-8">
              <MapPin className="w-3.5 h-3.5" style={{ color: B.orng }} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS — 5 steps ── */}
      <section id="how-it-works" className="relative py-16 md:py-24 px-5 sm:px-8 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,13,26,0.80)' }} />
        <div ref={s1.ref} className="relative max-w-6xl mx-auto">
          <div style={reveal(s1.v)} className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.green }}>Simple Process</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>How JoinUp Works</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
              {[
                { step: '01', icon: UserCheck, title: 'Create Profile', body: 'Sign up and build your travel profile in minutes.', color: B.blue },
                { step: '02', icon: ScanFace, title: 'Verify Identity', body: 'Submit your government ID and a live selfie.', color: B.green },
                { step: '03', icon: MapPin, title: 'Discover Trips', body: 'Browse group trips from your city by destination.', color: B.orng },
                { step: '04', icon: Users, title: 'Join a Group', body: 'Request to join a trusted verified group trip.', color: '#8B5CF6' },
                { step: '05', icon: Star, title: 'Travel & Rate', body: 'Travel safely and rate your experience after.', color: '#FBBF24' },
              ].map(({ step, icon: Icon, title, body, color }, i) => (
                <div key={step} style={reveal(s1.v, i * 0.1)} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center">
                  <div className="flex flex-col items-center md:hidden shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}25`, border: `2px solid ${color}50` }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    {i < 4 && <div className="w-px h-8 mt-2" style={{ background: 'rgba(255,255,255,0.15)' }} />}
                  </div>
                  <div className="hidden md:flex w-20 h-20 rounded-3xl items-center justify-center mx-auto mb-5 relative" style={{ background: `${color}25`, border: `2px solid ${color}50` }}>
                    <Icon className="w-9 h-9" style={{ color }} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold" style={{ background: color, fontSize: 10 }}>{step}</span>
                  </div>
                  <div>
                    <div className="md:hidden flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>{step}</span>
                    </div>
                    <h3 className="font-bold text-white text-base md:text-lg mb-1 md:mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={reveal(s1.v, 0.6)} className="text-center mt-12">
            <a href="#waitlist" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})`, boxShadow: `0 8px 24px ${B.blue}50` }}>
              Get Early Access <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s2.ref} className="max-w-6xl mx-auto">
          <div style={reveal(s2.v)} className="text-center mb-10 md:mb-14">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.orng }}>Built Different</p>
            <h2 className="font-extrabold text-white text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Everything you need to travel safely
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[
              { icon: Shield, title: 'ID Verification', body: 'Every traveller is verified with a government-issued ID before joining any trip.', color: B.blue, delay: 0 },
              { icon: TrendingUp, title: 'Trust Score', body: 'A dynamic score built from trip history, ratings, and profile completeness.', color: B.green, delay: 0.05 },
              { icon: Bot, title: 'AI Planner', body: 'Get a full trip itinerary, budget breakdown, and hotel picks in 30 seconds.', color: '#8B5CF6', delay: 0.1 },
              { icon: MessageCircle, title: 'Group Chat', body: 'Chat with your travel group before and during the trip in a safe space.', color: B.orng, delay: 0.15 },
              { icon: CreditCard, title: 'Split Expenses', body: 'Track shared costs and split bills fairly with all your travel companions.', color: '#EC4899', delay: 0.2 },
              { icon: Star, title: 'Reviews', body: 'Rate every traveller after the trip to keep the community trustworthy.', color: '#FBBF24', delay: 0.25 },
              { icon: Heart, title: 'Women-Only', body: 'Dedicated trips for women with extra verification and 24/7 support.', color: '#F43F5E', delay: 0.3 },
              { icon: AlertTriangle, title: 'Emergency SOS', body: 'One-tap SOS sends your live location to emergency contacts instantly.', color: '#EF4444', delay: 0.35 },
            ].map(({ icon: Icon, title, body, color, delay }) => (
              <div key={title} style={{ ...reveal(s2.v, delay), borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}
                className="group hover:border-white/20 transition-all duration-300 p-4 sm:p-5">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: `${color}18` }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-1.5">{title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST & SAFETY ── */}
      <section id="trust-safety" className="relative py-16 md:py-24 px-5 sm:px-8 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,13,26,0.83)' }} />
        <div ref={s3.ref} className="relative max-w-6xl mx-auto">
          <div style={reveal(s3.v)} className="text-center mb-10 md:mb-14">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6B6B' }}>Safety First</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Every trip. Every traveller. Protected.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { icon: Phone, title: 'Mobile OTP', body: 'Phone number verified via OTP before access.', color: B.blue },
              { icon: ScanFace, title: 'Selfie Verify', body: 'Live selfie matched to your government ID.', color: B.green },
              { icon: BadgeCheck, title: 'Govt ID Check', body: 'Aadhaar, PAN or Passport verified manually.', color: B.orng },
              { icon: TrendingUp, title: 'Trust Score', body: 'Dynamic score based on trips and reviews.', color: '#FBBF24' },
              { icon: Star, title: 'Ratings', body: 'Rate every member after every trip.', color: '#8B5CF6' },
              { icon: AlertTriangle, title: 'SOS Button', body: 'One-tap emergency alert with live GPS.', color: '#EF4444' },
              { icon: LocateFixed, title: 'Live Location', body: 'Share location with trusted contacts.', color: '#EC4899' },
              { icon: Flag, title: 'Report & Block', body: 'Report concerns. Blocks take effect instantly.', color: '#F43F5E' },
            ].map(({ icon: Icon, title, body, color }, i) => (
              <div key={title} style={{ ...reveal(s3.v, i * 0.06), background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18 }}
                className="p-3 sm:p-5 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}25` }}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-1 text-xs sm:text-sm">{title}</h3>
                <p className="text-xs leading-relaxed mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{body}</p>
              </div>
            ))}
          </div>
          <div style={{ ...reveal(s3.v, 0.5), background: `${B.green}15`, border: `1px solid ${B.green}35`, borderRadius: 20 }}
            className="p-5 sm:p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: B.green }} />
            <p className="font-bold text-white text-base sm:text-lg mb-2">Our Group-First Policy</p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              New users can only join <strong className="text-white">group trips</strong>. One-to-one trips unlock only after successful group travel experiences and a verified trust score.
            </p>
          </div>
        </div>
      </section>

      {/* ── PUNE TRIPS ── */}
      <section id="city-trips" style={{ background: '#F8FAFC' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s4.ref} className="max-w-6xl mx-auto">
          <div style={reveal(s4.v)} className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: `${B.orng}15`, border: `1px solid ${B.orng}40`, color: B.orng }}>
              <MapPin className="w-3.5 h-3.5" /> Launching first in Pune
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ color: B.dark, letterSpacing: '-0.02em' }}>
              Sample trips from Pune
            </h2>
            <p className="text-base sm:text-lg mt-3" style={{ color: '#6B7280' }}>These are the kinds of verified group trips you'll find on JoinUp.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {PUNE_TRIPS.map(({ from, to, duration, budget, type, img, color }, i) => (
              <div key={to} style={{ ...reveal(s4.v, i * 0.1), border: '1px solid #f0f2f5' }}
                className="rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://images.unsplash.com/${img}?w=600&q=80`} alt={to}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />
                  <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: color }}>{type}</span>
                  <div className="absolute bottom-3 left-3">
                    <p className="font-bold text-white text-lg">{from} → {to}</p>
                    <p className="text-white/70 text-sm">{duration}</p>
                  </div>
                </div>
                <div className="p-4 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                      <Users className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Verified group</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color }}>{budget}</p>
                    <p className="text-xs text-gray-400">per person</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={reveal(s4.v, 0.4)} className="text-center mt-8">
            <p className="text-sm text-gray-400">More destinations unlocking after launch. <a href="#waitlist" className="font-semibold underline" style={{ color: B.blue }}>Join the waitlist</a> to be first.</p>
          </div>
        </div>
      </section>

      {/* ── AI PLANNER ── */}
      <section id="ai-planner" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s5.ref} className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div style={reveal(s5.v)}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: B.green }}>AI-Powered</p>
              <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
                Your personal travel brain
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Tell us your destination, budget, and travel style. Get a full itinerary in under 30 seconds.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Bot, label: 'Day-by-day itinerary' },
                  { icon: Globe, label: 'Hotel & restaurant picks' },
                  { icon: Wallet, label: 'Full budget breakdown' },
                  { icon: Camera, label: 'Local insider tips' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${B.green}20` }}>
                      <Icon className="w-4 h-4" style={{ color: B.green }} />
                    </div>
                    <p className="font-semibold text-white text-sm">{label}</p>
                    <CheckCircle className="w-4 h-4 ml-auto shrink-0" style={{ color: B.green }} />
                  </div>
                ))}
              </div>
              <Link href="/ai-planner" className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${B.green}, #1DA05E)`, boxShadow: `0 8px 24px ${B.green}40` }}>
                Try AI Planner Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div style={reveal(s5.v, 0.2)} className="animate-float-slow">
              <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85" alt="Bikers on mountain road"
                  className="w-full object-cover" style={{ aspectRatio: '4/3', display: 'block' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,13,26,0.88) 100%)' }} />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${B.green}28`, border: `1px solid ${B.green}50`, backdropFilter: 'blur(8px)' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse block" style={{ background: B.green }} />
                    <span className="text-xs font-semibold text-white">AI-Planned Route</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="font-bold text-white mb-1">Pune → Ladakh Ride</p>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>AI Planned · 12 Days · ₹45,000/person</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ icon: MapPin, label: '8 Stops' }, { icon: Users, label: '6 Riders' }, { icon: Shield, label: 'Verified' }].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 py-2 px-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <Icon className="w-3 h-3 shrink-0" style={{ color: B.green }} />
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

      {/* ── WAITLIST FORM ── */}
      <section id="waitlist" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s6.ref} className="max-w-xl mx-auto">
          <div style={reveal(s6.v)} className="text-center mb-8">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: `${B.orng}20`, border: `1px solid ${B.orng}30` }}>
              <Navigation className="w-7 h-7" style={{ color: B.orng }} />
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
              Get early access.
            </h2>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Be among the first verified travellers when we launch in Pune.
            </p>
          </div>

          {joined ? (
            <div style={reveal(s6.v, 0.1)} className="space-y-5">
              {/* Success */}
              <div className="text-center p-6 rounded-3xl" style={{ background: `${B.green}15`, border: `1px solid ${B.green}40` }}>
                <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: B.green }} />
                <h3 className="font-bold text-white text-xl mb-2">You're on the list!</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>We'll notify <strong className="text-white">{form.email}</strong> before launch in Pune.</p>
              </div>

              {/* Referral */}
              <div className="p-5 rounded-3xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-5 h-5" style={{ color: B.orng }} />
                  <p className="font-bold text-white">Invite 3 friends → unlock Founding Member badge</p>
                </div>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Share your unique link and track your invites.</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span>Invites sent</span><span style={{ color: B.green }}>0 of 3</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: '0%', background: `linear-gradient(90deg, ${B.green}, #1DA05E)` }} />
                  </div>
                </div>

                {/* Referral link */}
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 px-3 py-2.5 rounded-xl text-xs truncate" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                    {referralLink}
                  </div>
                  <button onClick={copyReferral} className="px-3 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 flex items-center gap-1.5 shrink-0"
                    style={{ background: copied ? B.green : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* WhatsApp share */}
                <button onClick={whatsappShare}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                  style={{ background: '#25D366' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Share on WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleJoin} style={reveal(s6.v, 0.1)} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input type="text" placeholder="Full name *" value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                    className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                    style={{ background: errors.name ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.07)', border: `1px solid ${errors.name ? '#EF4444' : 'rgba(255,255,255,0.12)'}`, color: '#fff' }} />
                  {errors.name && <p className="text-xs mt-1 ml-1" style={{ color: '#EF4444' }}>{errors.name}</p>}
                </div>
                <div>
                  <input type="email" placeholder="Email address *" value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                    className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                    style={{ background: errors.email ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.07)', border: `1px solid ${errors.email ? '#EF4444' : 'rgba(255,255,255,0.12)'}`, color: '#fff' }} />
                  {errors.email && <p className="text-xs mt-1 ml-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Your city" value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
                <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })}
                  className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                  style={{ background: 'rgba(30,40,60,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: form.ageGroup ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  <option value="">Age group</option>
                  <option>18–22</option><option>23–27</option><option>28–35</option><option>35+</option>
                </select>
              </div>
              <input type="text" placeholder="Favourite destination (e.g. Goa, Manali)" value={form.destination}
                onChange={e => setForm({ ...form, destination: e.target.value })}
                className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm text-white/70 mb-3">Have you travelled solo before?</p>
                <div className="flex gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button key={opt} type="button" onClick={() => setForm({ ...form, soloTravelled: opt })}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
                      style={{ background: form.soloTravelled === opt ? B.blue : 'rgba(255,255,255,0.06)', border: `1px solid ${form.soloTravelled === opt ? B.blue : 'rgba(255,255,255,0.1)'}` }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: '0 8px 24px rgba(15,76,129,0.5)' }}>
                {submitting ? 'Joining...' : 'Join the Waitlist →'}
              </button>
              <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                We'll only use your information for early access updates. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: '#fff' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s7.ref} className="max-w-2xl mx-auto">
          <div style={reveal(s7.v)} className="text-center mb-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.blue }}>Questions</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl leading-tight" style={{ color: B.dark }}>Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} style={{ ...reveal(s7.v, i * 0.07), borderRadius: 16, border: '1px solid #f0f2f5' }} className="overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-gray-900 text-sm sm:text-base"
                  onClick={() => { setOpenFaq(openFaq === i ? null : i); track('faq_open', q); }}>
                  {q}
                  {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0 text-gray-400" /> : <ChevronDown className="w-5 h-5 shrink-0 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#020810', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="pt-12 pb-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})` }}>
                  <Navigation style={{ width: 15, height: 15, color: '#fff' }} />
                </div>
                <span className="font-bold text-white">JoinUp<span style={{ color: B.orng }}> Travel</span></span>
              </div>
              <p className="text-xs leading-relaxed mb-5 max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                A trusted platform for verified group travel, launching first in Pune.
              </p>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <a href="mailto:hello@joinuptravel.com" className="hover:text-white transition-colors">hello@joinuptravel.com</a>
              </p>
              <div className="flex gap-2">
                {[
                  { Icon: Instagram, href: '#', label: 'Instagram' },
                  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: [['Explore Trips', '#'], ['AI Planner', '/ai-planner'], ['Group Chat', '#'], ['Trust Score', '#'], ['SOS Safety', '#']] },
              { title: 'Company', links: [['About Us', '#'], ['Safety', '#trust-safety'], ['Contact Us', 'mailto:hello@joinuptravel.com'], ['Blog', '#'], ['Careers', '#']] },
              { title: 'Legal', links: [['Privacy Policy', '#'], ['Terms of Service', '#'], ['Cookie Policy', '#'], ['Refund Policy', '#']] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-white text-sm mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map(([l, h]) => (
                    <li key={l}><a href={h} className="text-xs sm:text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2026 JoinUp Travel. Made with ❤️ in Pune, India.</p>
            <p className="text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>JoinUp Travel — Never Travel Alone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
