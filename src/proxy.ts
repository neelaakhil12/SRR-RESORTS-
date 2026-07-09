import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all /admin (UI) routes
  if (pathname.startsWith("/admin") && pathname !== "/employeelogin") {
    const adminSession = request.cookies.get("srr_admin_session")?.value;

    // If no valid session, redirect to admin-login
    if (!adminSession) {
      const loginUrl = new URL("/employeelogin", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const [role] = adminSession.split(":");

    // Assistant admin can ONLY access booking page
    if (role === "assistant") {
      const isBookingPath = pathname === "/admin/bookings" || pathname.startsWith("/admin/bookings/");
      if (!isBookingPath) {
        // Redirect assistant admin to bookings page if trying to access other dashboard areas
        return NextResponse.redirect(new URL("/admin/bookings", request.url));
      }
    } else if (role !== "super") {
      // Invalid session value, redirect to login
      const loginUrl = new URL("/employeelogin", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("srr_admin_session");
      return response;
    }
  }

  // 2. Protect backend APIs (/api/admin/*)
  // Skip /api/admin/login and /api/admin/logout as they handle auth flow
  // Also allow public GET requests to gallery & services so visitors can see live items & prices
  if (
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/logout" &&
    !(pathname === "/api/admin/gallery" && request.method === "GET") &&
    !(pathname === "/api/admin/services" && request.method === "GET") &&
    !(pathname === "/api/admin/coupons" && request.method === "GET")
  ) {
    const adminSession = request.cookies.get("srr_admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [role] = adminSession.split(":");

    if (role === "assistant") {
      // Allowed APIs for Assistant Admin (Bookings-related & file uploads)
      const isAllowedApi =
        pathname === "/api/admin/profile" ||
        pathname === "/api/admin/bookings" ||
        pathname.startsWith("/api/admin/bookings/") ||
        pathname === "/api/admin/upload" ||
        pathname === "/api/admin/aadhar-download";

      if (!isAllowedApi) {
        return NextResponse.json(
          { error: "Forbidden: Access restricted to bookings only" },
          { status: 403 }
        );
      }
    } else if (role !== "super") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 3. Handle /employeelogin or /superadminlogin redirection if already logged in
  if (pathname === "/employeelogin" || pathname === "/superadminlogin") {
    const adminSession = request.cookies.get("srr_admin_session")?.value;
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
