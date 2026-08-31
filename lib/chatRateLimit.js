import { supabaseAdmin } from "@/lib/supabase/admin";

const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT) || 15;

function todayKey() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// Returns { allowed, remaining }. Reads then writes rather than an atomic
// increment — not perfectly race-safe under concurrent requests from the
// exact same visitor within the same second, which is an acceptable
// tradeoff for a low-traffic portfolio chatbot rather than adding a
// Postgres function for this.
export async function checkAndIncrementRateLimit(sessionId) {
    const day = todayKey();

    const { data: existing, error: readError } = await supabaseAdmin
        .from("chat_rate_limits")
        .select("count")
        .eq("session_id", sessionId)
        .eq("day", day)
        .maybeSingle();
    if (readError) throw new Error(readError.message);

    const currentCount = existing?.count || 0;
    if (currentCount >= DAILY_LIMIT) {
        return { allowed: false, remaining: 0 };
    }

    const { error: writeError } = await supabaseAdmin
        .from("chat_rate_limits")
        .upsert(
            { session_id: sessionId, day, count: currentCount + 1 },
            { onConflict: "session_id,day" }
        );
    if (writeError) throw new Error(writeError.message);

    return { allowed: true, remaining: DAILY_LIMIT - (currentCount + 1) };
}
