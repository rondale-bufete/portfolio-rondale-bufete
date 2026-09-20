// Strips the protocol so a URL can be shown as display text (e.g.
// "https://github.com/x" -> "github.com/x") without affecting the actual
// href. Shared by every component that lists a profile's github/linkedin
// link (Hero, Contact, Projects) instead of each re-implementing the same
// regex.
export function stripProtocol(url) {
    return (url || "").replace(/^https?:\/\//, "");
}
