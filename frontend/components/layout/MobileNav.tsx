'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Plus, MessageCircle, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Explore', href: '/trips', icon: Compass },
  { label: 'Chat', href: '/chat', icon: MessageCircle },
  { label: 'Create', href: '/trips/create', icon: Plus, primary: true },
  { label: 'AI Plan', href: '/ai-planner', icon: Sparkles },
  { label: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ background: 'rgba(13,24,39,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-around px-1" style={{ height: 60, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV_ITEMS.map(({ label, href, icon: Icon, primary }) => {
          const isActive = pathname === href || (href !== '/trips' && pathname.startsWith(href));

          if (primary) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-0.5 -mt-6">
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #0F4C81, #1E40AF)' }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium mt-1 text-primary-400">{label}</span>
              </Link>
            );
          }

          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all min-w-[56px]">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200')}
                style={isActive ? { background: 'rgba(37,99,235,0.15)' } : {}}>
                <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary-400' : 'text-slate-500')} />
              </div>
              <span className={cn('text-xs font-medium transition-colors', isActive ? 'text-primary-400' : 'text-slate-500')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
