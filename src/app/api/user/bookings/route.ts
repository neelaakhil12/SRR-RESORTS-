import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch bookings for the logged-in email
    const bookings = await Booking.find({ email: session.user.email })
      .sort({ created_at: -1 })
      .lean();

    // Format for the dashboard
    const formattedBookings = bookings.map((bkg: any) => ({
      ...bkg,
      id: bkg._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(formattedBookings, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Booking fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
