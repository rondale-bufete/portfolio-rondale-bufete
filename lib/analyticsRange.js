// Date windows shared by the admin dashboard's traffic and chat numbers.
// Days are UTC, matching Vercel Web Analytics' reporting.
export const RANGE_OPTIONS = [7, 30];
const DAY_MS = 86_400_000;

export function parseRange(value) {
    return RANGE_OPTIONS.includes(Number(value)) ? Number(value) : RANGE_OPTIONS[0];
}

function isoDay(time) {
    return new Date(time).toISOString().slice(0, 10);
}

function daysFrom(startTime, length) {
    return Array.from({ length }, (_, index) => isoDay(startTime + index * DAY_MS));
}

// The current window ends today; the previous one is the same length just before it.
export function rangeWindows(days, now = new Date()) {
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const currentStart = today - (days - 1) * DAY_MS;
    const previousStart = currentStart - days * DAY_MS;

    return {
        days,
        current: { since: isoDay(currentStart), until: isoDay(today), dates: daysFrom(currentStart, days) },
        previous: { since: isoDay(previousStart), until: isoDay(currentStart - DAY_MS), dates: daysFrom(previousStart, days) },
    };
}

// Percent change, or null when there's nothing to compare against.
export function percentChange(current, previous) {
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return null;
    return Math.round(((current - previous) / previous) * 100);
}
