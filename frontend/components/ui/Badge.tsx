import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

const VARIANTS = {
  default: 'bg-white/10 text-slate-300',
  success: 'bg-green-500/15 text-green-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  error: 'bg-red-500/15 text-red-400',
  primary: 'bg-primary-500/15 text-primary-400',
  outline: 'border border-white/15 text-slate-400',
};

const SIZES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-medium', VARIANTS[variant], SIZES[size], className)}>
      {children}
    </span>
  );
}
