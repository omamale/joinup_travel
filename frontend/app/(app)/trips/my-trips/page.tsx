'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Compass, Users } from 'lucide-react';
import { tripsApi } from '@/lib/api';
import { TripCard } from '@/components/trips/TripCard';
import { TripCardSkeleton } from '@/components/ui/Skeleton';
import { useState } from 'react';

export default function MyTripsPage() {
  const [tab, setTab] = useState<'organized' | 'joined'>('organized');

  const { data, isLoading } = useQuery({
    queryKey: ['my-trips'],
    queryFn: () => tripsApi.getMyTrips().then((r) => r.data),
  });

  const trips = tab === 'organized' ? (data?.organized || []) : (data?.joined || []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <Link href="/trips/create" className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm">
          <Plus className="w-4 h-4" /> Create Trip
        </Link>
      </div>

      <div className="flex bg-surface p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('organized')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'organized' ? 'bg-white shadow-soft text-gray-900' : 'text-gray-500'}`}
        >
          <Compass className="w-4 h-4" /> Organized ({data?.organized?.length || 0})
        </button>
        <button
          onClick={() => setTab('joined')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'joined' ? 'bg-white shadow-soft text-gray-900' : 'text-gray-500'}`}
        >
          <Users className="w-4 h-4" /> Joined ({data?.joined?.length || 0})
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <TripCardSkeleton key={i} />)}
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => <TripCard key={trip.id} trip={trip} />)}
        </div>
      ) : (
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">{tab === 'organized' ? '🗺️' : '🤝'}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tab === 'organized' ? "You haven't created any trips yet" : "You haven't joined any trips yet"}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {tab === 'organized' ? 'Plan your first trip and find companions!' : 'Browse trips and join your travel group!'}
          </p>
          <Link href={tab === 'organized' ? '/trips/create' : '/trips'} className="btn-primary inline-flex items-center gap-2">
            {tab === 'organized' ? <><Plus className="w-4 h-4" /> Create a Trip</> : <><Compass className="w-4 h-4" /> Browse Trips</>}
          </Link>
        </div>
      )}
    </div>
  );
}
