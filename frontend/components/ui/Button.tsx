import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-card',
  secondary: 'text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white',
  ghost: 'text-slate-400 hover:bg-white/5 hover:text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
};

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
