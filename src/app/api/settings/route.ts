import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SiteSetting from "@/models/SiteSetting";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const setting = await SiteSetting.findOne({ key }).lean();
    
    // Safety check: only allow certain keys to be fetched publicly
    const allowedKeys = ["announcement", "hero"]; 
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: "Unauthorized key" }, { status: 403 });
    }

    return NextResponse.json(setting || { key, value: null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
