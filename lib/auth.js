import { cookies } from "next/headers";
import { expectedSessionToken, timingSafeEqualStrings } from "./session-token";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function checkPassword(password) {
    return timingSafeEqualStrings(password, process.env.ADMIN_PASSWORD);
}

export async function createSession() {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, expectedSessionToken(), {
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
    return Boolean(token) && timingSafeEqualStrings(token, expectedSessionToken());
}

// Every exported server action under app/admin/actions/** calls this
// first. Middleware already gates page navigation to /admin/**, but
// Server Actions are their own endpoints — this is the defense-in-depth
// check so a middleware config regression can't turn into an
// unauthenticated write/delete path.
export async function requireAdmin() {
    if (!(await isAuthed())) {
        throw new Error("Unauthorized.");
    }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
