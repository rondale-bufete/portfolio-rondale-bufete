import { skills } from "@/data/portfolio";

export default function Skills() {
    return (
        <section id="skills" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">02 — Skills</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                Tools I reach for
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
                {skills.map((group) => (
                    <div key={group.category}>
                        <h3 className="text-sm text-[#5B5F66] font-medium mb-4">{group.category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <span
                                    key={item}
                                    className="font-[family-name:var(--font-mono)] text-xs px-3 py-1.5 rounded-md bg-white border border-[#E4E4E7] text-[#14161A]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}