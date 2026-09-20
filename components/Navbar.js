"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ResumeModal from "./ResumeModal";
import { container } from "./SectionHeader";

function tabLabel(label) {
    return (label || "").replace(/^\d+\s*[—-]\s*/, "");
}

export default function Navbar({ profile, sections = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showResume, setShowResume] = useState(false);
    const pathname = usePathname();

    const aboutSection = sections.find((s) => s.kind === "about");
    const projectsSection = sections.find((s) => s.kind === "projects");
    const contactSection = sections.find((s) => s.kind === "contact");
    const customSections = sections.filter((s) => s.kind === "custom");

    const tabs = [
        { href: "/", label: "Work" },
        ...(aboutSection ? [{ href: "/about", label: tabLabel(aboutSection.label) || "About" }] : []),
        ...(projectsSection ? [{ href: "/projects", label: tabLabel(projectsSection.label) || "Projects" }] : []),
        ...customSections.map((s) => ({ href: `/#section-${s.id}`, label: tabLabel(s.label) || "More" })),
        ...(contactSection ? [{ href: "/contact", label: tabLabel(contactSection.label) || "Contact" }] : []),
    ];

    function isActive(href) {
        if (href === "/") return pathname === "/";
        return pathname === href || (href.startsWith("/") && !href.includes("#") && pathname.startsWith(href));
    }

    function handleLinkClick() {
        setIsOpen(false);
    }

    return (
        <>
            <header className="sticky top-0 z-40 bg-[var(--color-bg)] border-b-2 border-[var(--color-divider)]">
                <nav className={`${container} h-[52px] flex items-center justify-between gap-4`}>
                    <Link href="/" className="flex items-center gap-3.5 min-w-0">
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
                            Resumé ↓
                        </button>
                        {profile?.available && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--color-accent)] text-white font-bold text-[10px] tracking-[0.06em] uppercase">
                                <span className="w-[5px] h-[5px] rounded-full bg-white" />
                                {profile.statusLabel || "OPEN TO WORK"}
                            </span>
                        )}
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

                <div className={`hidden md:flex items-center ${container} border-t-2 border-[var(--color-divider)] bg-[var(--color-neutral-100)] overflow-x-auto`}>
                    {tabs.map((tab) => {
                        const active = isActive(tab.href);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`px-4 pt-[11px] pb-[9px] font-bold text-[11.5px] tracking-[0.04em] uppercase whitespace-nowrap transition-colors ${active ? "text-[var(--color-text)] shadow-[inset_0_-3px_0_var(--color-accent)]" : "text-[var(--color-neutral-600)] hover:text-[var(--color-text)]"}`}
                            >
                                {tab.label.toUpperCase()}
                            </Link>
                        );
                    })}
                </div>

                <div className={`md:hidden overflow-hidden transition-all duration-300 border-t-2 border-[var(--color-divider)] ${isOpen ? "max-h-64" : "max-h-0 border-t-0"}`}>
                    <div className="px-6 py-5 flex flex-col gap-4">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                onClick={handleLinkClick}
                                className="font-bold text-xs uppercase tracking-[0.06em] text-[var(--color-neutral-700)] hover:text-[var(--color-text)] transition-colors"
                            >
                                {tab.label.toUpperCase()}
                            </Link>
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
