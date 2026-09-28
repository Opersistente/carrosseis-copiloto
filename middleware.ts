import { NextRequest, NextResponse } from "next/server";

const SALT = "carrosseis-copiloto-dash-v1";

async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isValidToken(token: string | undefined): Promise<boolean> {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected || !token) return false;
  return token === (await tokenFor(expected));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname === "/api/login" || pathname === "/api/intake" || pathname === "/api/instagram/webhook") {
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
