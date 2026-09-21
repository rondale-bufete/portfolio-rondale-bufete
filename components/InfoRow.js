
export default function InfoRow({ label, value, placeholder, href }) {
    if (!value && !placeholder) return null;

    const content = (
        <span
            className={`font-bold text-xs text-right transition-colors ${
                value
                    ? "text-[var(--color-text)] group-hover:text-[var(--color-accent-700)]"
                    : "text-[var(--color-neutral-400)]"
            }`}
        >
            {value || placeholder}
        </span>
    );

    return (
        <div className="flex items-baseline justify-between gap-3 px-6 py-3.5 border-b-2 border-[var(--color-divider)]">
            <span className="field-label">{label}</span>
            {href && value ? (
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group">
                    {content}
                </a>
            ) : (
                content
            )}
        </div>
    );
}
