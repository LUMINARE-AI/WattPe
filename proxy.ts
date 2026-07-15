import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { hasAdminAccess, hasFinanceAccess } from "@/lib/rbac";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && !hasAdminAccess(role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
  }

  if (pathname.startsWith("/finance") && !hasFinanceAccess(role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/finance/:path*"],
};
