import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SiteSetting from "@/models/SiteSetting";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await SiteSetting.findOne({ key }).lean();
      return NextResponse.json(setting || {});
    }

    const settings = await SiteSetting.find().lean();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) return NextResponse.json({ error: "Key and Value are required" }, { status: 400 });

    const setting = await SiteSetting.findOneAndUpdate(
      { key },
      { key, value, updated_at: new Date() },
      { new: true, upsert: true } // Creates it if it doesn't exist
    );

    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
