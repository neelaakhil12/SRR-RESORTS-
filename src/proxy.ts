import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const adminSession = request.cookies.get("srr_admin_session");

    // If no valid session, redirect to admin-login
    if (!adminSession || adminSession.value !== "verified_owner") {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle case where user tries to go to /admin-login while already logged in as admin
  if (pathname === "/admin-login") {
    const adminSession = request.cookies.get("srr_admin_session");
    if (adminSession?.value === "verified_owner") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin-login",
  ],
};
