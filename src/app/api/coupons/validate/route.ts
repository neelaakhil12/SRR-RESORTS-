import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
