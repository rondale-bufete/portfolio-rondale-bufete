import crypto from "crypto";

// The token never encodes anything secret — it's just proof the browser
// received a Set-Cookie after a correct password check. Shared by
// lib/auth.js (Server Components/Actions, uses next/headers cookies()) and
// middleware.js (uses request.cookies instead) so the two never drift out
// of sync on how the token is derived.
const SESSION_CLAIM = "admin-authenticated";

export function expectedSessionToken() {
    return crypto
        .createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
        .update(SESSION_CLAIM)
        .digest("hex");
}

// Constant-time string comparison — plain `===` short-circuits on the
// first differing byte, which leaks how much of a guess was correct via
// response timing. Buffers of unequal length would throw in
// crypto.timingSafeEqual, so those are rejected first (a length mismatch
// itself is not sensitive information).
export function timingSafeEqualStrings(a, b) {
    const bufA = Buffer.from(a ?? "");
    const bufB = Buffer.from(b ?? "");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}
