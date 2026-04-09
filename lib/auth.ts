import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getSecretKey() {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is not defined");
    }
    return new TextEncoder().encode("dfault-secret-key-for-development");
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: any) {
  const key = getSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const key = getSecretKey();
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(user: any) {
  // Create the session
  const expires = new Date(Date.now() + 120 * 60 * 1000); // 2 hours
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await cookies()).set("session", session, { expires, httpOnly: true, secure: process.env.NODE_ENV === "production" });
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 120 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
