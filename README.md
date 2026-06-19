# JoinUp Travel 🌍

> **Never Travel Alone** — Find verified travel companions, join safe group trips, and plan trips with AI.

**Primary Launch City: Pune, India**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **Real-time** | Socket.io (WebSockets) |
| **Auth** | JWT, Google OAuth, OTP via Twilio |
| **File Storage** | Cloudinary |
| **AI** | OpenAI GPT-4o |
| **Push Notifications** | Firebase Cloud Messaging |
| **Maps** | Google Maps API |
| **Deployment** | Docker, AWS EC2, Vercel |
| **CI/CD** | GitHub Actions |

---

## Project Structure

```
joinup/
├── apps/
│   ├── web/                    # Next.js 14 website
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── (auth)/         # Login, Register pages
│   │   │   └── (app)/          # Protected app pages
│   │   │       ├── trips/      # Browse, Create, Detail
│   │   │       ├── chat/       # Conversations & Messages
│   │   │       ├── ai-planner/ # AI Trip Planner
│   │   │       ├── safety/     # SOS & Safety features
│   │   │       └── profile/    # User profile
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # API client, utils, socket
│   │   └── stores/             # Zustand state stores
│   │
│   └── backend/                # NestJS API
│       ├── src/
│       │   ├── auth/           # JWT, Google, OTP auth
│       │   ├── users/          # User management
│       │   ├── trips/          # Trip CRUD & members
│       │   ├── chat/           # WebSocket gateway
│       │   ├── ai-planner/     # OpenAI integration
│       │   ├── safety/         # SOS, reports, blocks
│       │   ├── reviews/        # Ratings & reviews
│       │   ├── upload/         # Cloudinary uploads
│       │   ├── notifications/  # FCM push notifications
│       │   └── prisma/         # Database service
│       └── prisma/
│           └── schema.prisma   # Full database schema
│
└── packages/
    ├── types/                  # Shared TypeScript types
    ├── config/                 # Shared configuration
    └── utils/                  # Shared utilities
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/joinup-travel.git
cd joinup-travel
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Fill in your API keys
```

Required keys:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Any random secret string
- `OPENAI_API_KEY` — From platform.openai.com
- `GOOGLE_CLIENT_ID/SECRET` — From Google Cloud Console
- `CLOUDINARY_*` — From cloudinary.com
- `TWILIO_*` — From twilio.com (for OTP)

### 3. Database Setup

```bash
# Start PostgreSQL (or use Docker)
docker run -d -e POSTGRES_DB=joinup -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16-alpine

# Generate Prisma client & push schema
pnpm db:generate
pnpm db:push
```

### 4. Run Development

```bash
# Run everything simultaneously
pnpm dev

# Or individually:
pnpm --filter backend dev    # API at http://localhost:4000
pnpm --filter web dev        # Website at http://localhost:3000
```

### 5. Using Docker Compose

```bash
docker-compose up -d
```

---

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:4000/api/docs

### Key Endpoints

```
POST   /api/v1/auth/register          Register with email
POST   /api/v1/auth/login             Email/password login
POST   /api/v1/auth/phone/send-otp    Send OTP to phone
POST   /api/v1/auth/phone/verify-otp  Verify OTP
GET    /api/v1/auth/google            Google OAuth

GET    /api/v1/trips                  Browse trips (Pune only)
POST   /api/v1/trips                  Create a trip
GET    /api/v1/trips/:id              Trip details
POST   /api/v1/trips/:id/join         Request to join
PATCH  /api/v1/trips/:id/members/:id  Approve/reject request

GET    /api/v1/chat/conversations     All conversations
GET    /api/v1/chat/conversations/:id/messages  Messages

POST   /api/v1/ai-planner/generate    Generate AI itinerary

POST   /api/v1/safety/sos             Trigger SOS alert
POST   /api/v1/safety/emergency-contacts  Add emergency contact

POST   /api/v1/reviews                Write a review

POST   /api/v1/upload/avatar          Upload profile photo
```

---

## WebSocket Events

Connect to: `ws://localhost:4000/chat`

```typescript
// Client → Server
socket.emit('conversation:join', { conversationId })
socket.emit('message:send', { conversationId, content, type })
socket.emit('user:typing', { conversationId })
socket.emit('sos:alert', { lat, lng, tripId? })

// Server → Client
socket.on('message:received', (message) => {})
socket.on('user:typing', ({ userId, conversationId }) => {})
socket.on('sos:alert', ({ userId, lat, lng }) => {})
```

---

## Features

### ✅ Authentication
- Email/password with JWT
- Google OAuth 2.0
- Phone OTP via Twilio
- Refresh token rotation

### ✅ User Profiles
- Avatar upload (Cloudinary)
- Bio, age, gender, travel interests
- Languages spoken
- Verification status & trust score

### ✅ Trust & Verification
- Email verification (+10 pts)
- Phone verification (+15 pts)
- Government ID verification (+25 pts)
- Selfie verification (+15 pts)
- Completed trips bonus (+5 pts each)
- Positive reviews bonus (+3 pts each)
- Reports received penalty (-10 pts each)

### ✅ Trip Discovery
- Browse all trips from Pune
- Search by destination, type, budget
- Filter by gender preference, dates
- Real-time member count

### ✅ Trip Management
- Create trips with cover photos
- Multi-step form with validation
- Join request system with organizer approval
- Automatic group chat creation

### ✅ Real-Time Chat
- Group chat for trip members
- One-to-one direct messages
- Image sharing
- Typing indicators
- Read receipts

### ✅ AI Planner (GPT-4)
- Destination + budget + preferences
- Day-by-day itinerary
- Hotel & restaurant recommendations
- Packing checklist
- Budget breakdown
- Transport from Pune

### ✅ Safety
- SOS alert with GPS location
- Emergency contacts (up to 3)
- User reporting system
- User blocking
- Real-time SOS broadcasting

---

## Deployment

### Backend (AWS EC2 + Docker)

```bash
# Build image
docker build -f apps/backend/Dockerfile -t joinup-backend .

# Run with environment variables
docker run -d -p 4000:4000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  joinup-backend
```

### Frontend (Vercel — recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## Future Roadmap

- [ ] Mobile app (React Native + Expo) using the same backend API
- [ ] Video call integration for pre-trip meetups
- [ ] AI companion matching (suggest compatible travelers)
- [ ] Trip expense splitting
- [ ] Loyalty rewards program
- [ ] Insurance integration

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT © JoinUp Travel

---

Made with ❤️ in Pune, India 🇮🇳
