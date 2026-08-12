export default function CustomSection({ label, heading, body }) {
    // Blank-line-separated paragraphs — no markdown parsing, kept simple
    // and predictable for a text field with no formatting toolbar.
    const paragraphs = (body || "").split(/\n\s*\n/).filter((p) => p.trim());

    return (
        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            {label && (
                <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">{label}</p>
            )}
            {heading && (
                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-6 max-w-xl">
                    {heading}
                </h2>
            )}
            <div className="max-w-2xl space-y-4">
                {paragraphs.map((p, i) => (
                    <p key={i} className="text-[#5B5F66] text-lg leading-relaxed whitespace-pre-line">
                        {p}
                    </p>
                ))}
            </div>
        </section>
    );
}
