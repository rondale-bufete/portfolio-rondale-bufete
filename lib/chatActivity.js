import { supabaseAdmin } from "@/lib/supabase/admin";

// chat_rate_limits keeps one row per chat session per day with the number of
// questions asked, which is all the dashboard needs: questions and conversations.
export function summarizeChatRows(rows, dates) {
    const byDate = new Map(dates.map((date) => [date, { date, questions: 0, conversations: 0 }]));
    for (const row of rows) {
        const day = byDate.get(String(row.day).slice(0, 10));
        if (!day) continue;
        day.questions += Number(row.count) || 0;
        day.conversations += 1;
    }
    const daily = [...byDate.values()];
    return {
        daily,
        questions: daily.reduce((total, day) => total + day.questions, 0),
        conversations: daily.reduce((total, day) => total + day.conversations, 0),
    };
}

export async function getChatActivity(windows) {
    const { data, error } = await supabaseAdmin
        .from("chat_rate_limits")
        .select("day, count")
        .gte("day", windows.previous.since)
        .lte("day", windows.current.until);

    if (error) return { available: false, message: error.message };

    const rows = data ?? [];
    return {
        available: true,
        current: summarizeChatRows(rows, windows.current.dates),
        previous: summarizeChatRows(rows, windows.previous.dates),
    };
}
