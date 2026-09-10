import SectionHeader, { sectionShell } from "./SectionHeader";

// Fallback badge shown when a certification has no `image` yet — keeps the
// grid from ever showing a broken image while you backfill assets.
function CertBadgeFallback() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-9 h-9 text-[var(--color-neutral-400)]"
        >
            <path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
            <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
        </svg>
    );
}

function CertificationCard({ cert }) {
    const link = cert.url || cert.pdf;
    const isPdf = !cert.url && !!cert.pdf;
    const Wrapper = link ? "a" : "div";
    const wrapperProps = link
        ? { href: link, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            className="group flex flex-col border-2 border-[var(--color-divider)] bg-[var(--color-bg)] overflow-hidden transition-colors duration-200 hover:border-[var(--color-text)]"
        >
            <div className="relative h-48 bg-[var(--color-neutral-200)] border-b-2 border-[var(--color-divider)] overflow-hidden">
                {cert.image ? (
                    <img
                        src={cert.image}
                        alt={cert.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CertBadgeFallback />
                    </div>
                )}

                {link && (
                    <span className="tag tag-neutral absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isPdf ? "PDF" : "VIEW →"}
                    </span>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <p className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-accent-700)] mb-1">
                    {cert.date}
                </p>
                <h4 className="font-[family-name:var(--font-display)] text-base font-bold leading-snug text-[var(--color-text)]">
                    {cert.title}
                </h4>
                <p className="text-[var(--color-neutral-700)] text-sm mt-0.5">{cert.issuer}</p>
                {cert.credentialId && (
                    <p className="text-[var(--color-neutral-600)] text-xs mt-1 font-[family-name:var(--font-mono)]">
                        ID: {cert.credentialId}
                    </p>
                )}
                {cert.description && (
                    <p className="text-[var(--color-neutral-700)] text-sm mt-2 leading-relaxed text-justify">
                        {cert.description}
                    </p>
                )}
            </div>
        </Wrapper>
    );
}

export default function About({
    profile,
    education = [],
    certifications = [],
    label = "01 — About",
    heading = "A bit about how I work",
}) {
    return (
        <section id="about" className={sectionShell}>
            <SectionHeader label={label} heading={heading} className="mb-6" />
            <div className="mb-16 grid max-w-4xl gap-6 border-l-2 border-[var(--color-accent)] pl-5 sm:pl-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(14rem,0.7fr)] lg:items-start lg:gap-12">
                <p className="font-[family-name:var(--font-display)] text-lg leading-relaxed text-[var(--color-neutral-800)] sm:text-xl">
                    {profile?.bio}
                </p>
                <div className="border-t-2 border-[var(--color-divider)] pt-4 lg:border-l-2 lg:border-t-0 lg:pl-6 lg:pt-0">
                    <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-700)]">
                        Approach
                    </p>
                    <p className="text-sm leading-6 text-[var(--color-neutral-700)]">
                        Thoughtful interfaces, practical engineering, and a focus on work that lasts.
                    </p>
                </div>
            </div>

            {education.length > 0 && (
                <div>
                    <h3 className="mb-6 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-[var(--color-neutral-600)]">
                        Education
                    </h3>
                    <div className="relative max-w-4xl space-y-5 before:absolute before:left-1.25 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[var(--color-divider)]">
                        {education.map((edu, i) => (
                            <div key={i} className="relative pl-8 sm:pl-10">
                                <span className="absolute left-0 top-5 z-10 h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)]" />
                                <div className="border-2 border-[var(--color-divider)] bg-[var(--color-bg)] p-5 transition-colors hover:border-[var(--color-text)] sm:p-6">
                                    <p className="mb-2 font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--color-accent-700)]">
                                        {edu.period}
                                    </p>
                                    <h4 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                                        {edu.degree}
                                    </h4>
                                    <p className="mt-1 text-sm font-medium text-[var(--color-neutral-700)]">{edu.school}</p>
                                    {edu.description && (
                                        <p className="mt-4 border-t-2 border-[var(--color-divider)] pt-4 text-sm leading-relaxed text-[var(--color-neutral-700)]">
                                            {edu.description}
                                        </p>
                                    )}
                                    {edu.bullets?.length > 0 && (
                                        <ul className="mt-4 space-y-2 border-t-2 border-[var(--color-divider)] pt-4">
                                            {edu.bullets.map((bullet, bi) => (
                                                <li key={bi} className="flex gap-3 text-sm leading-relaxed text-[var(--color-neutral-700)]">
                                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {certifications.length > 0 && (
                <div className="mt-16">
                    <h3 className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--color-neutral-600)] mb-6 uppercase tracking-wide">
                        Certifications
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert, i) => (
                            <CertificationCard key={i} cert={cert} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
