'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const refresh = params.get('refresh');

    if (!token || !refresh) {
      router.replace('/auth/login');
      return;
    }

    async function handleCallback() {
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuth(res.data, token!, refresh!);
        toast.success(`Welcome to JoinUp, ${res.data.firstName}!`);
        router.replace('/trips');
      } catch {
        toast.error('Authentication failed. Please try again.');
        router.replace('/auth/login');
      }
    }

    handleCallback();
  }, [params, router, setAuth]);

  return <CallbackUI />;
}

function CallbackUI() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
        <MapPin className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-600 font-medium">Signing you in...</p>
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mt-4" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackUI />}>
      <CallbackContent />
    </Suspense>
  );
}
