import { NextRequest, NextResponse } from "next/server";
import { tokenFor } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/");
  const expected = process.env.DASHBOARD_PASSWORD;

  if (!expected || password !== expected) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("from", from);
    return NextResponse.redirect(url, { status: 303 });
  }

  const res = NextResponse.redirect(new URL(from || "/", req.url), { status: 303 });
  res.cookies.set("dash_auth", await tokenFor(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
