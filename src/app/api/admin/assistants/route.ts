import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import AssistantAdmin from "@/models/AssistantAdmin";
import { hashPassword } from "@/lib/auth";

/**
 * Helper to verify that the requesting session belongs to the Super Admin.
 */
async function verifySuperAdmin() {
  try {
    const cookieStore = await cookies();
    const session = 
      cookieStore.get("srr_super_session")?.value ||
      cookieStore.get("srr_admin_session")?.value;
    if (!session) return false;
    const [role] = session.split(":");
    return role === "super";
  } catch (error) {
    return false;
  }
}

/**
 * GET: List all assistant admins. (Super Admin only)
 */
export async function GET() {
  try {
    if (!(await verifySuperAdmin())) {
      return NextResponse.json({ error: "Forbidden: Super Admin access only" }, { status: 403 });
    }

    await dbConnect();
    const assistants = await AssistantAdmin.find({})
      .select("_id name email created_at")
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json(assistants);
  } catch (error: any) {
    console.error("List assistants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST: Create a new assistant admin. (Super Admin only)
 */
export async function POST(request: Request) {
  try {
    if (!(await verifySuperAdmin())) {
      return NextResponse.json({ error: "Forbidden: Super Admin access only" }, { status: 403 });
    }

    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if email already exists (super admin email or database assistant admin)
    const adminEmail = process.env.ADMIN_EMAIL || "srrresorts@gmail.com";
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      return NextResponse.json({ error: "Email matches Super Admin and cannot be used" }, { status: 400 });
    }

    const existing = await AssistantAdmin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const newAssistant = await AssistantAdmin.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    return NextResponse.json({ success: true, id: newAssistant._id });
  } catch (error: any) {
    console.error("Create assistant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE: Delete an assistant admin by ID. (Super Admin only)
 */
export async function DELETE(request: Request) {
  try {
    if (!(await verifySuperAdmin())) {
      return NextResponse.json({ error: "Forbidden: Super Admin access only" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing account ID" }, { status: 400 });
    }

    await dbConnect();
    const deleted = await AssistantAdmin.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Assistant admin account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete assistant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
