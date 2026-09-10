import SectionHeader, { sectionShell } from "./SectionHeader";

export default function CustomSection({ id, label, heading, body }) {
    // Blank-line-separated paragraphs — no markdown parsing, kept simple
    // and predictable for a text field with no formatting toolbar.
    const paragraphs = (body || "").split(/\n\s*\n/).filter((p) => p.trim());

    return (
        <section id={id} className={sectionShell}>
            <SectionHeader label={label} heading={heading} />
            <div className="max-w-2xl space-y-4">
                {paragraphs.map((p, i) => (
                    <p key={i} className="text-[var(--color-neutral-700)] text-lg leading-relaxed whitespace-pre-line">
                        {p}
                    </p>
                ))}
            </div>
        </section>
    );
}
