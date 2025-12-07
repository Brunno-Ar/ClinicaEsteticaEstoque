import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 1. Public Routes (Login, Register, Webhooks, Payment Required, Home)
  const publicRoutes = [
    "/login",
    "/register",
    "/api/webhooks",
    "/payment-required",
    "/api/auth",
  ];
  if (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 2. Verify Logged In
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Admin routes - only for SUPER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next(); // Super admins don't need subscription
  }

  // 4. For regular users, verify Tenant Status
  const userTenantStatus = (token as any).tenantStatus || "PENDING";

  if (userTenantStatus !== "ACTIVE") {
    if (pathname === "/payment-required") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/payment-required", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
