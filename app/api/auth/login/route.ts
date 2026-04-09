import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Simple in-memory rate limiting for development/small projects.
// In a large-scale production app, use Redis or Upstash for distributed rate limiting.
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    
    // Rate Limiting Logic
    const stats = loginAttempts.get(ip);
    if (stats) {
      if (now - stats.lastAttempt < WINDOW_MS) {
        if (stats.count >= MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: "Too many login attempts. Please try again in 1 minute." },
            { status: 429 }
          );
        }
        stats.count++;
      } else {
        // Reset window
        stats.count = 1;
        stats.lastAttempt = now;
      }
    } else {
      loginAttempts.set(ip, { count: 1, lastAttempt: now });
    }

    const { identifier: rawIdentifier, password } = await request.json();
    const identifier = rawIdentifier.trim();

    // Check database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await login(user);

    return NextResponse.json({ 
      message: "Login successful", 
      user: { username: user.username, email: user.email } 
    });
  } catch (error) {
    console.error("Login attempt failed:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
