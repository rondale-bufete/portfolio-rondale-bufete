import { pageShell } from "./SectionHeader";

const JUMP_LINKS = [
    { href: "#about-summary", label: "summary" },
    { href: "#about-experience", label: "experience" },
    { href: "#about-skills", label: "skills" },
    { href: "#about-education", label: "education" },
    { href: "#about-certifications", label: "certifications" },
];

export default function About({
    profile,
    experience = [],
    skills = [],
    education = [],
    certifications = [],
}) {
    return (
        <section id="about" className={`${pageShell} about-page`}>
            <div className="about-layout grid md:grid-cols-[280px_1fr] gap-10">
                {/* Sidebar */}
                <div className="about-sidebar md:sticky md:top-24 md:self-start flex flex-col gap-7">
                    {(profile?.email || profile?.location) && (
                        <div className="about-contact">
                            {profile.email && <div>{profile.email}</div>}
                            {profile.location && <div>{profile.location}</div>}
                        </div>
                    )}

                    <nav className="about-jump-links flex flex-col gap-0.5 font-[family-name:var(--font-mono)] text-[13px]">
                        {JUMP_LINKS.map((link, i) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-[var(--color-body)] hover:bg-[var(--color-raised)] hover:text-[var(--color-text)] transition-colors"
                            >
                                <span>{link.label}</span>
                                <span className="text-[var(--color-faint)]">{String(i).padStart(2, "0")}</span>
                            </a>
                        ))}
                    </nav>

                    {profile?.resumeUrl && (
                        <a
                            href={profile.resumeUrl}
                            download
                            className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] py-3 text-center font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-text)] hover:border-[var(--color-body)] transition-colors"
                        >
                            View Resume <span aria-hidden="true">↗</span>
                        </a>
                    )}
                </div>

                {/* Main column */}
                <div className="about-content flex flex-col gap-16 min-w-0">
                    <div id="about-summary" className="about-summary scroll-mt-24">
                        <p className="eyebrow mb-4">{"// summary"}</p>
                        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight text-[var(--color-text)] max-w-xl">
                            {profile?.tagline}
                        </h2>
                        <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-body)] max-w-2xl">
                            {profile?.bio}
                        </p>
                    </div>

                    {experience.length > 0 && (
                        <div id="about-experience" className="about-experience scroll-mt-24">
                            <p className="eyebrow mb-2">{"// 01"}</p>
                            <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--color-text)] mb-6">
                                Experience
                            </h2>
                            <div className="flex flex-col border-l border-[var(--color-border-strong)] ml-[5px]">
                                {experience.map((exp, i) => (
                                    <div key={i} className="relative pl-7 pb-9 last:pb-0">
                                        <span className="absolute -left-[6px] top-1.5 w-[11px] h-[11px] rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)]" />
                                        <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)] mb-1.5">
                                            {exp.period}
                                        </div>
                                        <div className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">
                                            {exp.role}
                                        </div>
                                        <div className="mt-1 mb-3.5 text-sm text-[var(--color-muted)]">
                                            {exp.company}
                                            {exp.location ? ` · ${exp.location}` : ""}
                                        </div>
                                        {exp.bullets?.length > 0 && (
                                            <ul className="space-y-2">
                                                {exp.bullets.map((bullet, bi) => (
                                                    <li key={bi} className="grid grid-cols-[16px_1fr] text-[14px] leading-relaxed text-[var(--color-body)]">
                                                        <span className="font-[family-name:var(--font-mono)] text-[var(--color-faint)]">+</span>
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills.length > 0 && (
                        <div id="about-skills" className="about-skills scroll-mt-24">
                            <p className="eyebrow mb-2">{"// 02"}</p>
                            <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--color-text)] mb-6">
                                Skills
                            </h2>
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden font-[family-name:var(--font-mono)] text-[13px]">
                                {skills.map((group) => (
                                    <div
                                        key={group.category}
                                        className="grid sm:grid-cols-[220px_minmax(0,1fr)] gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 border-b border-[var(--color-border)] last:border-b-0 items-baseline"
                                    >
                                        <span className="text-[var(--color-muted)]">{group.category}:</span>
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

                    {education.length > 0 && (
                        <div id="about-education" className="about-education scroll-mt-24">
                            <p className="eyebrow mb-2">{"// 03"}</p>
                            <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--color-text)] mb-6">
                                Education
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {education.map((edu, i) => (
                                    <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[18px]">
                                        <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)] mb-2.5">
                                            {edu.period}
                                        </div>
                                        <div className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--color-text)] leading-snug">
                                            {edu.degree}
                                        </div>
                                        <div className="mt-1.5 text-[13px] text-[var(--color-muted)]">
                                            {edu.school}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {certifications.length > 0 && (
                        <div id="about-certifications" className="about-certifications scroll-mt-24">
                            <p className="eyebrow mb-2">{"// 04"}</p>
                            <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--color-text)] mb-6">
                                Certifications
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {certifications.map((cert, i) => {
                                    const link = cert.url || cert.pdf;
                                    const Wrapper = link ? "a" : "div";
                                    const linkProps = link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {};
                                    return (
                                        <Wrapper
                                            key={i}
                                            {...linkProps}
                                            className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
                                        >
                                            {cert.badge ? (
                                                <div className="h-16 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-text)]">
                                                    <img src={cert.badge} alt={`${cert.issuer || cert.title} badge`} className="h-12 max-w-[120px] object-contain" />
                                                </div>
                                            ) : (
                                                <div className="h-16 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-raised)] font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">
                                                    {(cert.issuer || "cert").slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="text-sm font-medium leading-snug text-[var(--color-text)]">{cert.title}</div>
                                            <div className="mt-auto flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                                                <span>{cert.issuer}</span>
                                                {link && <span className="text-[var(--color-accent)]">{cert.url ? "verify ↗" : "view pdf"}</span>}
                                            </div>
                                        </Wrapper>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
