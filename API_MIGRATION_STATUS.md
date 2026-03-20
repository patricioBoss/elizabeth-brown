# API Routes Migration Status (App Router)

## ✅ Completed Migration

### 1. **Middleware & Config**
- ✅ `src/config/iron-session.ts` - Iron Session configuration for App Router
- ✅ `src/middleware/session.ts` - Session utilities
- ✅ `src/utils/dbConnect.ts` - MongoDB connection utility

### 2. **Models** (`src/models/`)
- ✅ `user.model.ts` - User schema with TypeScript interfaces
- ✅ `investment.model.ts` - Investment schema
- ✅ `withdrawal.model.ts` - Withdrawal schema
- ✅ `transaction.model.ts` - Transaction schema
- ✅ `deposit.model.ts` - Deposit schema

### 3. **Helpers** (`src/helpers/`)
- ✅ `serialize.ts` - Field serialization utility
- ✅ `fetchers.ts` - Data fetching utilities
- ✅ `sendMail.ts` - Email sending utility
- ✅ `welcomeMail.ts` - Welcome email template
- ✅ `resetPasswordMailTemplate.ts` - Reset password email template

### 4. **API Utilities** (`src/apiUtil/`)
- ✅ `responses.ts` - Standardized API responses
- ✅ `jwt.ts` - JWT sign/verify utilities

### 5. **Controllers** (`src/controllers/`)
- ✅ `auth.controller.ts` - Login, logout, reset password (for reference)
- ✅ `user.controller.ts` - User CRUD operations (for reference)

### 6. **API Routes** (App Router - `src/app/api/`)

#### Auth Routes
- ✅ `/api/auth/login` (POST) - User login with session
- ✅ `/api/auth/logout` (POST) - User logout
- ✅ `/api/auth/reset-password` (POST) - Password reset request

#### User Routes
- ✅ `/api/user` (GET, POST) - Get all users / Create user
- ✅ `/api/user/[userId]` (GET, PUT) - Get user by ID / Update user
- ✅ `/api/user/[userId]/wallet` (PUT) - Update wallet addresses
- ✅ `/api/user/[userId]/password` (PUT) - Change password

#### Utility Routes
- ✅ `/api/fetch-coin-prices` (GET) - Fetch cryptocurrency prices

---

## ❌ Remaining API Routes to Migrate

### Investment Routes
- [ ] `/api/user/[userId]/invest` (GET) - Get user investments
- [ ] `/api/user/[userId]/invest/all` (GET) - Get all investments
- [ ] `/api/user/[userId]/invest/reinvest` (POST) - Reinvest balance
- [ ] `/api/user/[userId]/invest/[investmentId]` (GET, PUT, DELETE) - Manage investment
- [ ] `/api/user/[userId]/invest/[investmentId]/approve` (POST) - Approve investment
- [ ] `/api/user/[userId]/invest/[investmentId]/daily` (POST) - Process daily returns
- [ ] `/api/user/[userId]/invest/[investmentId]/topup` (POST) - Top up investment

### Withdrawal Routes
- [ ] `/api/user/[userId]/withdraw` (GET, POST) - Get/Create withdrawals
- [ ] `/api/user/[userId]/withdraw/[withdrawId]` (GET, PUT, DELETE) - Manage withdrawal

### Deposit Routes
- [ ] `/api/user/[userId]/deposit` (GET, POST) - Get/Create deposits
- [ ] `/api/user/[userId]/deposit/[depositId]` (GET, PUT) - Manage deposit

### Admin Routes
- [ ] `/api/admin/users` - Manage all users
- [ ] `/api/admin/deposits` - Manage all deposits
- [ ] `/api/admin/investments` - Manage all investments
- [ ] `/api/admin/withdrawals` - Manage all withdrawals

### Utility Routes
- [ ] `/api/update-coin-prices` (POST) - Update coin prices (cron)
- [ ] `/api/automate-investment` (POST) - Automated investment processing (cron)
- [ ] `/api/send-email` (POST) - Send email endpoint

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install iron-session mongoose bcrypt jsonwebtoken nodemailer axios
npm install -D @types/bcrypt @types/jsonwebtoken @types/nodemailer
```

### 2. Configure Environment Variables
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your credentials:
MONGODB_URI=your_mongodb_connection_string
IRON_SESSION_PASSWORD=random_32_plus_character_string
JWT_SECRET=random_32_plus_character_string
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@example.com
NEXT_PUBLIC_SITE_URL=localhost:8084
```

### 3. Set Up MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string
```

### 4. Test API Routes
```bash
# Start development server
npm run dev

# Test endpoints at http://localhost:8084/api/*

# Example: Login
curl -X POST http://localhost:8084/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Example: Register
curl -X POST http://localhost:8084/api/user \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123","country":"USA","state":"NY"}'

# Example: Get coin prices
curl http://localhost:8084/api/fetch-coin-prices
```

---

## 📝 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login with session |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/reset-password` | Request password reset email |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get all users |
| POST | `/api/user` | Create new user (register) |
| GET | `/api/user/[userId]` | Get user by ID |
| PUT | `/api/user/[userId]` | Update user profile |
| PUT | `/api/user/[userId]/wallet` | Update crypto wallet addresses |
| PUT | `/api/user/[userId]/password` | Change password |

### Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fetch-coin-prices` | Get cryptocurrency prices from CoinGecko |

---

## 🚀 App Router API Pattern

All API routes follow the Next.js App Router pattern:

```typescript
// src/app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ data: '...' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Handle POST request
  return NextResponse.json({ message: 'Success' });
}

export async function PUT(request: NextRequest) {
  // Handle PUT request
  return NextResponse.json({ message: 'Updated' });
}

export async function DELETE(request: NextRequest) {
  // Handle DELETE request
  return NextResponse.json({ message: 'Deleted' });
}
```

---

## 📊 Migration Progress

- **Completed**: 15+ API route files
- **Remaining**: ~15 API route files
- **Progress**: ~50%

The core authentication and user management API is complete and functional using Next.js App Router!
