// Pure helpers for the admin charts: rounded axis ticks and compact numbers.

// Ticks from 0 to a rounded maximum: 0 / 5 / 10, 0 / 200 / 400, never 0 / 7 / 14.
export function niceTicks(maxValue, count = 4) {
    if (!Number.isFinite(maxValue) || maxValue <= 0) return [0, 1];
    const rawStep = maxValue / count;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const step = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude).find((candidate) => candidate >= rawStep);
    const roundedStep = step < 1 ? 1 : step;
    const top = Math.ceil(maxValue / roundedStep) * roundedStep;
    return Array.from({ length: Math.round(top / roundedStep) + 1 }, (_, index) => index * roundedStep);
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("en");

// Full numbers below 10,000 (1,284), compact above (12.9K).
export function formatCount(value) {
    return Math.abs(value) < 10_000 ? full.format(value) : compact.format(value);
}

export function shortDate(isoDate) {
    const date = new Date(`${isoDate}T00:00:00Z`);
    return date.toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });
}
