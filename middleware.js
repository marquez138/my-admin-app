// /middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get session token
  // Note: process.env.NEXTAUTH_SECRET is needed by getToken here
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Middleware - Pathname:", pathname);
  console.log("Middleware - Token:", token);

  // Paths to protect
  const protectedPaths = ["/dashboard"]; // Add more paths/patterns like /dashboard/*

  // If trying to access a protected path without a token or if not admin
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    console.log("Middleware - Accessing protected path:", pathname);
    if (!token || !token.isAdmin) {
      console.log("Middleware - No token or not admin, redirecting to login.");
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    } else {
      console.log("Middleware - Token valid, isAdmin, allowing access.");
    }
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (pathname === "/auth/login" && token && token.isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher for routes to apply middleware
  // Adjust as needed, e.g., to include specific API routes if they also need protection
  matcher: ["/dashboard/:path*", "/auth/login"],
};
