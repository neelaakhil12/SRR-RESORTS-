import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all /admin (UI) routes
  if (pathname.startsWith("/admin")) {
    const isBookingPath = pathname === "/admin/bookings" || pathname.startsWith("/admin/bookings/");
    
    // Check role-specific cookies first, fallback to the old unified one
    let adminSession = request.cookies.get("srr_super_session")?.value;
    if (isBookingPath && !adminSession) {
      adminSession = request.cookies.get("srr_employee_session")?.value;
    }
    
    // Fallback lookup
    if (!adminSession) {
      adminSession = request.cookies.get("srr_admin_session")?.value;
    }

    // If no valid session, redirect to the appropriate login page
    if (!adminSession) {
      const loginUrl = new URL(isBookingPath ? "/employeelogin" : "/superadminlogin", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const [role] = adminSession.split(":");

    // Assistant admin can ONLY access booking page
    if (role === "assistant" && !isBookingPath) {
      // Redirect assistant admin to bookings page if trying to access other dashboard areas
      return NextResponse.redirect(new URL("/admin/bookings", request.url));
    }
  }

  // 2. Protect backend APIs (/api/admin/*)
  // Skip public/auth endpoints
  if (
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/logout" &&
    pathname !== "/api/admin/forgot-password" &&
    pathname !== "/api/admin/reset-password" &&
    !(pathname === "/api/admin/gallery" && request.method === "GET") &&
    !(pathname === "/api/admin/services" && request.method === "GET") &&
    !(pathname === "/api/admin/coupons" && request.method === "GET")
  ) {
    const isAssistantApi =
      pathname === "/api/admin/profile" ||
      pathname === "/api/admin/bookings" ||
      pathname.startsWith("/api/admin/bookings/") ||
      pathname === "/api/admin/upload" ||
      pathname === "/api/admin/aadhar-download";

    let adminSession = request.cookies.get("srr_super_session")?.value;
    if (isAssistantApi && !adminSession) {
      adminSession = request.cookies.get("srr_employee_session")?.value;
    }
    
    // Fallback
    if (!adminSession) {
      adminSession = request.cookies.get("srr_admin_session")?.value;
    }

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [role] = adminSession.split(":");

    if (role === "assistant" && !isAssistantApi) {
      return NextResponse.json(
        { error: "Forbidden: Access restricted to bookings only" },
        { status: 403 }
      );
    }
  }

  // 3. Handle /employeelogin or /superadminlogin redirection if already logged in
  if (pathname === "/employeelogin" || pathname === "/superadminlogin") {
    const superSession = request.cookies.get("srr_super_session")?.value;
    const employeeSession = request.cookies.get("srr_employee_session")?.value;
    const oldSession = request.cookies.get("srr_admin_session")?.value;

    const adminSession = superSession || employeeSession || oldSession;

    if (adminSession) {
      const [role] = adminSession.split(":");
      if (role === "super") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (role === "assistant") {
        return NextResponse.redirect(new URL("/admin/bookings", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employeelogin",
    "/superadminlogin",
    "/api/admin/:path*",
  ],
};
