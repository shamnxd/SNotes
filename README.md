# SNotes — Secure Note Sharing Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**SNotes** is a modern, high-security web application built with **Next.js 16 (App Router)**, **TypeScript**, and **MongoDB**. It enables users to create notes and share them securely with granular controls—such as password protection, time-based expiration, one-time viewing ("burn after reading"), and instant link revocation.

---

## Key Features

### Authentication & Session Management
- **JWT Authentication**: Auth tokens stored securely in `HttpOnly` cookies to mitigate XSS vulnerabilities.
- **Password Hashing**: Passwords encrypted using `bcryptjs` with salt rounds.
- **User Management**: User registration, login, and active session checking (`/api/auth/me`).

### Note Management
- **Full CRUD Operations**: Create, read, update, and delete notes smoothly.
- **Organized Dashboard**: Clean interface to search, filter, and organize notes.
- **Strict Authorization**: Access control checks ensuring only note owners can modify or delete notes.

### Secure Note Sharing
- **Cryptographic Tokens**: Share links use securely generated random UUID tokens.
- **Public & Password-Protected Sharing**: Choose between public access or set a custom password required to unlock the note.
- **One-Time Access (Burn After Reading)**: Links automatically expire immediately after the first successful access.
- **Time-Based Expiration**: Set links to expire automatically after a specified date & time.
- **Instant Revocation**: Manually revoke active share links at any time to instantly block further access.

### Analytics & Race-Condition Safety
- **View Tracking**: Accurate real-time counter tracking total successful reads per share link.
- **Atomic Database Operations**: Prevents race conditions during concurrent access on one-time view links using MongoDB atomic operations.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` |
| **Validation** | [Zod](https://zod.dev/) schema validation |

---

## Project Architecture

```
SNotes/
├── app/                      # Next.js App Router Pages & API Routes
│   ├── api/                  # Backend Route Handlers
│   │   ├── auth/             # Auth endpoints (login, register, me, logout)
│   │   ├── notes/            # Note CRUD endpoints
│   │   └── share/            # Link sharing & access handlers
│   ├── dashboard/            # Notes dashboard page
│   ├── login/                # User authentication pages
│   ├── register/             # User registration page
│   ├── notes/                # Note creation & editor pages
│   └── share/[token]/        # Public & protected share access page
├── components/               # Reusable UI components (Header, layout tools)
├── context/                  # Project specifications & guidelines
├── lib/                      # Helper modules & configuration
│   ├── auth.ts               # JWT signing & verification helpers
│   ├── env.ts                # Environment variable Zod validation
│   ├── mongodb.ts            # Mongoose DB connection manager
│   └── validations.ts        # Zod input validation schemas
├── models/                   # Mongoose Database Models
│   ├── Note.ts               # Note document schema
│   ├── Share.ts              # Share link configuration schema
│   └── User.ts               # User schema
└── public/                   # Static assets & icons
```

---

## Quick Start

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URL

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SNotes.git
cd SNotes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/snotes

# Secret key for JWT signing
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

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Security Standards

- **Server-side Data Validation**: All inputs are checked using **Zod** schemas.
- **HttpOnly Cookie Storage**: Prevents client-side scripts from reading authentication tokens.
- **Independent Password Hashing**: Shared note passwords are separately hashed using **bcryptjs** before storage.
- **Race Condition Safety**: Uses atomic MongoDB updates (`$set`, `$inc`) when marking one-time links as used to ensure single-access guarantees under high concurrent traffic.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Runs the development server at `http://localhost:3000` |
| `build` | `npm run build` | Compiles the Next.js app for production deployment |
| `start` | `npm run start` | Launches the compiled production build |
| `lint` | `npm run lint` | Runs ESLint checks across the codebase |

---

## License

This project is licensed under the MIT License.