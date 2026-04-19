import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json({ error: "Missing required verification parameters" }, { status: 400 });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed: Invalid signature" }, { status: 400 });
    }

    await dbConnect();

    // Update booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        payment_status: "PAID",
        status: "CONFIRMED",
        razorpay_payment_id,
        razorpay_signature,
        payment_method: "ONLINE",
      },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found during verification" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified successfully",
      booking: updatedBooking 
    });
  } catch (error: any) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
