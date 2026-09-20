import { pageShell } from "./SectionHeader";

const JUMP_LINKS = [
    { href: "#about-summary", label: "Summary" },
    { href: "#about-experience", label: "Experience" },
    { href: "#about-skills", label: "Skills" },
    { href: "#about-education", label: "Education" },
    { href: "#about-certifications", label: "Certifications" },
];

export default function About({
    profile,
    experience = [],
    skills = [],
    education = [],
    certifications = [],
}) {
    return (
        <section className={pageShell}>
            <div className="grid md:grid-cols-[236px_1fr] gap-0">
                {/* Sidebar */}
                <div className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--color-divider)] px-6 py-6 md:pl-0 md:pr-6">
                    {profile?.photo && (
                        <img
                            src={profile.photo}
                            alt={`${profile.name}, portrait photo`}
                            className="w-full aspect-square object-cover border-2 border-[var(--color-text)]"
                        />
                    )}
                    <nav className="mt-6 border-t-2 border-[var(--color-divider)]">
                        {JUMP_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block py-2.5 border-b border-[var(--color-divider)] font-semibold text-[11px] text-[var(--color-neutral-800)] hover:text-[var(--color-accent-700)] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className="mt-6 pt-4 border-t-2 border-[var(--color-divider)] text-[11px] leading-relaxed text-[var(--color-neutral-700)]">
                        {profile?.email && <div>{profile.email}</div>}
                        {profile?.phone && <div>{profile.phone}</div>}
                        {profile?.location && <div>{profile.location}</div>}
                    </div>
                </div>

                {/* Main column */}
                <div className="px-6 py-6 md:py-8 md:pl-8 md:pr-0">
                    <div id="about-summary" className="scroll-mt-24">
                        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--color-text)] max-w-xl">
                            {profile?.tagline}
                        </h1>
                        <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--color-neutral-800)] max-w-2xl">
                            {profile?.bio}
                        </p>
                    </div>

                    {experience.length > 0 && (
                        <div id="about-experience" className="mt-8 scroll-mt-24">
                            <h2 className="eyebrow mb-3.5">
                                Experience
                            </h2>
                            {experience.map((exp, i) => (
                                <div
                                    key={i}
                                    className="grid sm:grid-cols-[150px_1fr] gap-3 sm:gap-5 py-3.5 border-t-2 border-[var(--color-divider)]"
                                >
                                    <div>
                                        <div className="font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--color-neutral-600)]">
                                            {exp.period}
                                        </div>
                                        <div className="mt-1 text-[10.5px] font-semibold text-[var(--color-neutral-500)]">
                                            {exp.company}
                                            {exp.location ? ` · ${exp.location}` : ""}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-[family-name:var(--font-display)] text-[15px] font-extrabold text-[var(--color-text)]">
                                            {exp.role}
                                        </div>
                                        {exp.bullets?.length > 0 && (
                                            <ul className="mt-2 space-y-1.5">
                                                {exp.bullets.map((bullet, bi) => (
                                                    <li key={bi} className="flex gap-2.5 text-[12.5px] leading-relaxed text-[var(--color-neutral-800)]">
                                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 grid sm:grid-cols-2 gap-8 border-t-2 border-[var(--color-divider)] pt-6">
                        {skills.length > 0 && (
                            <div id="about-skills" className="scroll-mt-24">
                                <h2 className="eyebrow mb-3">
                                    Skills
                                </h2>
                                <div className="space-y-3">
                                    {skills.map((group) => (
                                        <div key={group.category}>
                                            <div className="field-label mb-1.5">
                                                {group.category}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {group.items.map((item) => (
                                                    <span key={item} className="tag tag-neutral">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(education.length > 0 || certifications.length > 0) && (
                            <div>
                                <h2 className="eyebrow mb-3">
                                    Education &amp; Certifications
                                </h2>
                                {education.length > 0 && (
                                    <div id="about-education" className="scroll-mt-24 space-y-3 pb-3 border-b-2 border-[var(--color-divider)]">
                                        {education.map((edu, i) => (
                                            <div key={i}>
                                                <div className="font-[family-name:var(--font-display)] text-[13.5px] font-extrabold text-[var(--color-text)]">
                                                    {edu.degree}
                                                </div>
                                                <div className="mt-0.5 text-[12px] text-[var(--color-neutral-700)]">
                                                    {edu.school}
                                                    {edu.period ? ` · ${edu.period}` : ""}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {certifications.length > 0 && (
                                    <ul id="about-certifications" className="scroll-mt-24 mt-3 space-y-1.5">
                                        {certifications.map((cert, i) => {
                                            const link = cert.url || cert.pdf;
                                            return (
                                                <li key={i} className="text-[12px] leading-relaxed text-[var(--color-neutral-800)]">
                                                    {link ? (
                                                        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent-700)] transition-colors">
                                                            {cert.title}
                                                            {cert.issuer ? ` — ${cert.issuer}` : ""}
                                                        </a>
                                                    ) : (
                                                        <>
                                                            {cert.title}
                                                            {cert.issuer ? ` — ${cert.issuer}` : ""}
                                                        </>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
