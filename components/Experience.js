export default function Experience({
    experience = [],
    label = "02 — Experience",
    heading = "Where I've worked",
}) {
    if (experience.length === 0) return null;

    return (
        <section id="experience" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-mono text-sm text-[#3355FF] mb-3">{label}</p>
            <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                {heading}
            </h2>

            <div className="relative max-w-3xl space-y-6 before:absolute before:left-1.25 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#D9DDE5]">
                {experience.map((exp, i) => (
                    <div key={i} className="relative grid gap-4 pl-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 sm:pl-0">
                        <div className="absolute left-0 top-5 z-10 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#FAFAFA] bg-[#3355FF] shadow-[0_0_0_3px_#E8EDFF] sm:left-42 sm:-translate-x-1/2" />

                        <div className="pt-1 sm:pr-2 sm:text-right">
                            <p className="inline-flex rounded-md bg-[#E8EDFF] px-2.5 py-1 font-mono text-[11px] text-[#3355FF]">
                                {exp.period}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 shadow-[0_1px_2px_rgba(20,22,26,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#3355FF]/40 hover:shadow-[0_8px_20px_rgba(20,22,26,0.06)] sm:p-6">
                            <h4 className="font-(family-name:--font-display) text-xl font-medium tracking-tight">
                                {exp.role}
                            </h4>
                            <p className="mt-1 text-sm text-[#5B5F66]">
                                {exp.companyUrl ? (
                                    <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#3355FF] hover:text-[#14161A] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3355FF] focus:ring-offset-2">
                                        {exp.company}
                                    </a>
                                ) : (
                                    exp.company
                                )}
                                {exp.location && <span> · {exp.location}</span>}
                            </p>
                            {exp.bullets?.length > 0 && (
                                <ul className="mt-5 space-y-2 border-t border-[#E4E4E7] pt-4">
                                    {exp.bullets.map((bullet, bi) => (
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
        </section>
    );
}
