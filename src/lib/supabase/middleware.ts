import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Get the token from the Authorization header or cookie
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ||
    request.cookies.get("sb-access-token")?.value;

  if (!token) {
    // If accessing protected routes without token, redirect to login
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Verify the token
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

function isProtectedRoute(pathname: string): boolean {
  const publicRoutes = ["/login", "/register", "/forgot-password", "/api/auth"];
  return !publicRoutes.some((route) => pathname.startsWith(route));
}
