// Heading in a narrow left column, content on the right — the same rhythm
// the About section uses, so long write-ups stay at a readable measure.
export default function ProjectSection({ id, title, children }) {
    const headingId = `${id}-heading`;

    return (
        <section id={id} className="project-section" aria-labelledby={headingId}>
            <h2 id={headingId} className="project-section__title">{title}</h2>
            <div className="project-section__body">{children}</div>
        </section>
    );
}
