import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminUI =
    pathname.startsWith("/lfi-portal") &&
    !pathname.startsWith("/lfi-portal/login");

  const isProtectedAPI =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login");

  if (isAdminUI || isProtectedAPI) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // No cookie → reject
    if (!token) {
      if (isProtectedAPI) {
        return NextResponse.json(
          { error: "Unauthorized. Admin access required." },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/lfi-portal/login", request.url));
    }

    // Verify JWT signature + expiry
    const payload = await verifyAdminToken(token);

    if (!payload) {
      // Invalid or expired token — clear the bad cookie
      if (isProtectedAPI) {
        const res = NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 }
        );
        res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
        return res;
      }
      const res = NextResponse.redirect(
        new URL("/lfi-portal/login", request.url)
      );
      res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lfi-portal/:path*", "/api/admin/:path*"],
};
