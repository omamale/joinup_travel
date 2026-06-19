import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">JoinUp<span className="text-primary-600"> Travel</span></span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="card p-8">
            {children}
          </div>
        </div>
      </div>

      <footer className="text-center p-4 text-sm text-gray-400">
        © 2024 JoinUp Travel · Made with ❤️ in Pune
      </footer>
    </div>
  );
}
