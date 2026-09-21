// Strips the protocol and a leading "www." so a URL can be shown as short
// display text (e.g. "https://www.linkedin.com/x" -> "linkedin.com/x")
// without affecting the actual href. Shared by every component that lists
// a profile's social/site links (Contact, Projects) instead of each
// re-implementing the same regex.
export function stripProtocol(url) {
    return (url || "").replace(/^https?:\/\//, "").replace(/^www\./, "");
}
