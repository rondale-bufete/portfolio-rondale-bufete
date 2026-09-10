export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Everything below speaks the native <input type="month"> value shape
// ("YYYY-MM") on one side, and the human-readable display strings actually
// stored in the database ("Sep 2026", "Jan 2024 — Apr 2026", "... — Present")
// on the other. The admin forms only ever handle "YYYY-MM" values — there is
// no month/year pair to keep in sync, and no way to submit "month without a
// year" or vice versa, since the browser's own month picker won't produce
// that state.

// "YYYY-MM" -> "Sep 2026". Empty/invalid input -> "".
export function monthValueToDisplay(value) {
    const match = value?.match(/^(\d{4})-(\d{2})$/);
    if (!match) return "";
    const month = Number(match[2]);
    if (month < 1 || month > 12) return "";
    return `${MONTHS[month - 1].slice(0, 3)} ${match[1]}`;
}

// Best-effort reverse parse, used only to prefill the picker when opening an
// existing entry. Handles the normal "Mon YYYY" format this UI produces, and
// falls back to pulling out a bare year (e.g. "2019", or "2022 — 2026" school
// years typed by hand before this picker existed) so old entries still show
// *something* sensible instead of a blank field.
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

// Splits a stored "Mon YYYY — Mon YYYY" / "Mon YYYY — Present" range back
// into the two picker values (+ current flag) Experience/Education editing
// needs. Shared so both admin pages parse existing periods identically.
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

// Composes a "Mon YYYY — Mon YYYY" / "Mon YYYY — Present" range string from
// two "YYYY-MM" picker values, used by the Experience and Education actions.
export function composePeriod({ start, end, isCurrent }) {
    const startDisplay = monthValueToDisplay(start);
    const endDisplay = isCurrent ? "Present" : monthValueToDisplay(end);
    if (!startDisplay && !endDisplay) return "";
    if (!startDisplay) return endDisplay;
    if (!endDisplay) return startDisplay;
    return `${startDisplay} — ${endDisplay}`;
}

// Splits a textarea's lines into a clean array of bullet strings.
export function parseBullets(raw) {
    return (raw || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}
