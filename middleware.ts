import { NextRequest, NextResponse } from "next/server";
import { isValidToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname === "/api/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("dash_auth")?.value;
  if (await isValidToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|_vendor|01-vazamento-telefonia).*)"],
};
