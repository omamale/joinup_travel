'use client';

import Link from 'next/link';
import { MapPin, Bell, Search, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_DESTINATIONS } from '@/lib/destinations';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchVal, setSearchVal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const matchedDests = searchVal.length >= 1
    ? ALL_DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        d.tagline.toLowerCase().includes(searchVal.toLowerCase()),
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      router.push(`/trips?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setShowSearch(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-16">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Logo */}
        <Link href="/trips" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 hidden sm:block">
            JoinUp<span className="text-primary-600"> Travel</span>
          </span>
        </Link>

        {/* Search bar with destination autocomplete */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => { setSearchVal(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search destinations, trips..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface rounded-xl border border-transparent focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-all"
            />
            {showSearch && searchVal.trim().length > 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl shadow-float border border-gray-100 overflow-hidden z-50 animate-fade-in">
                {matchedDests.length > 0 && (
                  <>
                    <p className="text-xs text-gray-400 px-3 pt-2 pb-1 font-medium uppercase tracking-wider">Popular</p>
                    {matchedDests.map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => { router.push(`/destinations/${dest.name}`); setShowSearch(false); setSearchVal(''); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface text-left transition-colors"
                      >
                        <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{dest.name}</p>
                          <p className="text-xs text-gray-400">{dest.tagline}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
                <button
                  onClick={() => { router.push(`/destinations/${encodeURIComponent(searchVal.trim())}`); setShowSearch(false); setSearchVal(''); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-50 text-left transition-colors border-t border-gray-100"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-primary-700">Explore &ldquo;{searchVal.trim()}&rdquo;</p>
                </button>
                <button
                  onClick={() => { router.push(`/trips?search=${encodeURIComponent(searchVal)}`); setShowSearch(false); setSearchVal(''); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface text-left transition-colors border-t border-gray-100"
                >
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">Search trips for &ldquo;{searchVal}&rdquo;</p>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/chat" className="p-2 rounded-xl hover:bg-surface transition-colors text-gray-500 hover:text-gray-700 relative">
            <MessageCircle className="w-5 h-5" />
          </Link>
          <Link href="/notifications" className="p-2 rounded-xl hover:bg-surface transition-colors text-gray-500 hover:text-gray-700 relative">
            <Bell className="w-5 h-5" />
          </Link>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface transition-colors"
            >
              <Avatar
                src={user?.avatar}
                firstName={user?.firstName || ''}
                lastName={user?.lastName || ''}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.firstName}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-52 card shadow-float border border-gray-100 py-1 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                {[
                  { label: 'My Profile', href: '/profile' },
                  { label: 'My Trips', href: '/trips/my-trips' },
                  { label: 'AI Planner', href: '/ai-planner' },
                  { label: 'Safety', href: '/safety' },
                  { label: 'Settings', href: '/settings' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-surface transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
