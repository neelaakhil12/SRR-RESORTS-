import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import { format } from "date-fns";

export async function GET() {
  try {
    await dbConnect();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // 1. Daily Bookings count
    // Filter by 'date' field (YYYY-MM-DD) or 'created_at' timestamp
    // For consistency with specific queries, using the 'date' field
    const dailyBookingsCount = await Booking.countDocuments({
        created_at: {
            $gte: new Date(`${todayStr}T00:00:00Z`),
            $lte: new Date(`${todayStr}T23:59:59Z`)
        }
    });

    // 2. Daily Revenue
    const revenueData = await Booking.find({
      payment_status: "PAID",
      created_at: {
        $gte: new Date(`${todayStr}T00:00:00Z`),
        $lte: new Date(`${todayStr}T23:59:59Z`)
      }
    }).select("total_amount").lean();

    const dailyRevenue = revenueData.reduce((acc, curr: any) => acc + (Number(curr.total_amount) || 0), 0);

    // 3. Pending Payments
    const pendingPaymentsCount = await Booking.countDocuments({
      payment_status: "PENDING"
    });

    // 4. Total Bookings (All time)
    const totalBookingsCount = await Booking.countDocuments();

    return NextResponse.json({
      dailyBookings: dailyBookingsCount,
      dailyRevenue,
      pendingPayments: pendingPaymentsCount,
      totalBookings: totalBookingsCount
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
