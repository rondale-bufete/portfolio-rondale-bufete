import { profile, education, certifications } from "@/data/portfolio";

export default function About() {
    return (
        <section id="about" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">01 — About</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-6 max-w-xl">
                A bit about how I work
            </h2>
            <p className="text-[#5B5F66] text-lg leading-relaxed max-w-2xl mb-14">
                {profile.bio}
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
                    <div className="space-y-8 max-w-2xl">
                        {certifications.map((cert, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex flex-col items-center pt-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#3355FF] shrink-0" />
                                    {i < certifications.length - 1 && (
                                        <span className="w-px flex-1 bg-[#E4E4E7] mt-2" />
                                    )}
                                </div>
                                <div className="pb-2">
                                    <p className="font-[family-name:var(--font-mono)] text-xs text-[#3355FF] mb-1">
                                        {cert.date}
                                    </p>
                                    <h4 className="font-[family-name:var(--font-display)] text-lg font-medium">
                                        {cert.title}
                                    </h4>
                                    <p className="text-[#5B5F66] text-sm mt-0.5">{cert.issuer}</p>
                                    {cert.description && (
                                        <p className="text-[#5B5F66] text-sm mt-2 leading-relaxed">
                                            {cert.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}