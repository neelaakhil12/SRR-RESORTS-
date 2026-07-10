import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("srr_super_session");
  cookieStore.delete("srr_employee_session");
  cookieStore.delete("srr_admin_session"); // backward compatibility cleanup
  
  return NextResponse.json({ success: true });
}
