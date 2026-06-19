'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface WikiCityPhotoProps {
  city: string;
  alt: string;
  className?: string;
}

export function WikiCityPhoto({ city, alt, className }: WikiCityPhotoProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const query = encodeURIComponent(city);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const thumb = data?.originalimage?.source || data?.thumbnail?.source;
        if (thumb) {
          // Upgrade to higher resolution
          setSrc(thumb.replace(/\/\d+px-/, '/1200px-'));
        } else {
          setFailed(true);
        }
      })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => { cancelled = true; };
  }, [city]);

  if (failed || (!src && !failed)) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-blue-500 to-indigo-600 flex items-center justify-center">
        {!src && !failed && (
          <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {failed && <MapPin className="w-10 h-10 text-white/40" />}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src!}
      alt={alt}
      className={`absolute inset-0 w-full h-full ${className ?? 'object-cover'}`}
      onError={() => setFailed(true)}
    />
  );
}
