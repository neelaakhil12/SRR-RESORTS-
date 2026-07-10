import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import AssistantAdmin from "@/models/AssistantAdmin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = 
      cookieStore.get("srr_super_session")?.value ||
      cookieStore.get("srr_employee_session")?.value ||
      cookieStore.get("srr_admin_session")?.value;

    console.log("[Profile API] Cookie session value:", adminSession);

    if (!adminSession) {
      console.log("[Profile API] No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [role, email] = adminSession.split(":");
    console.log("[Profile API] Parsed session role:", role, "email:", email);
    if (!role || !email) {
      console.log("[Profile API] Invalid session format");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (role === "super") {
      return NextResponse.json({ role: "super", email, name: "Super Admin" });
    } else if (role === "assistant") {
      await dbConnect();
      console.log("[Profile API] Connecting database and searching for assistant:", email);
      const assistant = await AssistantAdmin.findOne({ email }).select("name email").lean();
      console.log("[Profile API] DB Query result:", assistant);
      if (!assistant) {
        console.log("[Profile API] Assistant not found in database for email:", email);
        return NextResponse.json({ error: "Assistant admin not found" }, { status: 404 });
      }
      return NextResponse.json({
        role: "assistant",
        email: (assistant as any).email,
        name: (assistant as any).name,
      });
    }

    console.log("[Profile API] Invalid role type:", role);
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error: any) {
    console.error("[Profile API] Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
