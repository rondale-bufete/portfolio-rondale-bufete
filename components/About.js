import Image from "next/image";
import TechIcon from "./TechIcon";
import { ExternalLinkIcon } from "./icons";

// The intro (tagline and bio) lives in the hero, so About starts at Experience.
// Jump links only list the parts that have content.
function jumpLinksFor({ experience, skills, education, certifications }) {
    return [
        experience.length > 0 && { href: "#about-experience", label: "Experience" },
        skills.length > 0 && { href: "#about-skills", label: "Skills" },
        education.length > 0 && { href: "#about-education", label: "Education" },
        certifications.length > 0 && { href: "#about-certifications", label: "Certifications" },
    ].filter(Boolean);
}

function Subsection({ id, title, children }) {
    return (
        <div id={id} className="about__block">
            <h2 className="about__heading" data-reveal>
                <span>{title}</span>
            </h2>
            {children}
        </div>
    );
}

function CertificationCard({ cert }) {
    const link = cert.url || cert.pdf;
    const Wrapper = link ? "a" : "div";
    const linkProps = link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <Wrapper {...linkProps} className="cert-card">
            <span className="cert-card__thumb">
                {cert.image ? (
                    <Image src={cert.image} alt={`Certificate: ${cert.title}`} fill sizes="120px" className="cert-card__image" />
                ) : (
                    <span className="cert-card__initials" aria-hidden="true">
                        {(cert.issuer || "cert").slice(0, 2).toUpperCase()}
                    </span>
                )}
            </span>
            <span className="cert-card__text">
                <span className="cert-card__title">{cert.title}</span>
                <span className="cert-card__issuer">{[cert.issuer, cert.date].filter(Boolean).join(", ")}</span>
                {link && (
                    <span className="cert-card__action">
                        {cert.url ? "Verify" : "View PDF"}
                        <ExternalLinkIcon size={14} />
                        <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                )}
            </span>
        </Wrapper>
    );
}

export default function About({ profile, experience = [], skills = [], education = [], certifications = [] }) {
    const jumpLinks = jumpLinksFor({ experience, skills, education, certifications });

    return (
        <section id="about" className="section about">
            <div className="container about__layout">
                <aside className="about__sidebar">
                    {(profile?.email || profile?.location) && (
                        <div className="about__contact">
                            {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
                            {profile.location && <span>{profile.location}</span>}
                        </div>
                    )}

                    {jumpLinks.length > 0 && (
                        <nav className="about__jump" aria-label="About sections">
                            {jumpLinks.map((link) => (
                                <a key={link.href} href={link.href}>
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    )}

                    {profile?.resumeUrl && (
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="button button--outline about__resume">
                            View resume
                            <ExternalLinkIcon size={14} />
                        </a>
                    )}
                </aside>

                <div className="about__content">
                    {experience.length > 0 && (
                        <Subsection id="about-experience" title="Experience">
                            <ol className="timeline">
                                {experience.map((exp, index) => (
                                    <li key={`${exp.company}-${exp.period}-${index}`} className="timeline__item" data-reveal>
                                        <p className="timeline__period">{exp.period}</p>
                                        <h3 className="timeline__role">{exp.role}</h3>
                                        <p className="timeline__company">
                                            {exp.companyUrl ? (
                                                <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer">
                                                    {exp.company}
                                                </a>
                                            ) : (
                                                exp.company
                                            )}
                                            {exp.location && <span>{exp.location}</span>}
                                        </p>
                                        {exp.bullets?.length > 0 && (
                                            <ul className="timeline__bullets">
                                                {exp.bullets.map((bullet, bulletIndex) => (
                                                    <li key={bulletIndex}>{bullet}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </Subsection>
                    )}

                    {skills.length > 0 && (
                        <Subsection id="about-skills" title="Skills">
                            <div className="skills" data-reveal>
                                {skills.map((group, groupIndex) => (
                                    <section key={group.category} className="skill-group" style={{ "--i": groupIndex }} aria-label={group.category}>
                                        <header className="skill-group__header">
                                            <h3 className="skill-group__title">{group.category}</h3>
                                            <span className="skill-group__count">{group.items.length}</span>
                                        </header>
                                        <ul className="skill-group__list">
                                            {group.items.map((item) => (
                                                <li key={item} className="tech-chip">
                                                    <TechIcon name={item} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        </Subsection>
                    )}

                    {education.length > 0 && (
                        <Subsection id="about-education" title="Education">
                            <ul className="education" data-reveal>
                                {education.map((edu, index) => (
                                    <li key={`${edu.school}-${index}`} className="education__item">
                                        <span className="education__degree">{edu.degree}</span>
                                        <span className="education__school">{edu.school}</span>
                                        <span className="education__period">{edu.period}</span>
                                    </li>
                                ))}
                            </ul>
                        </Subsection>
                    )}

                    {certifications.length > 0 && (
                        <Subsection id="about-certifications" title="Certifications">
                            <ul className="certs" data-reveal>
                                {certifications.map((cert, index) => (
                                    <li key={`${cert.title}-${index}`} style={{ "--i": index }}>
                                        <CertificationCard cert={cert} />
                                    </li>
                                ))}
                            </ul>
                        </Subsection>
                    )}
                </div>
            </div>
        </section>
    );
}
