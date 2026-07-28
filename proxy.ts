import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/notes"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  if (pathname.startsWith("/share/")) {
    return NextResponse.next();
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  return proxy(req);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/notes",
    "/notes/:path*",
    "/login",
    "/register",
  ],
};
