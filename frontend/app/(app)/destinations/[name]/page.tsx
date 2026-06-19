'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, Calendar, Wallet, Star, Lightbulb, ChevronRight, Users, X, Clock3, Ticket } from 'lucide-react';
import { getDestination, DestPlace, WIKI_PHOTO_SENTINEL } from '@/lib/destinations';
import { tripsApi } from '@/lib/api';
import { DestImg } from '@/components/ui/DestImg';
import { WikiCityPhoto } from '@/components/ui/WikiCityPhoto';

export default function DestinationPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  const dest = getDestination(name);
  const [selectedPlace, setSelectedPlace] = useState<DestPlace | null>(null);

  const { data: tripsData } = useQuery({
    queryKey: ['trips', 'destination', name],
    queryFn: () => tripsApi.getAll({ destination: name, limit: 4 }).then((r) => r.data),
  });

  const trips: any[] = Array.isArray(tripsData?.data)
    ? tripsData.data
    : Array.isArray(tripsData?.trips)
      ? tripsData.trips
      : Array.isArray(tripsData)
        ? tripsData
        : [];

  return (
    <div className="space-y-8 -mx-4 sm:-mx-6 -mt-6">
      {/* Hero */}
      <div className="relative h-64 md:h-96">
        {dest.heroImage === WIKI_PHOTO_SENTINEL ? (
          <WikiCityPhoto city={dest.name} alt={dest.name} className="object-cover" />
        ) : (
          <DestImg src={dest.heroImage} alt={dest.name} className="object-cover" priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-1">{dest.tagline}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{dest.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Best: {dest.bestTime}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{dest.recommendedDays}</span>
            <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4" />{dest.budgetRange}</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-8">
        {/* Description + Quick stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card p-5">
            <h2 className="font-semibold text-gray-900 mb-3">About {dest.name}</h2>
            <p className="text-gray-600 leading-relaxed">{dest.description}</p>
          </div>
          <div className="space-y-3">
            <div className="card p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Best Time</p>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-500" />{dest.bestTime}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Budget Per Person</p>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-green-500" />{dest.budgetRange}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Recommended Stay</p>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />{dest.recommendedDays}
              </p>
            </div>
          </div>
        </div>

        {/* How to Reach */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">How to Reach</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {dest.travelOptions.map((opt) => (
              <div key={opt.mode} className="p-4 bg-surface rounded-xl">
                <p className="font-semibold text-gray-900 mb-1">{opt.mode}</p>
                <p className="text-xs text-gray-500 mb-2">{opt.info}</p>
                <p className="text-sm font-medium text-primary-600">{opt.cost}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Famous Places — click for full details */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Famous Places</h2>
          <p className="text-sm text-gray-400 mb-5">Tap any place to see full details</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dest.places.map((place) => (
              <button
                key={place.name}
                onClick={() => setSelectedPlace(place)}
                className="card group overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-float text-left w-full"
              >
                <div className="relative h-44 overflow-hidden">
                  <DestImg
                    src={place.image}
                    alt={place.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-white text-gray-700 shadow-soft">{place.category}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold">{place.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{place.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    <span>{place.timings}</span>
                    <span className="font-medium text-gray-700">{place.entryFee}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Where to Stay</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {dest.hotels.map((hotel) => (
              <div key={hotel.name} className="card p-4 flex gap-4">
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <DestImg src={hotel.image} alt={hotel.name} sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{hotel.name}</h3>
                    <div className="flex shrink-0">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{hotel.area}</p>
                  <p className="text-sm font-bold text-primary-600 mt-1">
                    ₹{hotel.pricePerNight.toLocaleString('en-IN')}/night
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="text-xs bg-surface text-gray-500 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active JoinUp trips */}
        {trips.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Active Trips to {dest.name}</h2>
              <Link
                href={`/trips?destination=${dest.name}`}
                className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {trips.slice(0, 4).map((trip: any) => (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <div className="card group hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    {trip.coverImage && (
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={trip.coverImage}
                          alt={trip.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="badge bg-green-500 text-white absolute bottom-3 left-3">Open</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{trip.title}</h3>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {trip._count?.members || 0}/{trip.maxMembers} joined
                        </span>
                        {trip.budget && (
                          <span className="font-medium text-primary-600">
                            ₹{trip.budget.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Travel Tips */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Travel Tips
          </h2>
          <ul className="space-y-3">
            {dest.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-yellow-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-xs font-bold">{i + 1}</span>
                </div>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Planner CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-6 text-center">
          <p className="text-white/80 text-sm mb-2">Powered by GPT-4</p>
          <h3 className="text-2xl font-bold text-white mb-2">Plan your {dest.name} trip with AI</h3>
          <p className="text-blue-100 text-sm mb-5">
            Full day-by-day itinerary, hotel picks, and packing list — generated in 30 seconds.
          </p>
          <Link
            href={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-float"
          >
            Plan with AI <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedPlace(null)} />
          <div className="relative bg-white rounded-2xl shadow-float max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              <DestImg
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-soft hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="badge bg-white text-gray-700 shadow">{selectedPlace.category}</span>
                <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold">{selectedPlace.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedPlace.name}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{selectedPlace.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Clock3 className="w-3.5 h-3.5" /> Timings
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedPlace.timings}</p>
                </div>
                <div className="p-3 bg-surface rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Ticket className="w-3.5 h-3.5" /> Entry Fee
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedPlace.entryFee}</p>
                </div>
              </div>

              <Link
                href={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}
                onClick={() => setSelectedPlace(null)}
                className="btn-primary w-full text-center text-sm py-3"
              >
                Plan a trip to {dest.name} with AI
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
