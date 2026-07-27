import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export interface TokenPayload {
  userId: string;
  email: string;
}

export function signJwtToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req?: Request): Promise<TokenPayload | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("auth_token")?.value;
  }

  if (!token) {
    return null;
  }

  return verifyJwtToken(token);
}

export const AUTH_COOKIE_NAME = "auth_token";
