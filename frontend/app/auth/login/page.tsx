'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const otpSchema = z.object({
  phone: z.string().min(10, 'Enter valid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { register: registerOtp, handleSubmit: handleOTPSubmit, formState: { errors: otpErrors } } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onEmailLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.firstName}!`);
      router.push('/trips');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onSendOTP = async () => {
    if (!phoneValue || phoneValue.length < 10) {
      toast.error('Enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      await authApi.sendOTP(phoneValue);
      setOtpSent(true);
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (data: OTPForm) => {
    if (!data.otp) return;
    setLoading(true);
    try {
      const res = await authApi.verifyOTP(phoneValue, data.otp);
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome, ${user.firstName}!`);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-gray-500 mb-6 text-sm">Sign in to find your next travel companion</p>

      {/* Google Login */}
      <button
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Tab toggle */}
      <div className="flex bg-surface rounded-xl p-1 mb-5">
        <button
          onClick={() => { setLoginMode('email'); setOtpSent(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${loginMode === 'email' ? 'bg-white shadow-soft text-gray-900' : 'text-gray-500'}`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
        <button
          onClick={() => { setLoginMode('phone'); setOtpSent(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${loginMode === 'phone' ? 'bg-white shadow-soft text-gray-900' : 'text-gray-500'}`}
        >
          <Phone className="w-4 h-4" /> Phone OTP
        </button>
      </div>

      {loginMode === 'email' ? (
        <form onSubmit={handleSubmit(onEmailLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="rahul@example.com"
                className="input-field pl-10"
              />
            </div>
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <span className="animate-pulse">Signing in...</span> : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+91</span>
              <input
                type="tel"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="input-field pl-12"
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="input-field text-center text-2xl tracking-widest"
                onChange={(e) => {
                  if (e.target.value.length === 6) {
                    onVerifyOTP({ phone: phoneValue, otp: e.target.value });
                  }
                }}
              />
              <p className="text-xs text-gray-400 mt-1 text-center">OTP sent to +91 {phoneValue}</p>
            </div>
          )}

          {!otpSent ? (
            <button onClick={onSendOTP} disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          ) : (
            <button onClick={onSendOTP} disabled={loading} className="w-full text-primary-600 text-sm font-medium hover:underline">
              Resend OTP
            </button>
          )}
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
