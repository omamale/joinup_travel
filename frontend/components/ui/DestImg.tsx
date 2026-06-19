'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface DestImgProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function DestImg({ src, alt, className, sizes, priority }: DestImgProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary-300 via-blue-400 to-primary-500 flex items-center justify-center">
        <MapPin className="w-10 h-10 text-white/40" />
      </div>
    );
  }

  // source.unsplash.com URLs are redirects — use unoptimized so the browser follows them
  const isDynamic = src.includes('source.unsplash.com');

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isDynamic}
      onError={() => setError(true)}
    />
  );
}
