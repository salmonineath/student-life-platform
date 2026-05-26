// import { NextRequest, NextResponse } from "next/server";

// const publicRoutes = [
//   "/",
//   "/student-life",
//   "/login",
//   "/register",
//   "/forget-password",
//   "/reset-password",
// ];

// const protectedRoutes = [
//   "/dashboard",
//   "/profile",
//   "/schedule",
//   "/assignment",
//   "/notes",
//   "/study-group",
//   "/ai-chat",
//   "/settings",
// ];

// export const middleware = (request: NextRequest) => {
//   const { pathname } = request.nextUrl;

//   // Just check existence — Spring validates the actual token on every API call
//   const hasRefreshToken = !!request.cookies.get("refreshToken")?.value;

//   const isPublicRoute = publicRoutes.some((route) => pathname === route);
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   if (!isPublicRoute && !isProtectedRoute) {
//     return NextResponse.next();
//   }

//   // Authenticated + public route → dashboard
//   if (hasRefreshToken && isPublicRoute) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Not authenticated + protected route → login
//   if (!hasRefreshToken && isProtectedRoute) {
//     const response = NextResponse.redirect(new URL("/login", request.url));
//     response.cookies.delete("refreshToken");
//     return response;
//   }

//   return NextResponse.next();
// };

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
// };

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

  // We can't read localStorage in middleware (server-side),
  // so on login success we set a lightweight "isLoggedIn" cookie as a flag.
  // The real token lives in localStorage and is used by axios on the client.
  const isLoggedIn = !!request.cookies.get("isLoggedIn")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Authenticated + public route → dashboard
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not authenticated + protected route → login
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};