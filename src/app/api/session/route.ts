import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function isHttps(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-proto") === "https" ||
    process.env.NODE_ENV === "production"
  );
}

export async function POST(req: NextRequest) {
  (await cookies()).set("isLoggedIn", "true", {
    httpOnly: true,
    secure: isHttps(req),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  (await cookies()).set("isLoggedIn", "", {
    httpOnly: true,
    secure: isHttps(req),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
