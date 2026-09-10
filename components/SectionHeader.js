// Shared shell every content section uses: a 2px top divider, a mono
// uppercase eyebrow (the admin-editable `label`), and a display heading.
// Centralizing this is what makes the "strong rule + mono label" look
// consistent across About/Experience/Skills/Projects/Contact/CustomSection
// instead of each section re-implementing it slightly differently.
export default function SectionHeader({ label, heading, className = "" }) {
    return (
        <div className={`mb-10 ${className}`}>
            {label && (
                <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent-700)] mb-3">
                    {label}
                </p>
            )}
            {heading && (
                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text)] max-w-xl">
                    {heading}
                </h2>
            )}
        </div>
    );
}

export const sectionShell = "max-w-5xl mx-auto px-6 py-20 border-t-2 border-[var(--color-divider)]";
