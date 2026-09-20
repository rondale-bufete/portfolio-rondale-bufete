// Minimal server-side guardrails for admin form fields that get rendered
// back out as links/mailtos on the public site. Empty values are treated
// as valid since these fields are optional — only reject malformed input,
// don't require it.

export function isValidUrl(value) {
    if (!value) return true;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function isValidEmail(value) {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
