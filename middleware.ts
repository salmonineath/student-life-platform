import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/forget-password"];
const protechtedRoutes = ["/dashboard"];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protechtedRoutes.includes("/dashboard");

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
};
