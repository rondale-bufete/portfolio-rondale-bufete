import crypto from "crypto";

// Share token derivation between auth actions and the request proxy.
const SESSION_CLAIM = "admin-authenticated";

export function expectedSessionToken() {
    return crypto
        .createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
        .update(SESSION_CLAIM)
        .digest("hex");
}

// Compare tokens in constant time after rejecting unequal lengths.
export function timingSafeEqualStrings(a, b) {
    const bufA = Buffer.from(a ?? "");
    const bufB = Buffer.from(b ?? "");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}
