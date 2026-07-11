import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import PasswordResetToken from "@/models/PasswordResetToken";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "srrresorts@gmail.com";

    // Verify it is the super admin email
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "This email is not registered as Super Admin." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 3600000);

    // Save token to DB (upsert if they requested multiple times)
    await PasswordResetToken.findOneAndUpdate(
      { email: email.toLowerCase() },
      { token, expiresAt },
      { upsert: true, new: true }
    );

    const origin = new URL(request.url).origin;

    // Send the email
    const emailSent = await sendPasswordResetEmail(email.toLowerCase(), token, origin);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send password reset email. Please check SMTP settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Reset link sent successfully." });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
