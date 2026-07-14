"use client";

import { useState } from "react";
import Link from "next/link";
import { profile } from "@/data/portfolio";

const LINKS = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    function handleLinkClick() {
        setIsOpen(false);
    }

    return (
        <header className="sticky top-0 z-40 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-[#E4E4E7]">
            <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    href="#"
                    className="font-[family-name:var(--font-display)] font-medium text-lg tracking-tight"
                >
                    {profile.name}
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm text-[#5B5F66]">
                    {LINKS.map((link) => (
                        <a key={link.href} href={link.href} className="hover:text-[#14161A] transition-colors">
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={profile.resumeUrl}
                        className="hidden sm:inline-block text-sm font-medium px-4 py-2 rounded-md bg-[#14161A] text-white hover:bg-[#3355FF] transition-colors"
                    >
                        Resume
                    </a>

                    {/* Hamburger button, mobile only */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        <span
                            className={`block w-5 h-0.5 bg-[#14161A] transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-[#14161A] transition-opacity duration-300 ${isOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-[#14161A] transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile menu panel */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64" : "max-h-0"
                    }`}
            >
                <div className="px-6 pb-6 flex flex-col gap-4 text-sm">
                    {LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={handleLinkClick}
                            className="text-[#5B5F66] hover:text-[#14161A] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href={profile.resumeUrl}
                        className="sm:hidden inline-block text-center px-4 py-2 rounded-md bg-[#14161A] text-white font-medium"
                    >
                        Resume
                    </a>
                </div>
            </div>
        </header>
    );
}