# Scalable Backend API with Rate Limiting & Auth

Production-ready backend API with JWT authentication, Google OAuth, and Redis-based rate limiting.

## Architecture

![High Level Design](./Images/hld_of_ratelimiter.png)

## Tech Stack

**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL, Prisma ORM  
**Cache:** Redis  
**Auth:** JWT, Google OAuth 2.0  
**Frontend:** Next.js  

## Features

### JWT Authentication
- User signup/login with email and password
- bcrypt password hashing (10 salt rounds)
- JWT token generation and validation
- Protected routes with auth middleware

### Google OAuth 2.0
- Google-based authentication flow
- User profile sync with database
- Separate `googleUser` table for OAuth users

### Rate Limiting (Fixed Window Algorithm)
- **Global:** 1000 requests per 15 minutes (DDoS protection)
- **Signup:** 5 requests per 15 minutes per IP
- **Login:** 10 requests per 15 minutes per IP
- IP-based tracking using Redis
- Auto-expiring keys with TTL
- Returns 429 status when limit exceeded

### API Versioning
All routes prefixed with `/api/v1/` for future compatibility

##  Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── config.ts              # Configuration
│   ├── index.ts               # Entry point
│   ├── db/
│   │   ├── index.ts           # Prisma client
│   │   └── redis-cli.ts       # Redis client
│   ├── router/
│   │   ├── user.ts            # User routes (signup/login)
│   │   ├── googleuser.ts      # Google OAuth routes
│   │   ├── middleware.ts      # JWT authentication middleware
│   │   └── ratelimiter.ts     # Rate limiting middleware
│   └── types/
│       └── schema.ts          # Zod validation schemas

Frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   └── google-callback/   # Google OAuth callback
│   └── page.tsx               # Home page
└── components/                # Reusable components
```

## 🔧 Implementation Details

### Fixed Window Rate Limiting Algorithm

The rate limiter uses Redis to implement a fixed window algorithm:

1. **Request arrives** → Extract client IP address
2. **Increment counter** → `INCR` operation in Redis
3. **First request** → Set TTL (window duration)
4. **Check limit** → If count > max requests, return 429
5. **Window expires** → Counter resets automatically

**Example Configuration:**
```typescript
rateLimiter({ 
  windowMs: 60000,      // 60 seconds window
  maxRequests: 10       // Max 10 requests per window
})
```

### JWT Authentication Flow

1. **Signup/Login** → User credentials validated
2. **Password hashing** → bcrypt with salt rounds
3. **Token generation** → JWT with user ID payload
4. **Token verification** → Middleware validates on protected routes
5. **Request processing** → User ID attached to request object

### Google OAuth Flow

1. **Initiate** → Redirect to Google consent screen
2. **Authorization** → User approves access
3. **Callback** → Receive authorization code
4. **Exchange** → Trade code for access token
5. **Profile** → Fetch user information
6. **Store** → Save/update user in database
7. **JWT** → Generate token for session

##  Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis

### Backend Setup

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   REDIS_URL="redis://localhost:6379"
   JWT_PASSWORD="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

##  API Endpoints

### Authentication
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/google/auth` - Initiate Google OAuth
- `GET /api/v1/google/callback` - Google OAuth callback

### Protected Routes
All protected routes require `Authorization: Bearer <token>` header

## Implementation Details

### 1. **Fixed Window Algorithm**
- Implemented efficient IP-based tracking
- Automatic window expiration with Redis TTL
- Race condition handling with atomic operations

### 2. **Secure Authentication Flows**
- JWT token expiration and refresh logic
- Secure password storage with bcrypt
- OAuth state validation
- Protection against common attacks (XSS, CSRF)

### 3. **Scalability Considerations**
- Stateless authentication (JWT)
- Redis for fast, distributed rate limiting
- Database connection pooling
- Efficient query optimization with Prisma



##  Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Tokens**: Signed and verified tokens with expiration
- **Rate Limiting**: Prevents DDoS and brute-force attacks
- **Input Validation**: Zod schemas for all inputs
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protected

##  Performance Optimizations

- **Redis Caching**: In-memory storage for rate limit data
- **Connection Pooling**: Efficient database connections
- **Async/Await**: Non-blocking I/O operations
- **Type Safety**: Compile-time error detection


