import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PasswordResetToken from "@/models/PasswordResetToken";
import SuperAdmin from "@/models/SuperAdmin";
import SiteSetting from "@/models/SiteSetting";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find and validate token
    const resetRecord = await PasswordResetToken.findOne({ token });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      await PasswordResetToken.deleteOne({ token });
      return NextResponse.json(
        { error: "This password reset link has expired." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = hashPassword(newPassword);

    // Save customized password hash in SuperAdmin database collection
    await SuperAdmin.findOneAndUpdate(
      { email: resetRecord.email.toLowerCase() },
      { email: resetRecord.email.toLowerCase(), passwordHash: hashedPassword },
      { upsert: true, new: true }
    );

    // Also update SiteSetting for backward compatibility
    await SiteSetting.findOneAndUpdate(
      { key: "super_admin_password_hash" },
      { value: hashedPassword },
      { upsert: true, new: true }
    );

    // Clean up used token
    await PasswordResetToken.deleteOne({ token });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
