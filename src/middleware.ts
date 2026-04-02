import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
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

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasSession = accessToken || refreshToken;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Has a session and tries to visit a public page → go to dashboard
  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // No session at all and tries to visit a protected page → go to login
  if (!hasSession && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
