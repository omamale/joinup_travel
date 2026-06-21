'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Trip } from '@joinup/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatTripDates, formatCurrencyINR, getTripTypeIcon, getBudgetEmoji } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
}

const STATUS_CONFIG = {
  OPEN: { label: 'Open', variant: 'success' as const },
  FULL: { label: 'Full', variant: 'warning' as const },
  ONGOING: { label: 'Ongoing', variant: 'primary' as const },
  COMPLETED: { label: 'Completed', variant: 'default' as const },
  CANCELLED: { label: 'Cancelled', variant: 'error' as const },
  DRAFT: { label: 'Draft', variant: 'default' as const },
};

export function TripCard({ trip }: TripCardProps) {
  const status = STATUS_CONFIG[trip.status] || STATUS_CONFIG.OPEN;
  const spotsLeft = trip.maxMembers - trip.currentMembers;
  const isAlmostFull = spotsLeft <= 2 && spotsLeft > 0;

  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="card group hover:-translate-y-1 transition-all duration-300 hover:shadow-float cursor-pointer">
        {/* Cover Image */}
        <div className="relative h-32 sm:h-48 overflow-hidden">
          {trip.coverImage ? (
            <Image
              src={trip.coverImage}
              alt={trip.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0D1E33 0%, #0A1628 100%)' }}>
              <span className="text-5xl">{getTripTypeIcon(trip.tripType)}</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge variant={status.variant}>{status.label}</Badge>
            {isAlmostFull && <Badge variant="warning">Almost Full</Badge>}
          </div>

          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="backdrop-blur-sm" style={{ background: 'rgba(13,24,39,0.7)' } as any}>
              {getTripTypeIcon(trip.tripType)} {trip.tripType.replace('_', ' ')}
            </Badge>
          </div>

          {trip.isJoined && (
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> Joined
              </span>
            </div>
          )}

          {trip.isPending && (
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" /> Pending
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-1 mb-1.5">
            <h3 className="font-semibold text-white text-xs sm:text-sm leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">
              {trip.title}
            </h3>
            <span className="text-xs font-bold text-slate-500 shrink-0">{getBudgetEmoji(trip.budgetRange)}</span>
          </div>

          <div className="flex items-center gap-1 text-xs mb-1">
            <MapPin className="w-3 h-3 text-primary-500 shrink-0" />
            <span className="text-primary-400 font-medium truncate">{trip.destination}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2 sm:mb-3">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">{formatTripDates(trip.startDate.toString(), trip.endDate.toString())}</span>
          </div>

          {trip.description && (
            <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mb-3">{trip.description}</p>
          )}

          <div className="flex items-center justify-between pt-2 sm:pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar
                src={trip.organizer?.avatar}
                firstName={trip.organizer?.firstName || ''}
                lastName={trip.organizer?.lastName || ''}
                size="xs"
              />
              <p className="text-xs font-medium text-slate-400 truncate hidden sm:block">{trip.organizer?.firstName}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs sm:text-sm font-bold text-primary-400">{formatCurrencyINR(trip.budget)}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500 justify-end">
                <Users className="w-3 h-3" />
                <span>{trip.currentMembers}/{trip.maxMembers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
