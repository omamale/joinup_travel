import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: { wrapper: 'w-6 h-6', text: 'text-xs' },
  sm: { wrapper: 'w-8 h-8', text: 'text-xs' },
  md: { wrapper: 'w-10 h-10', text: 'text-sm' },
  lg: { wrapper: 'w-14 h-14', text: 'text-lg' },
  xl: { wrapper: 'w-20 h-20', text: 'text-2xl' },
};

export function Avatar({ src, firstName, lastName, size = 'md', className }: AvatarProps) {
  const sizes = SIZE_MAP[size];
  const initials = getInitials(firstName, lastName);

  return (
    <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizes.wrapper, className)}>
      {src ? (
        <Image src={src} alt={`${firstName} ${lastName}`} fill className="object-cover" sizes="80px" />
      ) : (
        <div className={cn('w-full h-full bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center text-white font-bold', sizes.text)}>
          {initials}
        </div>
      )}
    </div>
  );
}
