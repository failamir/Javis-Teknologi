import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
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
