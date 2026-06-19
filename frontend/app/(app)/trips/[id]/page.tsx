'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Calendar, Shield, CheckCircle, MessageCircle, ArrowLeft, Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { tripsApi, chatApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatTripDates, formatCurrencyINR, getTripTypeIcon, getErrorMessage, getTrustBadge } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsApi.getOne(id).then((r) => r.data),
  });

  const joinMutation = useMutation({
    mutationFn: () => tripsApi.join(id, joinMessage),
    onSuccess: () => {
      toast.success('Join request sent! The organizer will review your request.');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      setShowJoinModal(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const respondMutation = useMutation({
    mutationFn: ({ memberId, status }: { memberId: string; status: 'APPROVED' | 'REJECTED' }) =>
      tripsApi.respondRequest(id, memberId, status),
    onSuccess: (_, vars) => {
      toast.success(`Request ${vars.status.toLowerCase()}!`);
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleMessage = async () => {
    if (!trip) return;
    try {
      const res = await chatApi.getOrCreateDirect(trip.organizer.id);
      router.push(`/chat/${res.data.id}`);
    } catch {
      toast.error('Could not open chat');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!trip) return <div className="text-center py-16 text-gray-500">Trip not found</div>;

  const isOrganizer = user?.id === trip.organizer?.id;
  const daysLeft = trip.startDate ? Math.ceil((new Date(trip.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const trustBadge = getTrustBadge(trip.organizer?.trustScore || 0);

  const pendingMembers = (trip.members || []).filter((m: any) => m.status === 'PENDING');
  const approvedMembers = (trip.members || []).filter((m: any) => m.status === 'APPROVED');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/trips" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to trips
      </Link>

      {/* Cover */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
        {trip.coverImage ? (
          <Image src={trip.coverImage} alt={trip.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-blue-200 flex items-center justify-center">
            <span className="text-8xl">{getTripTypeIcon(trip.tripType)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={trip.status === 'OPEN' ? 'success' : 'default'}>{trip.status}</Badge>
                <span className="text-white/80 text-sm">{trip.tripType.replace('_', ' ')}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{trip.title}</h1>
              <div className="flex items-center gap-1 mt-1 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>{trip.destination} · from Pune</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrencyINR(trip.budget)}</p>
              <p className="text-white/70 text-sm">per person</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Calendar, label: 'Duration', value: formatTripDates(trip.startDate, trip.endDate) },
              { icon: Users, label: 'Members', value: `${trip.currentMembers}/${trip.maxMembers}` },
              { icon: MapPin, label: 'Meeting Point', value: trip.meetingPoint || 'Pune' },
              { icon: Calendar, label: 'Days Left', value: daysLeft > 0 ? `${daysLeft} days` : 'Started' },
            ].map((stat) => (
              <div key={stat.label} className="card p-3 text-center">
                <stat.icon className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3">About this trip</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{trip.description}</p>
            {trip.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {trip.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Members */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              Travel Group ({approvedMembers.length}/{trip.maxMembers})
            </h2>
            <div className="flex flex-wrap gap-3">
              {approvedMembers.map((member: any) => (
                <Link key={member.id} href={`/profile/${member.user.id}`} className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface transition-colors">
                  <Avatar src={member.user.avatar} firstName={member.user.firstName} lastName={member.user.lastName} size="sm" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">{member.user.firstName}</p>
                    {member.user.verificationStatus !== 'UNVERIFIED' && (
                      <p className="text-xs text-green-600 flex items-center gap-0.5"><CheckCircle className="w-2.5 h-2.5" /> Verified</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pending requests - only for organizer */}
            {isOrganizer && pendingMembers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Pending Requests ({pendingMembers.length})</h3>
                {pendingMembers.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <Link href={`/profile/${member.user.id}`} className="flex items-center gap-2">
                      <Avatar src={member.user.avatar} firstName={member.user.firstName} lastName={member.user.lastName} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.user.firstName} {member.user.lastName}</p>
                        {member.message && <p className="text-xs text-gray-400">"{member.message}"</p>}
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondMutation.mutate({ memberId: member.user.id, status: 'APPROVED' })}
                        className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => respondMutation.mutate({ memberId: member.user.id, status: 'REJECTED' })}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Organizer */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Organized by</h3>
            <Link href={`/profile/${trip.organizer?.id}`} className="flex items-center gap-3 mb-3">
              <Avatar src={trip.organizer?.avatar} firstName={trip.organizer?.firstName || ''} lastName={trip.organizer?.lastName || ''} size="md" />
              <div>
                <p className="font-semibold text-gray-900">{trip.organizer?.firstName} {trip.organizer?.lastName}</p>
                <p className="text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-500">{trip.organizer?.trustScore?.toFixed(0)} trust score</span>
                </p>
              </div>
            </Link>
            <span className={`badge ${trustBadge.color} text-xs`}>{trustBadge.label}</span>

            {!isOrganizer && (
              <Button variant="secondary" size="sm" className="w-full mt-3" onClick={handleMessage}>
                <MessageCircle className="w-4 h-4" /> Message
              </Button>
            )}
          </div>

          {/* CTA */}
          <div className="card p-5">
            {isOrganizer ? (
              <div className="space-y-2">
                <Link href={`/trips/${id}/edit`}>
                  <Button variant="secondary" size="md" className="w-full">Edit Trip</Button>
                </Link>
                <Link href={`/chat/${trip.conversation?.id}`}>
                  <Button variant="primary" size="md" className="w-full">
                    <MessageCircle className="w-4 h-4" /> Group Chat
                  </Button>
                </Link>
              </div>
            ) : trip.isJoined ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                  <CheckCircle className="w-5 h-5" /> You&apos;re in this trip!
                </div>
                <Link href={`/chat/${trip.conversation?.id}`}>
                  <Button variant="primary" size="md" className="w-full">
                    <MessageCircle className="w-4 h-4" /> Open Group Chat
                  </Button>
                </Link>
              </div>
            ) : trip.isPending ? (
              <div className="text-center">
                <div className="text-yellow-600 font-medium text-sm mb-1">Request Pending</div>
                <p className="text-xs text-gray-400">Waiting for organizer approval</p>
              </div>
            ) : trip.status === 'OPEN' ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-primary-600">{formatCurrencyINR(trip.budget)}</p>
                  <p className="text-sm text-gray-400">estimated per person</p>
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={() => setShowJoinModal(true)}>
                  Request to Join
                </Button>
                <div className="flex items-center gap-1.5 mt-3 justify-center text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Safe & verified members only
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                This trip is no longer accepting members
              </div>
            )}
          </div>

          {/* Safety badge */}
          <div className="card p-4 bg-green-50 border-green-100">
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-semibold">Safety Verified Trip</span>
            </div>
            <p className="text-xs text-green-600 mt-1">All members are identity verified and trust-scored.</p>
          </div>
        </div>
      </div>

      {/* Join modal */}
      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Request to Join">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Introduce yourself to <strong>{trip.organizer?.firstName}</strong>. Tell them why you want to join this trip.
          </p>
          <textarea
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
            placeholder="Hi! I'm interested in joining your Goa trip. I'm an experienced traveler from Pune..."
            className="input-field resize-none h-28 text-sm"
          />
          <Button
            variant="primary"
            size="md"
            className="w-full"
            loading={joinMutation.isPending}
            onClick={() => joinMutation.mutate()}
          >
            Send Join Request
          </Button>
        </div>
      </Modal>
    </div>
  );
}
