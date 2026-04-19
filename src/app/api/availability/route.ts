import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const startDate = searchParams.get("startDate") || date;
  const endDate = searchParams.get("endDate") || date || startDate;
  const startTime = searchParams.get("startTime") || "06:00";
  const endTime = searchParams.get("endTime") || "22:00";
  const type = searchParams.get("type"); // "ROOM" or "HALL" or "HOUSE"

  if (!startDate || !endDate || !type) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Build query to find bookings that might overlap with requested range
    const query: any = {
      status: { $in: ["CONFIRMED", "PENDING"] },
      $or: [
        { date: { $gte: startDate, $lte: endDate } }, // Single day match
        { 
          start_date: { $lte: endDate },
          end_date: { $gte: startDate }
        } // Stay range match
      ]
    };
    
    if (type !== 'ALL') {
      query.service_type = type;
    }

    const bookings = await Booking.find(query).lean();

    // Helper to create comparable timestamps
    const toTimestamp = (d: string, t: string = "00:00") => {
      return `${d}T${t}`;
    };

    const reqStart = toTimestamp(startDate!, startTime);
    const reqEnd = toTimestamp(endDate!, endTime);

    const activeBookings = bookings.filter((b: any) => {
      // 1. Leisure/Hourly check
      if (b.time_slot && (b.date || b.start_date)) {
        const bDate = b.date || b.start_date;
        const [time, period] = b.time_slot.split(' ');
        let hour = parseInt(time.split(':')[0]);
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const bStart = toTimestamp(bDate, `${hour.toString().padStart(2, '0')}:00`);
        const duration = b.duration || 1;
        const bEnd = toTimestamp(bDate, `${(hour + duration).toString().padStart(2, '0')}:00`);
        
        return bStart < reqEnd && bEnd > reqStart;
      }

      // 2. Stay check (Room/House)
      const bStart = toTimestamp(b.start_date || b.date, b.check_in_time || "06:00");
      const bEnd = toTimestamp(b.end_date || b.date, b.check_out_time || "22:00");

      return bStart < reqEnd && bEnd > reqStart;
    });

    return NextResponse.json({ 
        bookings: activeBookings.map((b: any) => ({
          id: b._id,
          items: b.items,
          time_slot: b.time_slot,
          duration: b.duration || 1,
          service_type: b.service_type,
          start_date: b.start_date || b.date,
          end_date: b.end_date || b.date,
          check_in_time: b.check_in_time,
          check_out_time: b.check_out_time
        })),
        count: activeBookings.length
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
