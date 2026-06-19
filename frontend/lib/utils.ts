import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any): string {
  if (error?.response?.data?.message) {
    const msg = error.response.data.message;
    return Array.isArray(msg) ? msg.join(', ') : msg;
  }
  return error?.message || 'Something went wrong. Please try again.';
}

export function formatTripDates(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const endStr = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr} (${days} days)`;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

export function getTrustBadge(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Highly Trusted', color: 'text-green-700 bg-green-100' };
  if (score >= 60) return { label: 'Trusted', color: 'text-blue-700 bg-blue-100' };
  if (score >= 40) return { label: 'Verified', color: 'text-yellow-700 bg-yellow-100' };
  return { label: 'New User', color: 'text-gray-700 bg-gray-100' };
}

export function getBudgetEmoji(range: string): string {
  const map: Record<string, string> = {
    BUDGET: '₹',
    MID_RANGE: '₹₹',
    LUXURY: '₹₹₹',
    ULTRA_LUXURY: '₹₹₹₹',
  };
  return map[range] || '₹';
}

export function getTripTypeIcon(type: string): string {
  const map: Record<string, string> = {
    ADVENTURE: '🏔️',
    LEISURE: '🏖️',
    CULTURAL: '🏛️',
    BUSINESS: '💼',
    PILGRIMAGE: '🙏',
    ROAD_TRIP: '🚗',
    BACKPACKING: '🎒',
  };
  return map[type] || '✈️';
}
