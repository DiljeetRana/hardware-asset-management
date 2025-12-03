import { NextResponse,NextRequest } from "next/server";


// const PUBLIC_PATHS = ["/login", "/unauthorized"]; // public pages

// export function middleware(req: NextRequest) {
//    console.log("Middleware — cookies:", req.cookies.getAll());
//   const { pathname } = req.nextUrl;

//   // Allow public routes, static files, API
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/static") ||
//     pathname.includes(".") ||
//     PUBLIC_PATHS.includes(pathname)
//   ) {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/employee/:path*", "/profile/:path*", "/dashboard/:path*"],
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PUBLIC_PATHS = ["/login", "/"]; // pages that logged-in users should not access

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  let user: any = null;
  if (token) {
    try {
      user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    } catch (err) {
      console.error("JWT decode failed", err);
    }
  }

  // Logged-in user accessing login/signup/home → redirect by role
  if (token && PUBLIC_PATHS.includes(pathname)) {

    if (user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (user?.role === "employee") {
      return NextResponse.redirect(new URL("/employee/dashboard", req.url));
    }

    // fallback if no role
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow public pages + API + static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    PUBLIC_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  //  If not logged in → restrict all protected pages
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/employee/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
};

