// ─── User Types ──────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type VerificationStatus = 'UNVERIFIED' | 'EMAIL_VERIFIED' | 'PHONE_VERIFIED' | 'ID_VERIFIED' | 'FULLY_VERIFIED';
export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  age?: number;
  gender?: Gender;
  role: UserRole;
  verificationStatus: VerificationStatus;
  trustScore: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  travelInterests: string[];
  languagesSpoken: string[];
  budgetPreference?: BudgetRange;
  totalTrips: number;
  averageRating: number;
}

export interface UserProfile extends User {
  reviews: Review[];
  trips: Trip[];
}

// ─── Trip Types ───────────────────────────────────────────────────────────────

export type TripStatus = 'DRAFT' | 'OPEN' | 'FULL' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type TripType = 'ADVENTURE' | 'LEISURE' | 'CULTURAL' | 'BUSINESS' | 'PILGRIMAGE' | 'ROAD_TRIP' | 'BACKPACKING';
export type BudgetRange = 'BUDGET' | 'MID_RANGE' | 'LUXURY' | 'ULTRA_LUXURY';
export type GenderPreference = 'ANY' | 'MALE_ONLY' | 'FEMALE_ONLY' | 'MIXED';
export type MemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT';

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  originCity: string;
  coverImage?: string;
  images: string[];
  startDate: Date;
  endDate: Date;
  budget: number;
  budgetRange: BudgetRange;
  tripType: TripType;
  maxMembers: number;
  currentMembers: number;
  status: TripStatus;
  genderPreference: GenderPreference;
  meetingPoint?: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  organizer: User;
  organizerId: string;
  members?: TripMember[];
  isJoined?: boolean;
  isPending?: boolean;
}

export interface TripMember {
  id: string;
  userId: string;
  tripId: string;
  status: MemberStatus;
  joinedAt: Date;
  user: User;
}

// ─── Chat Types ───────────────────────────────────────────────────────────────

export type MessageType = 'TEXT' | 'IMAGE' | 'SYSTEM';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  senderId: string;
  sender: User;
  conversationId: string;
  readBy: string[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  tripId?: string;
  trip?: Trip;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  createdAt: Date;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  tripId: string;
  trip: Trip;
  createdAt: Date;
}

// ─── Safety Types ─────────────────────────────────────────────────────────────

export type ReportReason = 'SPAM' | 'HARASSMENT' | 'FAKE_PROFILE' | 'INAPPROPRIATE_CONTENT' | 'SCAM' | 'OTHER';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  userId: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
}

// ─── AI Planner Types ─────────────────────────────────────────────────────────

export type TravelStyle = 'RELAXED' | 'MODERATE' | 'FAST_PACED' | 'ADVENTURE';
export type FoodPreference = 'VEG' | 'NON_VEG' | 'VEGAN' | 'JAIN';

export interface AIPlannerInput {
  destination: string;
  budget: number;
  days: number;
  foodPreference: FoodPreference;
  travelStyle: TravelStyle;
  numberOfPeople: number;
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  hotel: HotelRecommendation;
  estimatedCost: number;
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
  type: string;
}

export interface Meal {
  time: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  restaurant: string;
  cuisine: string;
  cost: number;
  isVeg: boolean;
}

export interface HotelRecommendation {
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
}

export interface AIItinerary {
  destination: string;
  totalDays: number;
  totalBudget: number;
  days: DayPlan[];
  packingChecklist: string[];
  travelTips: string[];
  budgetBreakdown: BudgetBreakdown;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface TripFilters {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
  tripType?: TripType;
  genderPreference?: GenderPreference;
  maxGroupSize?: number;
  status?: TripStatus;
  page?: number;
  limit?: number;
  search?: string;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType =
  | 'TRIP_REQUEST'
  | 'REQUEST_APPROVED'
  | 'REQUEST_REJECTED'
  | 'NEW_MESSAGE'
  | 'TRIP_UPDATE'
  | 'REVIEW_RECEIVED'
  | 'SOS_ALERT';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  userId: string;
  isRead: boolean;
  createdAt: Date;
}

// ─── Socket Event Types ───────────────────────────────────────────────────────

export interface SocketEvents {
  'message:send': { conversationId: string; content: string; type: MessageType };
  'message:received': Message;
  'message:read': { conversationId: string; userId: string };
  'user:typing': { conversationId: string; userId: string };
  'user:stop-typing': { conversationId: string; userId: string };
  'location:update': { tripId: string; lat: number; lng: number };
  'sos:alert': { userId: string; lat: number; lng: number; tripId?: string };
}
