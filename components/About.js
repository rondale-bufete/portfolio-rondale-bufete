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
                <p className="font-[family-name:var(--font-mono)] text-xs text-[#3355FF] mb-1">
                    {cert.date}
                </p>
                <h4 className="font-[family-name:var(--font-display)] text-base font-medium leading-snug">
                    {cert.title}
                </h4>
                <p className="text-[#5B5F66] text-sm mt-0.5">{cert.issuer}</p>
                {cert.description && (
                    <p className="text-[#5B5F66] text-sm mt-2 leading-relaxed">
                        {cert.description}
                    </p>
                )}
            </div>
        </Wrapper>
    );
}

export default function About({ profile, education = [], certifications = [] }) {
    return (
        <section id="about" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">01 — About</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-6 max-w-xl">
                A bit about how I work
            </h2>
            <p className="text-[#5B5F66] text-lg leading-relaxed max-w-2xl mb-14">
                {profile?.bio}
            </p>

            {education.length > 0 && (
                <div>
                    <h3 className="font-[family-name:var(--font-mono)] text-sm text-[#5B5F66] mb-6 uppercase tracking-wide">
                        Education
                    </h3>
                    <div className="space-y-8 max-w-2xl">
                        {education.map((edu, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex flex-col items-center pt-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#3355FF] shrink-0" />
                                    {i < education.length - 1 && (
                                        <span className="w-px flex-1 bg-[#E4E4E7] mt-2" />
                                    )}
                                </div>
                                <div className="pb-2">
                                    <p className="font-[family-name:var(--font-mono)] text-xs text-[#3355FF] mb-1">
                                        {edu.period}
                                    </p>
                                    <h4 className="font-[family-name:var(--font-display)] text-lg font-medium">
                                        {edu.degree}
                                    </h4>
                                    <p className="text-[#5B5F66] text-sm mt-0.5">{edu.school}</p>
                                    {edu.description && (
                                        <p className="text-[#5B5F66] text-sm mt-2 leading-relaxed">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {certifications.length > 0 && (
                <div className="mt-16">
                    <h3 className="font-[family-name:var(--font-mono)] text-sm text-[#5B5F66] mb-6 uppercase tracking-wide">
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
