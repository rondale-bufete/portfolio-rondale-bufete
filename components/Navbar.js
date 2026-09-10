"use client";

import { useState } from "react";
import Link from "next/link";
import ResumeModal from "./ResumeModal";

// Anchor id for each section kind — matches the id every section component
// already renders (About -> #about, Experience -> #experience, etc). Custom
// sections don't share one id since there can be several, so they use their
// own row id instead (see CustomSection.js).
const KIND_TO_ID = {
    about: "about",
    experience: "experience",
    skills: "skills",
    projects: "projects",
    contact: "contact",
};

// Nav tabs read as short uppercase words ("EXPERIENCE"), while the same
// section's on-page eyebrow keeps its full "02 — Experience" form — strip
// the leading index here rather than storing the label twice.
function tabLabel(label) {
    return (label || "").replace(/^\d+\s*[—-]\s*/, "");
}

export default function Navbar({ profile, sections = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showResume, setShowResume] = useState(false);

    const tabs = sections.map((section) => ({
        href: `#${KIND_TO_ID[section.kind] || `section-${section.id}`}`,
        label: tabLabel(section.label) || section.kind,
    }));

    function handleLinkClick() {
        setIsOpen(false);
    }

    return (
        <>
            <header className="sticky top-0 z-40 bg-[var(--color-bg)] border-b-2 border-[var(--color-text)]">
                <nav className="max-w-5xl mx-auto px-6 h-[52px] flex items-center justify-between gap-4">
                    <Link href="#" className="flex items-center gap-3.5 min-w-0">
                        <span className="w-[26px] h-[26px] shrink-0 bg-[var(--color-accent)] text-white font-[family-name:var(--font-display)] font-extrabold text-[11px] flex items-center justify-center">
                            {profile?.name
                                ?.split(" ")
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("") || "RB"}
                        </span>
                        <span className="font-[family-name:var(--font-display)] font-extrabold text-[13.5px] tracking-tight text-[var(--color-text)] truncate">
                            {profile?.name}
                        </span>
                        {profile?.role && (
                            <span className="hidden sm:inline font-medium text-[11.5px] text-[var(--color-neutral-600)] truncate">
                                {profile.role}
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:flex items-center gap-5 shrink-0">
                        {profile?.github && (
                            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="font-semibold text-[11.5px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">
                                GitHub
                            </a>
                        )}
                        {profile?.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-[11.5px] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">
                                LinkedIn
                            </a>
                        )}
                        <button
                            onClick={() => setShowResume(true)}
                            className="font-bold text-[11.5px] px-3 py-1.5 bg-[var(--color-text)] text-white hover:bg-[var(--color-accent)] transition-colors"
                        >
                            Résumé ↓
                        </button>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 shrink-0"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        <span className={`block w-5 h-0.5 bg-[var(--color-text)] transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-[var(--color-text)] transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-[var(--color-text)] transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </nav>

                {tabs.length > 0 && (
                    <div className="hidden md:flex max-w-5xl mx-auto px-6 border-t-2 border-[var(--color-text)] bg-[var(--color-neutral-100)] overflow-x-auto">
                        {tabs.map((tab) => (
                            <a
                                key={tab.href}
                                href={tab.href}
                                className="px-4 pt-[11px] pb-[9px] font-bold text-[11.5px] tracking-[0.04em] uppercase text-[var(--color-neutral-600)] hover:text-[var(--color-text)] whitespace-nowrap transition-colors"
                            >
                                {tab.label}
                            </a>
                        ))}
                    </div>
                )}

                <div className={`md:hidden overflow-hidden transition-all duration-300 border-t-2 border-[var(--color-text)] ${isOpen ? "max-h-64" : "max-h-0 border-t-0"}`}>
                    <div className="px-6 py-5 flex flex-col gap-4">
                        {tabs.map((tab) => (
                            <a
                                key={tab.href}
                                href={tab.href}
                                onClick={handleLinkClick}
                                className="font-bold text-xs uppercase tracking-[0.06em] text-[var(--color-neutral-700)] hover:text-[var(--color-text)] transition-colors"
                            >
                                {tab.label}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                setShowResume(true);
                                setIsOpen(false);
                            }}
                            className="text-center px-4 py-2.5 bg-[var(--color-text)] text-white font-bold text-xs uppercase tracking-[0.06em]"
                        >
                            Résumé ↓
                        </button>
                    </div>
                </div>
            </header>

            {showResume && <ResumeModal profile={profile} onClose={() => setShowResume(false)} />}
        </>
    );
}
