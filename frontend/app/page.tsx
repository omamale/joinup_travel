'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield, Users, Star, MapPin, Zap, MessageCircle,
  CreditCard, Heart, AlertTriangle, ArrowRight, Menu, X,
  Bot, Clock, Wallet, Lock, Phone, CheckCircle, Globe,
  Sparkles, Camera, Navigation, Bell, TrendingUp, Search,
  Twitter, Instagram, Youtube, Facebook, Linkedin,
  ChevronDown, ChevronUp, UserCheck, ThumbsUp, ScanFace,
  LocateFixed, Flag, BadgeCheck,
} from 'lucide-react';

const B = {
  blue:  '#0F4C81',
  blueL: '#1A6BAB',
  green: '#2BB673',
  orng:  '#FF8A3D',
  dark:  '#050D1A',
  darkC: '#0A1A2E',
} as const;

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

const PUNE_TRIPS = [
  { from: 'Pune', to: 'Goa', duration: '3 nights', budget: '₹5,500', type: 'Beach', img: 'photo-1512343879784-a960bf40e7f2', color: B.blue },
  { from: 'Pune', to: 'Lonavala', duration: '1 night', budget: '₹2,200', type: 'Hills', img: 'photo-1548013146-72479768bada', color: B.green },
  { from: 'Pune', to: 'Mahabaleshwar', duration: '2 nights', budget: '₹3,800', type: 'Nature', img: 'photo-1591951425328-48c78ec28a97', color: B.orng },
];

const FAQS = [
  { q: 'How do you verify users?', a: 'Every member submits a government-issued ID (Aadhaar, PAN, or Passport) along with a live selfie match. Our team manually reviews each submission before approving access.' },
  { q: 'Are women-only trips available?', a: 'Yes. JoinUp has dedicated Women-Only trips with extra verification layers, a moderated community, and 24/7 support. Safety is our top priority for solo women travellers.' },
  { q: 'Is JoinUp Travel free?', a: 'Creating a profile and joining the waitlist is completely free. We plan to offer a freemium model — basic features free, premium features (AI planner, priority matching) for a small subscription.' },
  { q: 'How are payments handled?', a: 'All trip payments go through our escrow system. Money is held securely and released only after trip confirmation. You get a full refund if the trip is cancelled.' },
  { q: 'What happens if someone doesn\'t show up?', a: 'We have a strict no-show policy. Members who cancel last-minute or don\'t show up receive a trust penalty. Repeat offenders are removed from the platform.' },
];

export default function LandingPage() {
  const [navDark, setNavDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', city: '', ageGroup: '', destination: '', soloTravelled: '' });

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

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) setJoined(true);
  };

  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView();
  const s7 = useInView(); const s8 = useInView(); const s9 = useInView();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#fff' }}>

      {/* NAVBAR */}
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
              <span className="font-bold text-base transition-colors" style={{ color: navDark ? '#fff' : B.dark }}>
                JoinUp<span style={{ color: B.orng }}> Travel</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {[['How It Works', '#how-it-works'], ['Safety', '#trust-safety'], ['Trips', '#city-trips'], ['FAQ', '#faq']].map(([l, h]) => (
                <a key={l} href={h} className="text-sm font-medium transition-colors"
                  style={{ color: navDark ? 'rgba(255,255,255,0.75)' : '#4B5563' }}>{l}</a>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login" className="text-sm font-medium px-4 py-2 rounded-xl"
                style={{ color: navDark ? 'rgba(255,255,255,0.8)' : B.blue }}>Sign In</Link>
              <a href="#waitlist" className="text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)` }}>Join Waitlist</a>
            </div>
            <button className="md:hidden p-2 rounded-xl" style={{ color: navDark ? '#fff' : B.dark }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileOpen && (
            <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3" style={{ borderColor: navDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }}>
              {[['How It Works', '#how-it-works'], ['Safety', '#trust-safety'], ['Trips', '#city-trips'], ['FAQ', '#faq']].map(([l, h]) => (
                <a key={l} href={h} className="font-medium py-2" style={{ color: navDark ? 'rgba(255,255,255,0.8)' : '#374151' }}
                  onClick={() => setMobileOpen(false)}>{l}</a>
              ))}
              <hr style={{ borderColor: navDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }} />
              <Link href="/auth/login" className="font-medium py-2" style={{ color: navDark ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>Sign In</Link>
              <a href="#waitlist" className="text-center font-semibold py-3 rounded-xl text-white"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)` }}>Join Waitlist</a>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero-section" className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
        <video autoPlay muted loop playsInline
          poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
          className="absolute inset-0 w-full h-full object-cover">
          <source src="https://videos.pexels.com/video-files/6774799/6774799-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,13,26,0.7) 0%, rgba(5,13,26,0.6) 50%, rgba(5,13,26,0.85) 100%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 w-full pt-28 pb-40 sm:pb-44">
          {/* Launch badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold text-white"
            style={{ background: 'rgba(43,182,115,0.2)', border: '1px solid rgba(43,182,115,0.45)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: B.green }} />
            Launching soon in Pune — Join early access
          </div>

          <h1 className="font-extrabold text-white leading-[1.06] mb-4"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 5.5rem)', letterSpacing: '-0.03em' }}>
            Never Travel Alone.
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 520 }}>
            Find verified travel companions, join safe group trips, and plan your journey with AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start mb-10">
            <a href="#waitlist"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: '0 8px 28px rgba(15,76,129,0.5)' }}>
              Join the Waitlist <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#how-it-works"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white text-base transition-all hover:bg-white/20 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>
              See How It Works
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { icon: BadgeCheck, label: 'ID Verified' },
              { icon: Users, label: 'Group-First Travel' },
              { icon: Heart, label: 'Women-Only Trips' },
              { icon: Sparkles, label: 'AI Trip Planning' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: B.green }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 py-4 border-t" style={{ background: 'rgba(5,13,26,0.75)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="flex flex-row items-center justify-around gap-2">
              {[
                { icon: MapPin, label: 'Launching in Pune', color: B.orng },
                { icon: Users, label: 'Join early access', color: B.green },
                { icon: Shield, label: 'Verified-only platform', color: B.blue },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white/80 hidden xs:block">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="py-3 overflow-hidden" style={{ background: B.blue }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {Array(2).fill(['Goa Beach Vibes', 'Manali Snow Trek', 'Lonavala Monsoon', 'Kerala Backwaters', 'Ladakh Ride', 'Rishikesh Rafting', 'Mahabaleshwar Hills', 'Coorg Coffee Trails', 'Andaman Escape', 'Pune Weekend Trips']).flat().map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 px-8">
              <MapPin className="w-3.5 h-3.5" style={{ color: B.orng }} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS — 5 steps */}
      <section id="how-it-works" className="relative py-16 md:py-24 px-5 sm:px-8 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,13,26,0.78)' }} />
        <div ref={s1.ref} className="relative max-w-6xl mx-auto">
          <div style={reveal(s1.v)} className="text-center mb-12 md:mb-16">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.green }}>Simple Process</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              How JoinUp Works
            </h2>
          </div>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
              {[
                { step: '01', icon: UserCheck, title: 'Create Profile', body: 'Sign up and build your travel profile in minutes.', color: B.blue },
                { step: '02', icon: ScanFace, title: 'Verify Identity', body: 'Submit your government ID and a live selfie match.', color: B.green },
                { step: '03', icon: MapPin, title: 'Discover Trips', body: 'Browse group trips from your city by destination.', color: B.orng },
                { step: '04', icon: Users, title: 'Join a Group', body: 'Request to join a trusted verified group trip.', color: '#8B5CF6' },
                { step: '05', icon: Star, title: 'Travel & Rate', body: 'Travel safely and rate your experience after.', color: '#FBBF24' },
              ].map(({ step, icon: Icon, title, body, color }, i) => (
                <div key={step} style={reveal(s1.v, i * 0.1)}
                  className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center">
                  {/* Mobile connector */}
                  <div className="flex flex-col items-center md:hidden shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${color}25`, border: `2px solid ${color}50` }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    {i < 4 && <div className="w-0.5 h-8 mt-2" style={{ background: 'rgba(255,255,255,0.15)' }} />}
                  </div>
                  {/* Desktop icon */}
                  <div className="hidden md:flex w-20 h-20 rounded-3xl items-center justify-center mx-auto mb-5 relative"
                    style={{ background: `${color}25`, border: `2px solid ${color}50` }}>
                    <Icon className="w-9 h-9" style={{ color }} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: color, fontSize: 10 }}>{step}</span>
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
            <a href="#waitlist"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${B.blue}, ${B.blueL})`, boxShadow: `0 8px 24px ${B.blue}50` }}>
              Get Early Access <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
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
              { icon: Shield, title: 'ID Verification', body: 'Govt ID + live selfie for every member.', color: B.blue, delay: 0 },
              { icon: TrendingUp, title: 'Trust Score', body: 'Earn points through verified trips and reviews.', color: B.green, delay: 0.05 },
              { icon: Bot, title: 'AI Planner', body: 'Full itinerary in 30 seconds with budget breakdown.', color: '#8B5CF6', delay: 0.1 },
              { icon: MessageCircle, title: 'Group Chat', body: 'Real-time encrypted chat for your trip group.', color: B.orng, delay: 0.15 },
              { icon: CreditCard, title: 'Split Expenses', body: 'Track shared costs and settle in one tap.', color: '#EC4899', delay: 0.2 },
              { icon: Star, title: 'Reviews', body: 'Rate companions after every trip.', color: '#FBBF24', delay: 0.25 },
              { icon: Heart, title: 'Women-Only', body: 'Dedicated verified women-only trip groups.', color: '#F43F5E', delay: 0.3 },
              { icon: AlertTriangle, title: 'Emergency SOS', body: 'One tap sends location to contacts instantly.', color: '#EF4444', delay: 0.35 },
            ].map(({ icon: Icon, title, body, color, delay }) => (
              <div key={title} style={{ ...reveal(s2.v, delay), borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}
                className="group hover:border-white/20 transition-all duration-300 p-3 sm:p-5">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: `${color}18` }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-1 text-xs sm:text-base leading-tight">{title}</h3>
                <p className="text-xs leading-relaxed hidden sm:block" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & SAFETY */}
      <section id="trust-safety" className="relative py-16 md:py-24 px-5 sm:px-8 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,13,26,0.82)' }} />
        <div ref={s3.ref} className="relative max-w-6xl mx-auto">
          <div style={reveal(s3.v)} className="text-center mb-10 md:mb-14">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6B6B' }}>Safety First</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Every trip. Every traveller.<br />Protected.
            </h2>
            <p className="text-base sm:text-lg mt-4 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Safety is not a feature on JoinUp — it is the foundation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { icon: ScanFace, title: 'Selfie Verification', body: 'Live selfie matched to government ID by our team.', color: B.blue },
              { icon: BadgeCheck, title: 'Govt ID Check', body: 'Aadhaar, PAN or Passport verified before access.', color: B.green },
              { icon: TrendingUp, title: 'Trust Score', body: 'Dynamic score based on trips, reviews and behaviour.', color: B.orng },
              { icon: Star, title: 'Ratings & Reviews', body: 'Rate every member after every trip, publicly visible.', color: '#FBBF24' },
              { icon: Phone, title: 'Emergency SOS', body: 'One-tap SOS sends live GPS to emergency contacts.', color: '#EF4444' },
              { icon: LocateFixed, title: 'Live Location', body: 'Share live location with trusted contacts during trips.', color: '#8B5CF6' },
              { icon: Flag, title: 'Report & Block', body: 'Report concerns instantly. Blocks take effect immediately.', color: '#EC4899' },
              { icon: Bell, title: '24/7 Moderation', body: 'Human moderators respond to safety concerns in minutes.', color: B.blueL },
            ].map(({ icon: Icon, title, body, color }, i) => (
              <div key={title} style={{ ...reveal(s3.v, i * 0.06), background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18 }}
                className="p-3 sm:p-5 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: `${color}25` }}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-1 text-xs sm:text-sm">{title}</h3>
                <p className="text-xs leading-relaxed hidden sm:block" style={{ color: 'rgba(255,255,255,0.55)' }}>{body}</p>
              </div>
            ))}
          </div>

          {/* Group-first policy */}
          <div style={{ ...reveal(s3.v, 0.5), background: `${B.green}15`, border: `1px solid ${B.green}35` }} className="rounded-2xl p-5 sm:p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: B.green }} />
            <p className="font-bold text-white text-base sm:text-lg mb-2">Our Group-First Policy</p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              New users can only join <strong className="text-white">group trips</strong>. One-to-one trips unlock only after successful group travel experiences and a verified trust score.
            </p>
          </div>
        </div>
      </section>

      {/* CITY TRIPS — Pune specific */}
      <section id="city-trips" style={{ background: '#F8FAFC' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s4.ref} className="max-w-6xl mx-auto">
          <div style={reveal(s4.v)} className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: `${B.orng}15`, border: `1px solid ${B.orng}40`, color: B.orng }}>
              <MapPin className="w-3.5 h-3.5" /> Launching in Pune first
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ color: B.dark, letterSpacing: '-0.02em' }}>
              Sample trips from Pune
            </h2>
            <p className="text-base sm:text-lg mt-3" style={{ color: '#6B7280' }}>These are the kinds of trips you'll find on JoinUp.</p>
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
                    <span className="text-xs text-gray-500 font-medium">Group trip</span>
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
            <p className="text-sm text-gray-400">More destinations unlocking after launch. <a href="#waitlist" className="font-semibold underline" style={{ color: B.blue }}>Join the waitlist</a> to be notified.</p>
          </div>
        </div>
      </section>

      {/* AI PLANNER */}
      <section id="ai-planner" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s5.ref} className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div style={reveal(s5.v)}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: B.green }}>AI-Powered</p>
              <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
                Your personal travel brain
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Tell us your destination, budget, and travel style. Get a full itinerary — hotels, restaurants, activities — in under 30 seconds.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Bot, label: 'Day-by-day itinerary', sub: 'Personalised for your travel style' },
                  { icon: Globe, label: 'Hotel & restaurant picks', sub: 'Budget-matched recommendations' },
                  { icon: Wallet, label: 'Full budget breakdown', sub: 'Transport, food, activities, stays' },
                  { icon: Camera, label: 'Local insider tips', sub: 'Hidden gems beyond the tourist trail' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${B.green}20` }}>
                      <Icon className="w-4 h-4" style={{ color: B.green }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{label}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{sub}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 ml-auto shrink-0" style={{ color: B.green }} />
                  </div>
                ))}
              </div>
              <Link href="/ai-planner"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${B.green}, #1DA05E)`, boxShadow: `0 8px 24px ${B.green}40` }}>
                Try AI Planner Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div style={reveal(s5.v, 0.2)} className="animate-float-slow">
              <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"
                  alt="Bikers on mountain road" className="w-full object-cover" style={{ aspectRatio: '4/3', display: 'block' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,13,26,0.85) 100%)' }} />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${B.green}28`, border: `1px solid ${B.green}50`, backdropFilter: 'blur(8px)' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: B.green, display: 'block' }} />
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

      {/* FOUNDING COMMUNITY */}
      <section style={{ background: '#F8FAFC' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s6.ref} className="max-w-4xl mx-auto text-center">
          <div style={reveal(s6.v)}>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.blue }}>Community</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight" style={{ color: B.dark }}>
              Join the founding community of travellers.
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#6B7280', maxWidth: 520, margin: '0 auto 2.5rem' }}>
              Be among the first verified travellers in Pune. Help shape how safe group travel works in India.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: MapPin, title: 'Launching in Pune', body: 'First city on the platform. Be a founding member.', color: B.orng },
                { icon: Users, title: 'Early Access', body: 'Get priority access before the public launch.', color: B.blue },
                { icon: BadgeCheck, title: 'Founding Badge', body: 'Exclusive badge and perks for early community members.', color: B.green },
              ].map(({ icon: Icon, title, body, color }) => (
                <div key={title} className="p-5 rounded-2xl text-center" style={{ background: '#fff', border: '1px solid #f0f2f5' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${color}12` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{body}</p>
                </div>
              ))}
            </div>
            <a href="#waitlist"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: `0 8px 24px ${B.blue}40` }}>
              Become a Founding Member <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* WAITLIST FORM */}
      <section id="waitlist" style={{ background: B.dark }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s7.ref} className="max-w-xl mx-auto">
          <div style={reveal(s7.v)} className="text-center mb-8">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: `${B.orng}20`, border: `1px solid ${B.orng}30` }}>
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
            <div style={{ ...reveal(s7.v, 0.1), background: `${B.green}15`, border: `1px solid ${B.green}40`, borderRadius: 20, padding: '2rem' }} className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: B.green }} />
              <h3 className="font-bold text-white text-xl mb-2">You're on the list!</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>We'll email <strong className="text-white">{form.email}</strong> when we launch in Pune.</p>
            </div>
          ) : (
            <form onSubmit={handleJoin} style={reveal(s7.v, 0.1)} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required type="text" placeholder="Your name *" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
                <input required type="email" placeholder="Email address *" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-3.5 rounded-2xl text-sm outline-none w-full"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
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
                  <option value="18-22">18–22</option>
                  <option value="23-27">23–27</option>
                  <option value="28-35">28–35</option>
                  <option value="35+">35+</option>
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
                    <button key={opt} type="button"
                      onClick={() => setForm({ ...form, soloTravelled: opt })}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: form.soloTravelled === opt ? B.blue : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${form.soloTravelled === opt ? B.blue : 'rgba(255,255,255,0.1)'}`,
                        color: '#fff',
                      }}>{opt}</button>
                  ))}
                </div>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${B.blue}, #1E40AF)`, boxShadow: '0 8px 24px rgba(15,76,129,0.5)' }}>
                Join the Waitlist →
              </button>
              <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                We'll only use your information for early access updates. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: '#fff' }} className="py-16 md:py-24 px-5 sm:px-8">
        <div ref={s8.ref} className="max-w-2xl mx-auto">
          <div style={reveal(s8.v)} className="text-center mb-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: B.blue }}>Questions</p>
            <h2 className="font-extrabold text-3xl sm:text-4xl leading-tight" style={{ color: B.dark }}>Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} style={{ ...reveal(s8.v, i * 0.07), borderRadius: 16, border: '1px solid #f0f2f5' }}
                className="overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-gray-900 text-sm sm:text-base"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
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

      {/* FOOTER */}
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
                Never Travel Alone. India's verified travel companion platform launching in Pune.
              </p>
              <div className="flex gap-2">
                {[
                  { Icon: Instagram, href: '#' },
                  { Icon: Linkedin, href: '#' },
                  { Icon: Twitter, href: '#' },
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Explore Trips', 'AI Planner', 'Group Chat', 'Trust Score', 'SOS Safety'] },
              { title: 'Company', links: ['About Us', 'Safety', 'Contact Us', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-white text-sm mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map(l => (
                    <li key={l}><a href="#" className="text-xs sm:text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2026 JoinUp Travel. Made with ❤️ in Pune, India.</p>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>JoinUp Travel — Never Travel Alone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
