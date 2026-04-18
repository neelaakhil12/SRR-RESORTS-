import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import OTP from "@/models/OTP";
import nodemailer from "nodemailer";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await dbConnect();

    // Generate random 6 digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update or create OTP for this email
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"SRR Resorts" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Your Login OTP Code - SRR Resorts",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 20px;">
              <h2 style="color: #0b1a10;">Welcome back!</h2>
              <p style="color: #666;">Use the following 6-digit code to complete your login.</p>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #0b1a10;">${otpCode}</span>
              </div>
              <p style="color: #999; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        });
    } else {
        console.warn(`OTP for ${email}: ${otpCode} (SMTP credentials missing)`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
