import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/unauthorized"]; // public pages

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes, static files, API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    PUBLIC_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/profile/:path*", "/dashboard/:path*"],
};

// export const runtime = "nodejs";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// const AUTH_PAGES = ["/login"]; // pages that don't require auth

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Allow public files, images, API, etc.
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/static") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   // If route is public (login page), allow access
//   if (AUTH_PAGES.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // Read JWT token from cookies
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);

//     // Attach decoded user info (id + role)
//     req.nextUrl.searchParams.set("uid", (decoded as any).id);
//     req.nextUrl.searchParams.set("role", (decoded as any).role);

//     // ================================
//     // ⭐ ROLE-BASED PROTECTION
//     // ================================

//     // Admin pages protection
//     if (pathname.startsWith("/admin")) {
//       if ((decoded as any).role !== "admin") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     // Employee pages protection
//     if (pathname.startsWith("/employee")) {
//       if ((decoded as any).role !== "employee") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("Invalid token", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// // Apply middleware to these routes
// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/employee/:path*",
//     "/dashboard/:path*",
//     "/profile/:path*",
//     "/",
//   ],
// };
