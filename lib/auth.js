import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(value) {
    return crypto
        .createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
        .update(value)
        .digest("hex");
}

// The token never encodes anything secret — it's just proof the browser
// received a Set-Cookie after a correct password check.
function expectedToken() {
    return sign("admin-authenticated");
}

export function checkPassword(password) {
    return password === process.env.ADMIN_PASSWORD;
}

export async function createSession() {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, expectedToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function isAuthed() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return Boolean(token) && token === expectedToken();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
