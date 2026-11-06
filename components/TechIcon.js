import { findTechIcon, techInitials } from "@/lib/techIcons";

// A skill's brand icon in a small square well; on hover (styled in
// globals.css) the well fills with the brand's color. Skills without an icon
// show their initials. `bare` drops the well (for inline tags) and draws
// nothing when there's no icon. Decorative: the skill's name sits next to it.
export default function TechIcon({ name, bare = false }) {
    const icon = findTechIcon(name);

    if (!icon) {
        if (bare) return null;
        return (
            <span className="tech-icon tech-icon--initials" aria-hidden="true">
                {techInitials(name)}
            </span>
        );
    }

    return (
        <span
            className={`tech-icon ${bare ? "tech-icon--bare" : ""}`.trim()}
            style={{ "--brand": icon.color, "--brand-ink": icon.ink }}
            aria-hidden="true"
        >
            <svg viewBox="0 0 24 24" focusable="false">
                <path d={icon.path} />
            </svg>
        </span>
    );
}
