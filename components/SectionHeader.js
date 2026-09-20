// Shared shell every content section uses: a 2px top divider, a mono
// uppercase eyebrow (the admin-editable `label`), and a display heading.
// Centralizing this is what makes the "strong rule + mono label" look
// consistent across About/Experience/Skills/Projects/Contact/CustomSection
// instead of each section re-implementing it slightly differently.
export default function SectionHeader({ label, heading, className = "" }) {
    return (
        <div className={`mb-10 ${className}`}>
            {label && (
                <p className="eyebrow mb-3">
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

// Shared page-width container — every top-level page and the navbar/footer
// use this same max-width so their content edges line up, and it's wide
// enough to actually use a normal desktop viewport instead of leaving big
// unused margins on either side.
export const container = "max-w-7xl mx-auto px-6";

export const sectionShell = `${container} py-20 border-t-2 border-[var(--color-divider)]`;

// Shared by every standalone top-level page (Hero, About, Projects, Contact,
// the project detail page) — one page-width container plus consistent
// bottom breathing room, instead of each file re-declaring the same string.
export const pageShell = `${container} pb-14`;
