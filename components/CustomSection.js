import { container } from "./SectionHeader";

export default function CustomSection({ id, label, heading, body }) {
    // Blank-line-separated paragraphs — no markdown parsing, kept simple
    // and predictable for a text field with no formatting toolbar.
    const paragraphs = (body || "").split(/\n\s*\n/).filter((p) => p.trim());

    return (
        <section id={id} className={`${container} custom-section pb-14`}>
            <div className="custom-section__inner grid md:grid-cols-[280px_minmax(0,1fr)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
                <div className="p-6 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
                    <p className="eyebrow mb-2">{label || "// custom_section"}</p>
                    <h2 className="font-[family-name:var(--font-display)] text-[22px] font-medium text-[var(--color-text)]">
                        {heading}
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {paragraphs.map((p, i) => (
                        <p key={i} className="text-[var(--color-body)] text-base leading-relaxed whitespace-pre-line">
                            {p}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
