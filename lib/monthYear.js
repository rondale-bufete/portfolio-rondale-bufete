export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Descending so the most likely picks (recent years) are at the top.
export function yearOptions(spanBack = 60) {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = current + 1; y >= current - spanBack; y--) years.push(y);
    return years;
}

export function formatMonthYear(month, year) {
    const m = Number(month);
    const y = Number(year);
    if (!m || !y) return "";
    return `${MONTHS[m - 1].slice(0, 3)} ${y}`;
}

// Composes a "Mon YYYY — Mon YYYY" / "Mon YYYY — Present" range string from
// raw form values, used by Experience and Education server actions.
export function composePeriod({ startMonth, startYear, endMonth, endYear, isCurrent }) {
    const start = formatMonthYear(startMonth, startYear);
    const end = isCurrent ? "Present" : formatMonthYear(endMonth, endYear);
    if (!start && !end) return "";
    if (!start) return end;
    if (!end) return start;
    return `${start} — ${end}`;
}

// Splits a textarea's lines into a clean array of bullet strings.
export function parseBullets(raw) {
    return (raw || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}
