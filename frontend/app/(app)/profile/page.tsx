'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { CheckCircle, Star, Shield, Camera, Edit2, MapPin, Globe, Heart, Upload } from 'lucide-react';
import { usersApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { getTrustBadge, getErrorMessage } from '@/lib/utils';

const TRAVEL_INTERESTS = ['Beach', 'Mountains', 'Culture', 'Food', 'Adventure', 'Wildlife', 'Photography', 'Backpacking', 'Luxury', 'Pilgrimage'];
const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati'];

export default function ProfilePage() {
  const { user: authUser, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const [idUploading, setIdUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => usersApi.getMe().then((r) => r.data),
  });

  const { data: trustData } = useQuery({
    queryKey: ['trust-score'],
    queryFn: () => usersApi.getTrustScore().then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => usersApi.updateProfile(data),
    onSuccess: (res) => {
      setUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated!');
      setShowEdit(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdUploading(true);
    try {
      await uploadApi.idDocument(file);
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['trust-score'] });
      toast.success('ID document uploaded! Verification is pending review.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIdUploading(false);
      if (idFileRef.current) idFileRef.current.value = '';
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadApi.avatar(file);
      setUser({ ...authUser!, avatar: res.data.url });
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return null;

  const trustBadge = getTrustBadge(profile.trustScore);
  const verificationChecks = [
    { label: 'Email Verified', done: profile.emailVerified, key: 'emailVerified' },
    { label: 'Phone Verified', done: profile.phoneVerified, key: 'phoneVerified' },
    { label: 'ID Verified', done: profile.idVerified, key: 'idVerified' },
    { label: 'Selfie Verified', done: profile.selfieVerified, key: 'selfieVerified' },
  ];

  const openEdit = () => {
    setEditData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio || '',
      age: profile.age || '',
      gender: profile.gender || 'PREFER_NOT_TO_SAY',
      budgetPreference: profile.budgetPreference || 'MID_RANGE',
      travelInterests: profile.travelInterests || [],
      languagesSpoken: profile.languagesSpoken || [],
    });
    setShowEdit(true);
  };

  const toggleInterest = (interest: string) => {
    const current = editData.travelInterests || [];
    setEditData({
      ...editData,
      travelInterests: current.includes(interest)
        ? current.filter((i: string) => i !== interest)
        : [...current, interest],
    });
  };

  const toggleLanguage = (lang: string) => {
    const current = editData.languagesSpoken || [];
    setEditData({
      ...editData,
      languagesSpoken: current.includes(lang)
        ? current.filter((l: string) => l !== lang)
        : [...current, lang],
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            <Avatar src={profile.avatar} firstName={profile.firstName} lastName={profile.lastName} size="xl" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className={trustBadge.color}>{trustBadge.label}</Badge>
                  {profile.verificationStatus !== 'UNVERIFIED' && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                  {profile.age && <span>Age {profile.age}</span>}
                  {profile.gender && profile.gender !== 'PREFER_NOT_TO_SAY' && (
                    <span className="capitalize">{profile.gender.toLowerCase()}</span>
                  )}
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Pune</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={openEdit}>
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>

            {profile.bio && (
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{Math.round(profile.trustScore || 0)}</p>
                <p className="text-xs text-gray-400">Trust Score</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{profile.tripsOrganized?.length || 0}</p>
                <p className="text-xs text-gray-400">Trips Led</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{profile.tripMemberships?.length || 0}</p>
                <p className="text-xs text-gray-400">Trips Joined</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <p className="text-lg font-bold text-gray-900">
                    {profile.reviewsReceived?.length > 0
                      ? (profile.reviewsReceived.reduce((a: number, r: any) => a + r.rating, 0) / profile.reviewsReceived.length).toFixed(1)
                      : '—'}
                  </p>
                </div>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-500" /> Verification Status
          </h2>
          <span className="text-sm font-semibold text-primary-600">{Math.round(profile.trustScore || 0)}/100</span>
        </div>

        {/* Trust score bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
          <div
            className="bg-gradient-to-r from-primary-500 to-blue-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${profile.trustScore || 0}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {verificationChecks.map((check) => (
            <div key={check.key} className={`flex items-center gap-2 p-3 rounded-xl text-sm ${check.done ? 'bg-green-50' : 'bg-gray-50'}`}>
              <CheckCircle className={`w-4 h-4 shrink-0 ${check.done ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={check.done ? 'text-green-700 font-medium' : 'text-gray-400'}>{check.label}</span>
            </div>
          ))}
        </div>

        {!profile.idVerified && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
            Upload your government ID to unlock full verification and increase your trust score significantly.
            <input ref={idFileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleIdUpload} />
            <Button
              variant="primary"
              size="sm"
              className="mt-2 w-full"
              loading={idUploading}
              onClick={() => idFileRef.current?.click()}
            >
              <Upload className="w-4 h-4" /> Upload ID Document
            </Button>
          </div>
        )}
      </div>

      {/* Travel interests */}
      {profile.travelInterests?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-primary-500" /> Travel Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.travelInterests.map((interest: string) => (
              <Badge key={interest} variant="primary">{interest}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {profile.languagesSpoken?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary-500" /> Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.languagesSpoken.map((lang: string) => (
              <Badge key={lang} variant="outline">{lang}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile" size="lg">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={editData.firstName || ''} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} />
            <Input label="Last Name" value={editData.lastName || ''} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea className="input-field resize-none h-24 text-sm" value={editData.bio || ''} placeholder="Tell others about yourself and your travel style..."
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" min={18} max={80} value={editData.age || ''} onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select className="input-field text-sm" value={editData.gender || ''} onChange={(e) => setEditData({ ...editData, gender: e.target.value })}>
                {['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY'].map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Interests</label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_INTERESTS.map((interest) => (
                <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    editData.travelInterests?.includes(interest) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'
                  }`}>
                  {interest}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    editData.languagesSpoken?.includes(lang) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button variant="primary" size="md" className="w-full mt-4" loading={updateMutation.isPending} onClick={() => updateMutation.mutate(editData)}>
          Save Changes
        </Button>
      </Modal>
    </div>
  );
}
