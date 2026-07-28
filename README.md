# SNotes — Secure Note Sharing Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**SNotes** is a modern, high-security web application built with **Next.js 16 (App Router)**, **TypeScript**, and **MongoDB**. It enables users to create notes and share them securely with granular controls—such as password protection, time-based expiration, one-time viewing ("burn after reading"), and instant link revocation.

---

## Tech Stack Used

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server-side rendering, API route handlers, and frontend components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety across client and server |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) | Responsive modern design system |
| **Database** | [MongoDB](https://www.mongodb.com/) & [Mongoose ODM](https://mongoosejs.com/) | NoSQL database for flexible note and share management |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` | HttpOnly cookie-based session authentication and password hashing |
| **Validation** | [Zod](https://zod.dev/) | Strict runtime schema parsing and payload validation |

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A running [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SNotes.git
cd SNotes
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root of the project:
```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/snotes

# Secret Key for JWT Signing
JWT_SECRET=your_super_secret_jwt_key_here

# App Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment Mode
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Database Schema

SNotes uses three main collections in MongoDB via Mongoose:

### 1. User Schema (`models/User.ts`)
Stores account credentials and user profile information.

```typescript
{
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // Hashed with bcryptjs
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Note Schema (`models/Note.ts`)
Stores user-created note content.

```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Share Schema (`models/Share.ts`)
Stores configuration and security rules for generated share links.

```typescript
{
  _id: ObjectId,
  noteId: { type: ObjectId, ref: 'Note', required: true, index: true },
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  token: { type: String, required: true, unique: true, index: true },
  isPasswordProtected: { type: Boolean, default: false },
  passwordHash: { type: String }, // Hashed access password (if protected)
  isOneTime: { type: Boolean, default: false },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date }, // Optional time-based expiration
  isRevoked: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: Date
}
```

---

## Core Workflows & Logic

### 1. Share Link Flow
1. **Link Creation**: The authenticated note owner selects share options (password, one-time access, expiration date) and sends a `POST /api/share/[token]` request.
2. **Token Generation**: A cryptographically random UUID token is generated for the share link.
3. **Access Phase**: When a recipient navigates to `/share/[token]`:
   - System checks if link exists.
   - System checks if link `isRevoked`, `isExpired`, or already `isUsed`.
   - If password-protected, prompts user for password input.
4. **Validation & Unlock**: Once validated, the system performs an atomic view count increment and delivers note content to the recipient.

### 2. Password / Key Generation Logic
- **Share Tokens**: Cryptographically secure UUIDs generated using Node's `crypto.randomUUID()` to prevent token guessing.
- **Account & Share Passwords**: Passwords (both user account passwords and optional note access passwords) are hashed using `bcryptjs` with salt rounds before being written to the database. Raw passwords are never stored.

### 3. Expiry Logic
- Time-based expiration uses the `expiresAt` field in the `Share` document.
- Upon access (`GET /api/share/[token]`), the server compares current system time against `expiresAt`:
  ```typescript
  if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
    return buildResponse(errorResult("Share link has expired"), 410);
  }
  ```

### 4. Invalidate / Revoke Logic
- Note owners can revoke share links at any time via `DELETE /api/share/[token]`.
- Revocation updates `isRevoked: true` on the target share document.
- On subsequent access attempts, the server rejects requests with HTTP 410 GONE if `isRevoked === true`.

### 5. View Count Logic
- Every successful access increments the `viewCount` field.
- To avoid read-modify-write race conditions, view counts are updated using MongoDB's atomic `$inc` operator:
  ```typescript
  { $inc: { viewCount: 1 } }
  ```

### 6. Race-Condition Handling
- **The Problem**: If two users attempt to open a single-use ("one-time") share link simultaneously, a standard "check then update" approach could allow both requests to pass.
- **The Solution**: SNotes uses MongoDB's atomic `findOneAndUpdate` with conditional query criteria:
  ```typescript
  const updatedShare = await Share.findOneAndUpdate(
    {
      _id: share._id,
      isRevoked: false,
      isUsed: false, // Ensure link has NOT been used yet
    },
    {
      $inc: { viewCount: 1 },
      ...(share.isOneTime ? { $set: { isUsed: true } } : {}),
    },
    { new: true }
  );

  if (!updatedShare) {
    // Second concurrent request gets null because isUsed is now true
    return buildResponse(errorResult("Link already used"), 410);
  }
  ```
  Because MongoDB guarantees atomicity for single-document updates, only the first request succeeds in setting `isUsed: true`. The second concurrent request fails to match the query and receives `null`.

---

## Technical Architecture Q&A

### Q1: How do you prevent two users from using a one-time link at the same time?
**Answer**: By executing an atomic `findOneAndUpdate` in MongoDB with the query condition `{ _id: share._id, isUsed: false }` and update payload `{ $set: { isUsed: true } }`. Because MongoDB document updates are atomic, only one concurrent thread will succeed in updating `isUsed` from `false` to `true`. The losing request receives a `null` return value and is immediately rejected with HTTP 410 GONE ("Link already used").

### Q2: How do you update view count safely?
**Answer**: Using MongoDB's atomic `$inc` operator (`{ $inc: { viewCount: 1 } }`) inside `findOneAndUpdate`. This executes directly at the database layer in a single atomic step, avoiding non-atomic read-then-write cycles in JavaScript that could cause lost updates under high concurrency.

### Q3: How would this work if 1 million people opened the link?
**Answer**:
1. **Database Load**: Direct database write per read (`$inc: { viewCount: 1 }`) would bottleneck MongoDB under 1M concurrent hits.
2. **CDN / Caching Layer**: Public note content should be cached at the edge (CDN like Cloudflare or in-memory Redis cache) to serve reads in sub-10ms without hitting the primary database.
3. **Buffered / Async View Counting**: View counts should be pushed to an in-memory queue (Redis / Kafka / SQS) and written to MongoDB in asynchronous batches (e.g., flushing aggregated view increments every 5 seconds).
4. **Distributed Locking**: For one-time links under extreme scale, use Redis distributed locks (`SETNX` / Redlock) to atomically validate and burn the link in memory before touching the database.

### Q4: How would you prevent brute-force attempts on password-protected links?
**Answer**:
1. **Rate Limiting**: Implement sliding-window rate limiting per IP address and token (e.g., using Upstash Redis or Nginx) restricting attempts to max 5 per minute.
2. **Slow Hashing**: Use `bcryptjs` with an appropriate work factor (salt rounds 10+) to compute password hashes, making automated dictionary attacks computationally expensive.
3. **Exponential Backoff & Temporary Lockout**: Temporarily block attempts on a token after 5 consecutive failed entries for 15 minutes.
4. **CAPTCHA Verification**: Trigger a CAPTCHA (e.g. Cloudflare Turnstile or reCAPTCHA) after 3 failed password attempts.

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & set JWT cookie | No |
| `POST` | `/api/auth/logout` | Clear authentication cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Notes
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/notes` | Get all notes created by user | Yes |
| `POST` | `/api/notes` | Create a new note | Yes |
| `GET` | `/api/notes/[id]` | Fetch details of a specific note | Yes |
| `PUT` | `/api/notes/[id]` | Update an existing note | Yes |
| `DELETE` | `/api/notes/[id]` | Delete a note | Yes |

### Share Management
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/share/[token]` | Generate/configure share link | Yes |
| `GET` | `/api/share/[token]` | Validate & view shared note | No |
| `POST` | `/api/share/[token]` | Unlock password-protected shared note | No |
| `DELETE` | `/api/share/[token]` | Revoke an active share link | Yes |

---

## Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts development server at `http://localhost:3000` |
| `npm run build` | Builds production bundle |
| `npm run start` | Runs production server |
| `npm run lint` | Executes ESLint checks |

---

## License

This project is licensed under the MIT License.