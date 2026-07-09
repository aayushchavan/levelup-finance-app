/**
 * JWT utility using `jose` — works in Next.js Edge Runtime (middleware).
 *
 * Payload: { role: "admin" }
 * Algorithm: HS256
 * Expiry: 7 days
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE_NAME = "admin_token";
const EXPIRES_IN = "7d";
const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment variables");
  return new TextEncoder().encode(secret);
}

/** Sign a new JWT for the admin role */
export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(getSecret());
}

/** Verify a JWT string. Returns the payload or null if invalid/expired. */
export async function verifyAdminToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
