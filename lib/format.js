// Shorten displayed URLs without changing links; shared by Contact and Projects.
export function stripProtocol(url) {
    return (url || "").replace(/^https?:\/\//, "").replace(/^www\./, "");
}

// Treat blank lines as paragraph separators in multiline admin text.
export function splitParagraphs(text) {
    return (text || "")
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

// Truncate descriptions near 160 characters without splitting a word.
export function truncate(text, maxLength = 160) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= maxLength) return clean;

    // Check one character past the limit to preserve a word ending at the boundary.
    const head = clean.slice(0, maxLength);
    const lastSpace = head.lastIndexOf(" ");
    const wordSafe = lastSpace > 0 ? head.slice(0, lastSpace) : head.slice(0, maxLength - 1);
    return `${wordSafe.replace(/[\s,.;:—-]+$/, "")}…`;
}

// Return initials from the first and last name.
export function initials(name) {
    const words = (name || "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "";
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : "";
    return `${first}${last}`.toUpperCase();
}
