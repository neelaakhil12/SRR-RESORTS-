import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import { sendBookingConfirmation } from "@/lib/email";

export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find().sort({ created_at: -1 }).lean();
    
    const formattedBookings = bookings.map((b: any) => ({
      ...b,
      id: b._id.toString(),
      _id: undefined,
      start_date: b.start_date || b.date || "", // Fallback for admin panel compatibility
      end_date: b.end_date || b.date || ""
    }));

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const booking = await Booking.create(body);
    
    const formattedData = {
      ...booking.toObject(),
      id: booking._id.toString()
    };

    // Trigger confirmation email
    // We don't await this to avoid slowing down the response
    sendBookingConfirmation(formattedData);

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedBooking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const formattedData = {
      ...updatedBooking.toObject(),
      id: updatedBooking._id.toString()
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
