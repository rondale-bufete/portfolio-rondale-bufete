"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ResumeModal from "./ResumeModal";

function tabLabel(label) {
    return (label || "").replace(/^\d+\s*[—-]\s*/, "");
}

function handleSlug(name) {
    return (name || "").trim().split(/\s+/).join(".").toLowerCase() || "rondale.bufete";
}

export default function Navbar({ profile, sections = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showResume, setShowResume] = useState(false);
    const [activeHash, setActiveHash] = useState("work");
    const pathname = usePathname();

    useEffect(() => {
        function updateActiveHash() {
            setActiveHash(window.location.hash.slice(1) || "work");
        }

        updateActiveHash();
        window.addEventListener("hashchange", updateActiveHash);
        const observer = "IntersectionObserver" in window
            ? new IntersectionObserver((entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];
                if (visible) setActiveHash(visible.target.id);
            }, { rootMargin: "-20% 0px -65% 0px" })
            : null;
        document.querySelectorAll(".portfolio-site main > section[id]").forEach((section) => observer?.observe(section));

        return () => {
            window.removeEventListener("hashchange", updateActiveHash);
            observer?.disconnect();
        };
    }, []);

    const aboutSection = sections.find((s) => s.kind === "about");
    const projectsSection = sections.find((s) => s.kind === "projects");
    const contactSection = sections.find((s) => s.kind === "contact");
    const customSections = sections.filter((s) => s.kind === "custom");

    const sectionHref = (id) => `${pathname === "/" ? "" : "/"}#${id}`;

    const tabs = [
        { href: sectionHref("work"), label: "Work" },
        ...(aboutSection ? [{ href: sectionHref("about"), label: tabLabel(aboutSection.label) || "About" }] : []),
        ...(projectsSection ? [{ href: sectionHref("projects"), label: tabLabel(projectsSection.label) || "Projects" }] : []),
        ...customSections.map((section) => ({ href: sectionHref(`section-${section.id}`), label: tabLabel(section.label) || "More" })),
        ...(contactSection ? [{ href: sectionHref("contact"), label: tabLabel(contactSection.label) || "Contact" }] : []),
    ];

    function isActive(href) {
        return pathname === "/" && activeHash === href.split("#")[1];
    }

    function handleLinkClick(event, href) {
        setIsOpen(false);
        const sectionId = href.split("#")[1] || "work";
        setActiveHash(sectionId);

        if (href.startsWith("#")) {
            event.preventDefault();
            window.history.pushState(null, "", href);
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const socials = [
        profile?.github && { label: "github", href: profile.github },
        profile?.linkedin && { label: "linkedin", href: profile.linkedin },
        profile?.facebook && { label: "facebook", href: profile.facebook },
        profile?.instagram && { label: "instagram", href: profile.instagram },
    ].filter(Boolean);

    return (
        <>
            <header className="site-nav">
                <nav className="site-nav__inner">
                    <Link href="/" className="site-nav__brand">
                        <span className="site-nav__monogram" aria-hidden="true">RB</span>
                        <span className="site-nav__name">{profile?.name || handleSlug(profile?.name)}</span>
                    </Link>

                    <div className="site-nav__links">
                        {tabs.map((tab) => {
                            const active = isActive(tab.href);
                            const TabLink = tab.href.startsWith("#") ? "a" : Link;
                            return (
                                <TabLink
                                    key={tab.href}
                                    href={tab.href}
                                    onClick={(event) => handleLinkClick(event, tab.href)}
                                    className={`site-nav__link ${active ? "is-active" : ""}`}
                                >
                                    {tab.label.toLowerCase()}
                                </TabLink>
                            );
                        })}
                    </div>

                    <div className="site-nav__actions">
                        {profile?.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="site-nav__social">GitHub</a>}
                        {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="site-nav__social">LinkedIn</a>}
                        <button onClick={() => setShowResume(true)} className="site-nav__resume">
                            Resume <span aria-hidden="true">↗</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsOpen((open) => !open)}
                        className="site-nav__menu-toggle"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
                    </button>
                </nav>
            </header>

            {isOpen && (
                <div className="site-nav__mobile-panel">
                    <nav className="site-nav__mobile-links">
                        {tabs.map((tab, index) => {
                            const active = isActive(tab.href);
                            const TabLink = tab.href.startsWith("#") ? "a" : Link;
                            return (
                                <TabLink
                                    key={tab.href}
                                    href={tab.href}
                                    onClick={(event) => handleLinkClick(event, tab.href)}
                                    className={`site-nav__mobile-link ${active ? "is-active" : ""}`}
                                >
                                    <span>{tab.label.toLowerCase()}</span>
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                </TabLink>
                            );
                        })}
                    </nav>

                    <div className="site-nav__mobile-actions">
                        <button
                            onClick={() => {
                                setShowResume(true);
                                setIsOpen(false);
                            }}
                            className="site-nav__resume"
                        >
                            Resume <span aria-hidden="true">↗</span>
                        </button>
                        {socials.length > 0 && (
                            <div className="site-nav__mobile-socials">
                                {socials.map((social) => (
                                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">{social.label}</a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showResume && <ResumeModal profile={profile} onClose={() => setShowResume(false)} />}
        </>
    );
}
