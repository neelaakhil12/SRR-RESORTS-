import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export const dynamic = "force-dynamic";

// GET all coupons
export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find().sort({ created_at: -1 }).lean();
    const formatted = coupons.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      _id: undefined,
    }));
    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new coupon
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Normalize code to uppercase
    if (body.code) body.code = body.code.toUpperCase().trim();
    
    const coupon = await Coupon.create(body);
    return NextResponse.json({
      ...coupon.toObject(),
      id: coupon._id.toString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE coupon
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
