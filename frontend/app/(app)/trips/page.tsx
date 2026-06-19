'use client';

import { useQuery } from '@tanstack/react-query';
import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import { tripsApi } from '@/lib/api';
import { useTripStore } from '@/stores/tripStore';
import { TripCard } from '@/components/trips/TripCard';
import { TripFilters } from '@/components/trips/TripFilters';
import { TripCardSkeleton } from '@/components/ui/Skeleton';
import { Trip } from '@joinup/types';

export default function TripsPage() {
  const { filters } = useTripStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['trips', filters],
    queryFn: () => tripsApi.getAll(filters).then((r) => r.data),
  });

  const trips: Trip[] = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Discover Trips</h1>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 shrink-0" />
            {!isLoading && <span>{total} trips across India</span>}
          </div>
        </div>
        <Link href="/trips/create" className="btn-primary flex items-center gap-1.5 py-2 px-3 sm:py-2.5 sm:px-4 text-xs sm:text-sm shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">Create</span>
          <span className="hidden sm:inline"> Trip</span>
        </Link>
      </div>

      {/* Filters */}
      <TripFilters />

      {/* Error */}
      {error && (
        <div className="text-center py-12 card">
          <p className="text-error font-medium">Failed to load trips</p>
          <p className="text-sm text-gray-400 mt-1">Please try again</p>
        </div>
      )}

      {/* Trips grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => <TripCardSkeleton key={i} />)}
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 animate-fade-in">
          {trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
        </div>
      ) : (
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-6">Be the first to create a trip!</p>
          <Link href="/trips/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create a Trip
          </Link>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => useTripStore.getState().setFilters({ page })}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                filters.page === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
