import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/student-life",
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
];

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/schedule",
  "/assignment",
  "/notes",
  "/study-group",
  "/ai-chat",
  "/settings",
];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Just check existence — Spring validates the actual token on every API call
  const hasRefreshToken = !!request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Authenticated + public route → dashboard
  if (hasRefreshToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not authenticated + protected route → login
  if (!hasRefreshToken && isProtectedRoute) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("refreshToken");
    return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
