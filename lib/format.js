// Strips the protocol and a leading "www." so a URL can be shown as short
// display text (e.g. "https://www.linkedin.com/x" -> "linkedin.com/x")
// without affecting the actual href. Shared by every component that lists
// a profile's social/site links (Contact, Projects) instead of each
// re-implementing the same regex.
export function stripProtocol(url) {
    return (url || "").replace(/^https?:\/\//, "").replace(/^www\./, "");
}

// Admin text areas have no formatting toolbar, so a blank line is the one
// paragraph separator every multi-line field (custom sections, project
// descriptions) agrees on.
export function splitParagraphs(text) {
    return (text || "")
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

// Search engines cut descriptions at roughly 160 characters; cutting on a
// word boundary ourselves avoids a mid-word ellipsis.
export function truncate(text, maxLength = 160) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= maxLength) return clean;

    // Look one character past the budget so a cut that lands exactly on a
    // word end keeps that word; the ellipsis takes the final slot.
    const head = clean.slice(0, maxLength);
    const lastSpace = head.lastIndexOf(" ");
    const wordSafe = lastSpace > 0 ? head.slice(0, lastSpace) : head.slice(0, maxLength - 1);
    return `${wordSafe.replace(/[\s,.;:—-]+$/, "")}…`;
}

// "Rondale Rae Bufete" -> "RB": first and last name, the usual monogram.
export function initials(name) {
    const words = (name || "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "";
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : "";
    return `${first}${last}`.toUpperCase();
}
