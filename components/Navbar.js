"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ResumeModal from "./ResumeModal";
import { CloseIcon, FacebookIcon, GitHubIcon, InstagramIcon, LinkedInIcon, MenuIcon } from "./icons";
import Logo from "./Logo";
import { stripOrdinal } from "@/lib/format";
import { prefersReducedMotion } from "@/lib/motion";

const FALLBACK_LABELS = { about: "About", projects: "Projects", contact: "Contact", custom: "More" };

// Tabs follow the section order set in the admin, so reordering sections
// there reorders the nav too. The intro has no tab: the name goes home.
export function buildTabs(sections = []) {
    return sections
        .filter((section) => FALLBACK_LABELS[section.kind])
        .map((section) => ({
            anchor: section.kind === "custom" ? `section-${section.id}` : section.kind,
            label: stripOrdinal(section.label) || FALLBACK_LABELS[section.kind],
        }));
}

function scrollBehavior() {
    return prefersReducedMotion() ? "auto" : "smooth";
}

export default function Navbar({ profile, sections = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showResume, setShowResume] = useState(false);
    const [activeAnchor, setActiveAnchor] = useState("");
    const pathname = usePathname();
    const isHome = pathname === "/";
    const tabs = buildTabs(sections);
    const linksRef = useRef(null);
    const tabRefs = useRef({});

    useEffect(() => {
        if (!isHome) return;
        function syncFromHash() {
            setActiveAnchor(window.location.hash.slice(1));
        }
        syncFromHash();
        window.addEventListener("hashchange", syncFromHash);
        if (!("IntersectionObserver" in window)) return () => window.removeEventListener("hashchange", syncFromHash);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];
                if (visible) setActiveAnchor(visible.target.id === "work" ? "" : visible.target.id);
            },
            { rootMargin: "-20% 0px -65% 0px" }
        );
        document.querySelectorAll(".portfolio-site main > section[id]").forEach((section) => observer.observe(section));
        return () => {
            window.removeEventListener("hashchange", syncFromHash);
            observer.disconnect();
        };
    }, [isHome]);

    // Slide the underline to the active tab; measured from the DOM so it fits any label length.
    useLayoutEffect(() => {
        const container = linksRef.current;
        if (!container) return;

        function placeIndicator() {
            const activeTab = tabRefs.current[activeAnchor];
            if (!activeTab) {
                container.style.setProperty("--indicator-opacity", "0");
                return;
            }
            container.style.setProperty("--indicator-x", `${activeTab.offsetLeft}px`);
            container.style.setProperty("--indicator-width", `${activeTab.offsetWidth}px`);
            container.style.setProperty("--indicator-opacity", "1");
        }

        placeIndicator();
        window.addEventListener("resize", placeIndicator);
        return () => window.removeEventListener("resize", placeIndicator);
    }, [activeAnchor, tabs.length]);

    function hrefFor(anchor) {
        return `${isHome ? "" : "/"}#${anchor}`;
    }

    function handleTabClick(event, anchor) {
        setIsOpen(false);
        setActiveAnchor(anchor);
        if (!isHome) return;
        event.preventDefault();
        window.history.pushState(null, "", `#${anchor}`);
        document.getElementById(anchor)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }

    function handleBrandClick(event) {
        setIsOpen(false);
        if (!isHome) return;
        event.preventDefault();
        setActiveAnchor("");
        window.history.replaceState(null, "", "/");
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
    }

    const socials = [
        profile?.github && { label: "GitHub", href: profile.github, Icon: GitHubIcon },
        profile?.linkedin && { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon },
        profile?.facebook && { label: "Facebook", href: profile.facebook, Icon: FacebookIcon },
        profile?.instagram && { label: "Instagram", href: profile.instagram, Icon: InstagramIcon },
    ].filter(Boolean);

    return (
        <>
            <header className="site-nav">
                <nav className="site-nav__inner" aria-label="Main">
                    <Link href="/" className="site-nav__brand" onClick={handleBrandClick}>
                        <Logo size={38} />
                        <span className="site-nav__name">{profile?.name}</span>
                    </Link>

                    <div ref={linksRef} className="site-nav__links">
                        {tabs.map((tab) => (
                            <a
                                key={tab.anchor}
                                ref={(node) => {
                                    tabRefs.current[tab.anchor] = node;
                                }}
                                href={hrefFor(tab.anchor)}
                                onClick={(event) => handleTabClick(event, tab.anchor)}
                                aria-current={isHome && activeAnchor === tab.anchor ? "location" : undefined}
                                className={`site-nav__link ${isHome && activeAnchor === tab.anchor ? "is-active" : ""}`}
                            >
                                {tab.label}
                            </a>
                        ))}
                        <span className="site-nav__indicator" aria-hidden="true" />
                    </div>

                    <div className="site-nav__actions">
                        {socials.slice(0, 2).map(({ label, href }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="site-nav__social">
                                {label}
                            </a>
                        ))}
                        {profile?.resumeUrl && (
                            <button type="button" onClick={() => setShowResume(true)} className="site-nav__resume">
                                Resume
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        className="site-nav__menu-toggle"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
                    </button>
                </nav>
            </header>

            {isOpen && (
                <div className="site-nav__panel">
                    <nav className="site-nav__panel-links" aria-label="Main">
                        {tabs.map((tab, index) => (
                            <a
                                key={tab.anchor}
                                href={hrefFor(tab.anchor)}
                                onClick={(event) => handleTabClick(event, tab.anchor)}
                                style={{ "--i": index }}
                                className={`site-nav__panel-link ${isHome && activeAnchor === tab.anchor ? "is-active" : ""}`}
                            >
                                {tab.label}
                            </a>
                        ))}
                    </nav>

                    <div className="site-nav__panel-actions">
                        {profile?.resumeUrl && (
                            <button
                                type="button"
                                onClick={() => {
                                    setShowResume(true);
                                    setIsOpen(false);
                                }}
                                className="site-nav__resume"
                            >
                                Resume
                            </button>
                        )}
                        {socials.length > 0 && (
                            <div className="site-nav__panel-socials">
                                {socials.map(({ label, href, Icon }) => (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                        <Icon size={20} />
                                    </a>
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
