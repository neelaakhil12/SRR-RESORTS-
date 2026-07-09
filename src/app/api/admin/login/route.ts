import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import AssistantAdmin from "@/models/AssistantAdmin";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, requiredRole } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "srrresorts@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "SRRAdmin2024!";

    let sessionValue = "";
    let role = "";

    // 1. Check Super Admin credentials
    if (email === adminEmail && password === adminPassword) {
      if (requiredRole && requiredRole !== "super") {
        return NextResponse.json(
          { error: "This portal is restricted to employee login only." },
          { status: 401 }
        );
      }
      sessionValue = `super:${adminEmail}`;
      role = "super";
    } else {
      // 2. Check Assistant Admin in database
      await dbConnect();
      const assistant = await AssistantAdmin.findOne({ email });
      if (assistant && verifyPassword(password, assistant.passwordHash)) {
        if (requiredRole && requiredRole !== "assistant") {
          return NextResponse.json(
            { error: "This portal is restricted to Super Admin login only." },
            { status: 401 }
          );
        }
        sessionValue = `assistant:${assistant.email}`;
        role = "assistant";
      }
    }

    if (sessionValue) {
      // Set a secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("srr_admin_session", sessionValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return NextResponse.json({ success: true, role });
    }

    return NextResponse.json(
      { error: "Invalid login credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

