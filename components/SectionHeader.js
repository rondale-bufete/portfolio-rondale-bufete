
export default function SectionHeader({ label, heading, className = "" }) {
    return (
        <div className={`section-heading mb-8 ${className}`}>
            {label && (
                <p className="eyebrow mb-3">
                    {label}
                </p>
            )}
            {heading && (
                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight text-[var(--color-text)] max-w-xl">
                    {heading}
                </h2>
            )}
        </div>
    );
}


export const container = "max-w-7xl mx-auto px-6";

export const pageShell = `${container} pb-14`;
