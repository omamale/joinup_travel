'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from '@/lib/utils';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  age: z.number().min(18, 'Must be at least 18 years old').max(80),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const PERKS = [
  'Free to join and browse',
  'Verified community members',
  'AI trip planner included',
  'Safety tools built-in',
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { gender: 'PREFER_NOT_TO_SAY' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const res = await authApi.register(payload);
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome to JoinUp, ${user.firstName}!`);
      router.push('/trips');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
      <p className="text-slate-400 mb-6 text-sm">Join 10,000+ verified travelers from Pune</p>

      {/* Perks */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {PERKS.map((perk) => (
          <div key={perk} className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            {perk}
          </div>
        ))}
      </div>

      {/* Google */}
      <button
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-colors mb-4"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#E2E8F0' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-xs text-slate-500">or register with email</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input {...register('firstName')} placeholder="Rahul" className="input-field pl-9 text-sm" />
            </div>
            {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Last Name</label>
            <input {...register('lastName')} placeholder="Sharma" className="input-field text-sm" />
            {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input {...register('email')} type="email" placeholder="rahul@example.com" className="input-field pl-9 text-sm" />
          </div>
          {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Age</label>
            <input {...register('age', { valueAsNumber: true })} type="number" min={18} max={80} placeholder="25" className="input-field text-sm" />
            {errors.age && <p className="text-error text-xs mt-1">{errors.age.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Gender</label>
            <select {...register('gender')} className="input-field text-sm">
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 chars with uppercase & number"
              className="input-field pl-9 pr-10 text-sm"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="input-field pl-9 text-sm" />
          </div>
          {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <p className="text-xs text-slate-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-pulse">Creating account...</span> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
