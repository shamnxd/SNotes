import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  content: z.string().min(1, "Content is required").optional(),
});

export const shareConfigSchema = z.object({
  isPasswordProtected: z.boolean().default(false),
  password: z.string().optional(),
  isOneTime: z.boolean().default(false),
  expiresAt: z.string().nullable().optional(),
});

export const accessShareSchema = z.object({
  password: z.string().optional(),
});
