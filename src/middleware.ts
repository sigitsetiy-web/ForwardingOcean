import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes — no auth needed
  const publicRoutes = ["/login", "/register", "/guide", "/api/auth/login", "/api/auth/logout", "/api/cron"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Static assets — skip
  if (pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check auth cookie for protected pages (not API)
  if (!pathname.startsWith("/api/")) {
    const userId = request.cookies.get("fms_user_id")?.value;
    if (!userId && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
