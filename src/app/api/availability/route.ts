import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const type = searchParams.get("type"); // "ROOM" or "HALL"

  if (!date || !type) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Query confirmed bookings for the specified date
    const bookings = await Booking.find({
      date: date,
      status: "CONFIRMED"
    }).lean();

    // In this simplified version, we return all booked slots/items for that date
    // You might need to filter by service type if your service IDs are categorized
    return NextResponse.json({ 
        bookings,
        count: bookings.length
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
