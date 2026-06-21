'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Plus, MessageCircle, User, Sparkles, Shield, Map, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Browse Trips', href: '/trips', icon: Compass },
  { label: 'Create Trip', href: '/trips/create', icon: Plus },
  { label: 'My Trips', href: '/trips/my-trips', icon: Map },
  { label: 'Messages', href: '/chat', icon: MessageCircle },
  { label: 'AI Planner', href: '/ai-planner', icon: Sparkles },
  { label: 'Safety', href: '/safety', icon: Shield },
  { label: 'My Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 z-30 py-4"
      style={{ background: '#0D1827', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
      <nav className="flex-1 px-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Navigation</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/trips' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5',
                  )}
                  style={isActive ? { background: 'rgba(37,99,235,0.15)' } : {}}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-primary-400' : 'text-slate-500')} />
                  {label}
                  {label === 'Create Trip' && (
                    <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom card */}
      <div className="mx-3 p-4 rounded-2xl" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-semibold text-white">Get Verified</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">Boost your trust score and get more join requests approved.</p>
        <Link href="/profile" className="block text-center bg-primary-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-primary-700 transition-colors">
          Verify Now
        </Link>
      </div>
    </aside>
  );
}
