import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SiteSetting from "@/models/SiteSetting";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const count = await SiteSetting.countDocuments();
    return NextResponse.json({
      success: true,
      message: "Database pinged successfully.",
      count,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[Database Keep-Alive Ping Error]:", error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  }
}
