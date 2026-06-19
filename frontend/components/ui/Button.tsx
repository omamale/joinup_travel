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
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-soft',
  ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
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
