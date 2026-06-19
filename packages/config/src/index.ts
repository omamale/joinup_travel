export const APP_CONFIG = {
  name: 'JoinUp Travel',
  tagline: 'Never Travel Alone',
  launchCity: 'Pune',
  launchCityCoords: { lat: 18.5204, lng: 73.8567 },
  supportEmail: 'support@joinuptravel.com',
  version: '1.0.0',
} as const;

export const COLORS = {
  primary: '#2563EB',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
} as const;

export const TRUST_SCORE_WEIGHTS = {
  emailVerified: 10,
  phoneVerified: 15,
  idVerified: 25,
  selfieVerified: 15,
  completedTrip: 5,
  positiveReview: 3,
  reportReceived: -10,
  accountAge30Days: 5,
  accountAge90Days: 10,
} as const;

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 50,
} as const;

export const FILE_UPLOAD = {
  maxSizeMB: 5,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocTypes: ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

export const TRIP_DEFAULTS = {
  maxMembers: 10,
  minAge: 18,
  advanceBookingDays: 1,
} as const;
