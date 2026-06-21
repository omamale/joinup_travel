import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{leftIcon}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'input-field',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error focus:ring-error',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-error text-xs mt-1">{error}</p>}
        {hint && !error && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
