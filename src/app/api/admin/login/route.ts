import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "srrresorts@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "SRRAdmin2024!";

    if (email === adminEmail && password === adminPassword) {
      // Set a secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("srr_admin_session", "verified_owner", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid admin password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
