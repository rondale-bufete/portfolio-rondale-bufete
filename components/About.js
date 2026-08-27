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
            className="w-9 h-9 text-[#5B5F66]/30"
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
            className="group flex flex-col rounded-xl border border-[#E4E4E7] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
        >
            <div className="relative h-48 bg-[#F6F6F8] border-b border-[#E4E4E7] overflow-hidden">
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
                    <span
                        className={
                            isPdf
                                ? "absolute top-3 right-3 px-2 py-1 rounded-full bg-white border border-[#E4E4E7] text-[10px] font-semibold tracking-wide text-[#5B5F66] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                : "absolute top-3 right-3 w-6 h-6 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        }
                    >
                        {isPdf ? (
                            "PDF"
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3 h-3 text-[#14161A]"
                            >
                                <path d="M7 17 17 7" />
                                <path d="M8 7h9v9" />
                            </svg>
                        )}
                    </span>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <p className="font-mono text-xs text-[#3355FF] mb-1">
                    {cert.date}
                </p>
                <h4 className="font-(family-name:--font-display) text-base font-medium leading-snug">
                    {cert.title}
                </h4>
                <p className="text-[#5B5F66] text-sm mt-0.5">{cert.issuer}</p>
                {cert.credentialId && (
                    <p className="text-[#5B5F66] text-xs mt-1 font-mono">
                        ID: {cert.credentialId}
                    </p>
                )}
                {cert.description && (
                    <p className="text-[#5B5F66] text-sm mt-2 leading-relaxed text-justify">
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
        <section id="about" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-mono text-sm text-[#3355FF] mb-3">{label}</p>
            <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-medium tracking-tight mb-6 max-w-xl">
                {heading}
            </h2>
            <div className="mb-16 grid max-w-4xl gap-6 border-l-2 border-[#3355FF] pl-5 sm:pl-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(14rem,0.7fr)] lg:items-start lg:gap-12">
                <p className="font-(family-name:--font-display) text-lg leading-relaxed text-[#454951] sm:text-xl">
                    {profile?.bio}
                </p>
                <div className="border-t border-[#E4E4E7] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#3355FF]">
                        Approach
                    </p>
                    <p className="text-sm leading-6 text-[#5B5F66]">
                        Thoughtful interfaces, practical engineering, and a focus on work that lasts.
                    </p>
                </div>
            </div>

            {education.length > 0 && (
                <div>
                    <h3 className="mb-6 font-mono text-sm uppercase tracking-wide text-[#5B5F66]">
                        Education
                    </h3>
                    <div className="relative max-w-4xl space-y-5 before:absolute before:left-1.25 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#D9DDE5]">
                        {education.map((edu, i) => (
                            <div key={i} className="relative pl-8 sm:pl-10">
                                <span className="absolute left-0 top-5 z-10 h-3 w-3 rounded-full border-2 border-[#FAFAFA] bg-[#3355FF] shadow-[0_0_0_3px_#E8EDFF]" />
                                <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 shadow-[0_1px_2px_rgba(20,22,26,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#3355FF]/40 hover:shadow-[0_8px_20px_rgba(20,22,26,0.06)] sm:p-6">
                                    <p className="mb-2 font-mono text-[11px] text-[#3355FF]">
                                        {edu.period}
                                    </p>
                                    <h4 className="font-(family-name:--font-display) text-xl font-medium tracking-tight">
                                        {edu.degree}
                                    </h4>
                                    <p className="mt-1 text-sm font-medium text-[#5B5F66]">{edu.school}</p>
                                    {edu.description && (
                                        <p className="mt-4 border-t border-[#E4E4E7] pt-4 text-sm leading-relaxed text-[#5B5F66]">
                                            {edu.description}
                                        </p>
                                    )}
                                    {edu.bullets?.length > 0 && (
                                        <ul className="mt-4 space-y-2 border-t border-[#E4E4E7] pt-4">
                                            {edu.bullets.map((bullet, bi) => (
                                                <li key={bi} className="flex gap-3 text-sm leading-relaxed text-[#5B5F66]">
                                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3355FF]" />
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
                    <h3 className="font-mono text-sm text-[#5B5F66] mb-6 uppercase tracking-wide">
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
