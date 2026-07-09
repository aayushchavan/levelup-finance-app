import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE_NAME } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Generate a signed JWT (expires in 7 days)
  const token = await signAdminToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,                                    // JS cannot read this cookie
    secure: process.env.NODE_ENV === "production",     // HTTPS only in prod
    sameSite: "strict",                                // No cross-site requests
    maxAge: 60 * 60 * 24 * 7,                         // 7 days
    path: "/",
  });

  return response;
}
