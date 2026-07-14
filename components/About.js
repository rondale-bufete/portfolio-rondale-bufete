import { profile } from "@/data/portfolio";

export default function About() {
    return (
        <section id="about" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">01 — About</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-6 max-w-xl">
                A bit about how I work
            </h2>
            <p className="text-[#5B5F66] text-lg leading-relaxed max-w-2xl">
                {profile.bio}
            </p>
        </section>
    );
}