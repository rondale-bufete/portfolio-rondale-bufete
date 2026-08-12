export default function Experience({
    experience = [],
    label = "02 — Experience",
    heading = "Where I've worked",
}) {
    if (experience.length === 0) return null;

    return (
        <section id="experience" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">{label}</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                {heading}
            </h2>

            <div className="space-y-10 max-w-2xl">
                {experience.map((exp, i) => (
                    <div key={i} className="flex gap-6 mt-2">
                        <div className="flex flex-col items-center pt-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#3355FF] shrink-0" />
                            {i < experience.length - 1 && (
                                <span className="w-px flex-1 bg-[#E4E4E7] mt-2" />
                            )}
                        </div>
                        <div className="pb-2">
                            <p className="font-[family-name:var(--font-mono)] text-xs text-[#3355FF] mb-1">
                                {exp.period}
                            </p>
                            <h4 className="font-[family-name:var(--font-display)] text-lg font-medium">
                                {exp.role}
                            </h4>
                            <p className="text-[#5B5F66] text-sm mt-0.5">
                                {exp.companyUrl ? (
                                    <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#14161A] hover:underline">
                                        {exp.company}
                                    </a>
                                ) : (
                                    exp.company
                                )}
                                {exp.location && <span> · {exp.location}</span>}
                            </p>
                            {exp.bullets?.length > 0 && (
                                <ul className="mt-3 space-y-1.5">
                                    {exp.bullets.map((bullet, bi) => (
                                        <li key={bi} className="text-[#5B5F66] text-sm leading-relaxed flex gap-2">
                                            <span className="text-[#3355FF] shrink-0">*</span>
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
