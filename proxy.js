import { NextResponse } from "next/server";
import { expectedSessionToken, timingSafeEqualStrings } from "./lib/session-token";

// Next.js 16 runs this proxy on Node.js; setting a runtime option would throw.
export const config = {
    matcher: ["/admin/:path*"],
};

const COOKIE_NAME = "admin_session";

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // Always allow access to the login page.
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    const authed = Boolean(token) && timingSafeEqualStrings(token, expectedSessionToken());

    if (!authed) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
