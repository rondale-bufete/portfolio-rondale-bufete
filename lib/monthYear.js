export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Convert native YYYY-MM picker values to and from the database's date labels.

// Format YYYY-MM as a month and year; return an empty string for invalid input.
export function monthValueToDisplay(value) {
    const match = value?.match(/^(\d{4})-(\d{2})$/);
    if (!match) return "";
    const month = Number(match[2]);
    if (month < 1 || month > 12) return "";
    return `${MONTHS[month - 1].slice(0, 3)} ${match[1]}`;
}

// Parse existing month/year labels, falling back to a bare year for legacy values.
export function displayToMonthValue(display) {
    if (!display) return "";
    const full = display.match(/([A-Za-z]{3,9})\s+(\d{4})/);
    if (full) {
        const idx = MONTHS.findIndex((m) => m.toLowerCase().startsWith(full[1].toLowerCase().slice(0, 3)));
        if (idx !== -1) return `${full[2]}-${String(idx + 1).padStart(2, "0")}`;
    }
    const yearOnly = display.match(/(\d{4})/);
    return yearOnly ? `${yearOnly[1]}-01` : "";
}

// Parse a stored date range for the Experience and Education pickers.
export function splitPeriod(period) {
    if (!period) return { start: "", end: "", isCurrent: false };
    const [startRaw, endRaw] = period.split("—").map((s) => s?.trim());
    const isCurrent = endRaw?.toLowerCase() === "present";
    return {
        start: displayToMonthValue(startRaw),
        end: isCurrent ? "" : displayToMonthValue(endRaw),
        isCurrent,
    };
}

// Build a stored date range from picker values for Experience and Education.
export function composePeriod({ start, end, isCurrent }) {
    const startDisplay = monthValueToDisplay(start);
    const endDisplay = isCurrent ? "Present" : monthValueToDisplay(end);
    if (!startDisplay && !endDisplay) return "";
    if (!startDisplay) return endDisplay;
    if (!endDisplay) return startDisplay;
    return `${startDisplay} — ${endDisplay}`;
}

// Convert textarea lines into a clean bullet list.
export function parseBullets(raw) {
    return (raw || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}
