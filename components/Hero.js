import { profile } from "@/data/portfolio";

export default function Hero() {
    return (
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-4">
                    {"// " + profile.role}
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6">
                    {profile.tagline}
                </h1>
                <p className="text-[#5B5F66] text-lg leading-relaxed mb-8 max-w-md">
                    {profile.bio}
                </p>
                <div className="flex items-center gap-4">
                    <a
                        href="#projects"
                        className="px-5 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        View Projects
                    </a>
                    <a
                        href="#contact"
                        className="px-5 py-2.5 rounded-md border border-[#E4E4E7] text-sm font-medium hover:border-[#14161A] transition-colors"
                    >
                        Get in Touch
                    </a>
                </div>
            </div >

            {/* Signature element: mock code editor card */}
            < div className="rounded-xl overflow-hidden shadow-xl shadow-black/5 border border-[#E4E4E7]" >
                <div className="bg-[#1E1F26] px-4 py-3 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="bg-[#14151B] p-6 font-[family-name:var(--font-mono)] text-sm leading-relaxed">
                    <p><span className="text-[#C586C0]">const</span> <span className="text-[#9CDCFE]">developer</span> <span className="text-[#D4D4D4]">=</span> <span className="text-[#D4D4D4]">{"{"}</span></p>
                    <p className="pl-4"><span className="text-[#9CDCFE]">name</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#CE9178]">&quot;{profile.name}&quot;</span><span className="text-[#D4D4D4]">,</span></p>
                    <p className="pl-4"><span className="text-[#9CDCFE]">role</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#CE9178]">&quot;{profile.role}&quot;</span><span className="text-[#D4D4D4]">,</span></p>
                    <p className="pl-4">
                        <span className="text-[#9CDCFE]">focus</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#D4D4D4]">[</span>
                    </p>
                    {["React", "Next.js", "UI Craft"].map((item, i, arr) => (
                        <p key={item} className="pl-8">
                            <span className="text-[#CE9178]">&quot;{item}&quot;</span>
                            {i < arr.length - 1 && <span className="text-[#D4D4D4]">,</span>}
                        </p>
                    ))}
                    <p className="pl-4"><span className="text-[#D4D4D4]">],</span></p>
                    <p className="pl-4">
                        <span className="text-[#9CDCFE]">available</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#569CD6]">true</span>
                    </p>
                    <p><span className="text-[#D4D4D4]">{"}"}</span></p>
                </div>
            </div >
        </section >
    );
}