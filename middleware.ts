import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/unauthorized"]; // public pages

export function middleware(req: NextRequest) {
   console.log("Middleware — cookies:", req.cookies.getAll());
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
