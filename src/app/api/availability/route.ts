import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const type = searchParams.get("type"); // "ROOM" or "HALL"

  if (!date || !type) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    if (type === "ROOM") {
      // Query confirmed bookings that overlap with the selected date
      // Assuming 'start_date' and 'end_date' store the booking range
      const { data, error } = await supabase
        .from("bookings")
        .select("items")
        .eq("booking_type", "ROOM")
        .eq("status", "CONFIRMED")
        .lte("start_date", date)
        .gte("end_date", date);

      if (error) throw error;

      // Flatten items array to get all booked rooms
      const bookedRooms = data.map(b => b.items).flat();
      return NextResponse.json({ bookedRooms });
    } 
    
    if (type === "HALL") {
      // Query confirmed hall bookings for the specified date
      const { data, error } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("booking_type", "HALL")
        .eq("status", "CONFIRMED")
        // In reality, you'd match the date part of the timestamp
        // Here we just pull all hall bookings and filter/format later or use advanced PostgREST syntax
        .gte("start_date", `${date}T00:00:00.000Z`)
        .lte("end_date", `${date}T23:59:59.999Z`);
        
      if (error) throw error;

      return NextResponse.json({ bookedSlots: data });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
