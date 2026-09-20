import { NextResponse } from "next/server";
import { expectedSessionToken, timingSafeEqualStrings } from "./lib/session-token";

// Node's crypto (HMAC) isn't available in the default Edge runtime,
// so this middleware explicitly opts into the Node.js runtime.
export const config = {
    matcher: ["/admin/:path*"],
    runtime: "nodejs",
};

const COOKIE_NAME = "admin_session";

export function middleware(request) {
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
