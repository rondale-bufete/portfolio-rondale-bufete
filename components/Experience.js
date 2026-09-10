import SectionHeader, { sectionShell } from "./SectionHeader";

export default function Experience({
    experience = [],
    label = "02 — Experience",
    heading = "Where I've worked",
}) {
    if (experience.length === 0) return null;

    return (
        <section id="experience" className={sectionShell}>
            <SectionHeader label={label} heading={heading} />

            <div className="relative max-w-3xl space-y-6 before:absolute before:left-1.25 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[var(--color-divider)]">
                {experience.map((exp, i) => (
                    <div key={i} className="relative grid gap-4 pl-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 sm:pl-0">
                        <div className="absolute left-0 top-5 z-10 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)] sm:left-42 sm:-translate-x-1/2" />

                        <div className="pt-1 sm:pr-2 sm:text-right">
                            <p className="tag tag-accent inline-flex">
                                {exp.period}
                            </p>
                        </div>

                        <div className="border-2 border-[var(--color-divider)] bg-[var(--color-neutral-100)] p-5 transition-colors hover:border-[var(--color-text)] sm:p-6">
                            <h4 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                                {exp.role}
                            </h4>
                            <p className="mt-1 text-sm text-[var(--color-neutral-700)]">
                                {exp.companyUrl ? (
                                    <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-text)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2">
                                        {exp.company}
                                    </a>
                                ) : (
                                    exp.company
                                )}
                                {exp.location && <span> · {exp.location}</span>}
                            </p>
                            {exp.bullets?.length > 0 && (
                                <ul className="mt-5 space-y-2 border-t-2 border-[var(--color-divider)] pt-4">
                                    {exp.bullets.map((bullet, bi) => (
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
        </section>
    );
}
