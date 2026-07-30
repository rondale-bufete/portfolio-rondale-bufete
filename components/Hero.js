"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";

export default function Hero() {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-4">
                    {"// " + profile.role}
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6">
                    {profile.tagline}
                </h1>
                {/* <p className="text-[#5B5F66] text-lg leading-relaxed mb-8 max-w-md">
                    {profile.bio}
                </p> */}
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
            </div>

            {/* Signature element: flippable mock code editor card */}
            <div
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                aria-label="Flip card to reveal photo"
                onClick={() => setIsFlipped((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsFlipped((prev) => !prev);
                    }
                }}
                className="cursor-pointer [perspective:1500px] outline-none group transition-transform duration-300 hover:-translate-y-0.5"
            >
                <div
                    className={`relative w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
                        }`}
                >
                    {/* Front: code editor */}
                    <div className="[backface-visibility:hidden]">
                        <div className="relative rounded-xl overflow-hidden shadow-xl shadow-black/5 border border-[#E4E4E7] transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-black/10">
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
                                {["React", "Next.js", "PHP", "Node.js", "Python", "CI/CD", "MySQL", "PostgreSQL", "MongoDB", "Supabase"].map((item, i, arr) => (
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

                            {/* discoverability hint: quiet corner fold, no label */}
                            <div className="absolute top-0 right-0 w-7 h-7 overflow-hidden pointer-events-none">
                                <div
                                    className="absolute -top-3.5 -right-3.5 w-7 h-7 rotate-45 bg-gradient-to-br from-white/0 via-white/[0.06] to-white/[0.18] transition-all duration-300 group-hover:via-white/10 group-hover:to-white/25"
                                />
                            </div>

                            {/* hover overlay: dim + click-to-flip label */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none">
                                <span className="flex items-center gap-1.5 text-white text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-3.5 h-3.5"
                                    >
                                        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                        <path d="M21 3v6h-6" />
                                    </svg>
                                    Click to flip
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Back: photo */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl shadow-black/5 border border-[#E4E4E7] transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-black/10">
                            <img
                                src={profile.photo}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />

                            {/* discoverability hint: quiet corner fold, no label */}
                            <div className="absolute top-0 right-0 w-7 h-7 overflow-hidden pointer-events-none">
                                <div
                                    className="absolute -top-3.5 -right-3.5 w-7 h-7 rotate-45 bg-gradient-to-br from-white/0 via-white/[0.06] to-white/[0.18] transition-all duration-300 group-hover:via-white/10 group-hover:to-white/25"
                                />
                            </div>

                            {/* hover overlay: dim + click-to-flip label */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none">
                                <span className="flex items-center gap-1.5 text-white text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-3.5 h-3.5"
                                    >
                                        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                        <path d="M21 3v6h-6" />
                                    </svg>
                                    Click to flip
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}