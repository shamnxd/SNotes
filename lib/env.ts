import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/snotes",
  JWT_SECRET: process.env.JWT_SECRET || "snotes_super_secret_jwt_key_2026_secure",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables. Check server configuration.");
}

export const env = _env.data;
