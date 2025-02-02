import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const adminLoggedIn = request.cookies.get("adminLoggedIn")?.value === "true"

  if (request.nextUrl.pathname.startsWith("/admin") && !adminLoggedIn && request.nextUrl.pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (request.nextUrl.pathname === "/admin/login" && adminLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

