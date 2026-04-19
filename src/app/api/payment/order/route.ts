import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(request: Request) {
  try {
    const { amount, currency, bookingId } = await request.json();

    if (!amount || !bookingId) {
      return NextResponse.json({ error: "Amount and Booking ID are required" }, { status: 400 });
    }

    await dbConnect();

    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paisa
      currency: currency || "INR",
      receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    // Store order ID in the booking
    await Booking.findByIdAndUpdate(bookingId, {
      razorpay_order_id: order.id,
      total_amount: amount, // Update/confirm total amount
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
