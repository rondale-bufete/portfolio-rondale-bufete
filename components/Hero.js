"use client";

import { useState } from "react";

export default function Hero({ profile }) {
    const [isFlipped, setIsFlipped] = useState(false);

    if (!profile) return null;

    return (
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <p className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-[0.02em] text-[var(--color-accent-700)] mb-4">
                    {"// " + profile.role}
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6 text-[var(--color-text)]">
                    {profile.tagline}
                </h1>
                <div className="flex items-center gap-3">
                    <a
                        href="#projects"
                        className="px-5 py-2.5 bg-[var(--color-text)] text-white text-sm font-bold hover:bg-[var(--color-accent)] transition-colors"
                    >
                        View Projects
                    </a>
                    <a
                        href="#contact"
                        className="px-5 py-2.5 border-2 border-[var(--color-text)] text-sm font-bold hover:bg-[var(--color-text)] hover:text-white transition-colors"
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
                className="cursor-pointer [perspective:1500px] outline-none group"
            >
                <div
                    className={`relative w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
                        }`}
                >
                    {/* Front: code editor */}
                    <div className="[backface-visibility:hidden]">
                        <div className="relative border-2 border-[var(--color-text)] overflow-hidden">
                            <div className="bg-[#1E1F26] px-4 py-3 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[var(--color-accent)]" />
                                <span className="w-2.5 h-2.5 bg-[#7d7979]" />
                                <span className="w-2.5 h-2.5 bg-[#444141]" />
                            </div>
                            <div className="bg-[#14151B] p-6 font-[family-name:var(--font-mono)] text-sm leading-relaxed">
                                <p><span className="text-[#C586C0]">const</span> <span className="text-[#9CDCFE]">developer</span> <span className="text-[#D4D4D4]">=</span> <span className="text-[#D4D4D4]">{"{"}</span></p>
                                <p className="pl-4"><span className="text-[#9CDCFE]">name</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#CE9178]">&quot;{profile.name}&quot;</span><span className="text-[#D4D4D4]">,</span></p>
                                <p className="pl-4"><span className="text-[#9CDCFE]">role</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#CE9178]">&quot;{profile.role}&quot;</span><span className="text-[#D4D4D4]">,</span></p>
                                <p className="pl-4">
                                    <span className="text-[#9CDCFE]">focus</span><span className="text-[#D4D4D4]">:</span> <span className="text-[#D4D4D4]">[</span>
                                </p>
                                {["Systems Design",
                                    "API Architecture",
                                    "Data Modeling",
                                    "Scalable Systems",
                                    "Automation",
                                    "Test-Driven Development",
                                    "Performance",
                                    "Security",
                                    "Observability",
                                    "Developer Experience"].map((item, i, arr) => (
                                    <p key={item} className="pl-8">
                                        <span className="text-[#CE9178]">&quot;{item}&quot;</span>
                                        {i < arr.length - 1 && <span className="text-[#D4D4D4]">,</span>}
                                    </p>
                                ))}
                                <p className="pl-4"><span className="text-[#D4D4D4]">],</span></p>
                                <p className="pl-4">
                                    <span className="text-[#9CDCFE]">available</span><span className="text-[#D4D4D4]">:</span> <span className="text-[var(--color-accent)]">true</span>
                                </p>
                                <p><span className="text-[#D4D4D4]">{"}"}</span></p>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none">
                                <span className="flex items-center gap-1.5 text-white text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
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
                        <div className="relative w-full h-full border-2 border-[var(--color-text)] overflow-hidden">
                            <img
                                src={profile.photo}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none">
                                <span className="flex items-center gap-1.5 text-white text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
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
