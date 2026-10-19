import { NextResponse } from "next/server";
import { expectedSessionToken, timingSafeEqualStrings } from "./lib/session-token";

// Proxy always runs on Node.js in Next 16, so Node's crypto (HMAC) is
// available here; a `runtime` option would throw.
export const config = {
    matcher: ["/admin/:path*"],
};

const COOKIE_NAME = "admin_session";

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // Let the login page itself through, always.
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
