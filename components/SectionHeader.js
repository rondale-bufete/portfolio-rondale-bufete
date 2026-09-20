
export default function SectionHeader({ label, heading, className = "" }) {
    return (
        <div className={`mb-10 ${className}`}>
            {label && (
                <p className="eyebrow mb-3 mt-5">
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


export const container = "max-w-7xl mx-auto px-6";

export const sectionShell = `${container} py-20 border-t-2 border-[var(--color-divider)]`;

export const pageShell = `${container} pb-14`;
