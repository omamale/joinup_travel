import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'JoinUp Travel - Never Travel Alone', template: '%s | JoinUp Travel' },
  description: 'Find verified travel companions, join safe group trips, and plan trips with AI. Starting from Pune, India.',
  keywords: ['travel companions', 'group travel', 'Pune travel', 'travel community', 'safe travel'],
  authors: [{ name: 'JoinUp Travel' }],
  creator: 'JoinUp Travel',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://joinuptravel.com',
    title: 'JoinUp Travel - Never Travel Alone',
    description: 'Find verified travel companions, join safe group trips, and plan trips with AI.',
    siteName: 'JoinUp Travel',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'JoinUp Travel' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JoinUp Travel - Never Travel Alone',
    description: 'Find verified travel companions and join safe group trips from Pune.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', fontFamily: 'var(--font-inter)' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
