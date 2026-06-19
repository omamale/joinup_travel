import { BudgetRange, TripType, VerificationStatus } from '@joinup/types';

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  if (format === 'relative') {
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getTripDuration(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getBudgetLabel(range: BudgetRange): string {
  const labels: Record<BudgetRange, string> = {
    BUDGET: '₹ Budget',
    MID_RANGE: '₹₹ Mid-Range',
    LUXURY: '₹₹₹ Luxury',
    ULTRA_LUXURY: '₹₹₹₹ Ultra Luxury',
  };
  return labels[range];
}

export function getTripTypeLabel(type: TripType): string {
  const labels: Record<TripType, string> = {
    ADVENTURE: 'Adventure',
    LEISURE: 'Leisure',
    CULTURAL: 'Cultural',
    BUSINESS: 'Business',
    PILGRIMAGE: 'Pilgrimage',
    ROAD_TRIP: 'Road Trip',
    BACKPACKING: 'Backpacking',
  };
  return labels[type];
}

export function getVerificationLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    UNVERIFIED: 'Unverified',
    EMAIL_VERIFIED: 'Email Verified',
    PHONE_VERIFIED: 'Phone Verified',
    ID_VERIFIED: 'ID Verified',
    FULLY_VERIFIED: 'Fully Verified',
  };
  return labels[status];
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateOTP(length = 6): string {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, '0');
}

export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/^(\+91|91)/, ''));
}

export function calculateAge(dateOfBirth: Date | string): number {
  const dob = new Date(dateOfBirth);
  const ageDiff = Date.now() - dob.getTime();
  return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}
