
export default function InfoRow({ label, value, placeholder, href }) {
    if (!value && !placeholder) return null;

    const content = (
        <span
            className={`font-[family-name:var(--font-mono)] text-[13px] text-right transition-colors ${
                value
                    ? "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                    : "text-[var(--color-subtle)]"
            }`}
        >
            {value || placeholder}
        </span>
    );

    return (
        <div className="flex items-baseline justify-between gap-3 px-6 py-3 border-b border-[var(--color-border)] last:border-b-0">
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
