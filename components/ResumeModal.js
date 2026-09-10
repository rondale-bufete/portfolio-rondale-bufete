"use client";

import { useEffect } from "react";

function getResumeFilename(name) {
    const cleaned = (name || "resume").trim().replace(/\s+/g, "-");
    return `${cleaned}-Resume.pdf`;
}

export default function ResumeModal({ profile, onClose }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[var(--color-bg)] border-2 border-[var(--color-text)] w-full max-w-3xl h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-3 border-b-2 border-[var(--color-divider)]">
                    <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold text-[var(--color-text)]">Resume</h2>
                    <div className="flex items-center gap-2">
                        <a
                            href={profile?.resumeUrl}
                            download={getResumeFilename(profile?.name)}
                            className="text-sm font-bold px-3 py-1.5 bg-[var(--color-text)] text-white hover:bg-[var(--color-accent)] transition-colors"
                        >
                            Download
                        </a>
                        <button
                            onClick={onClose}
                            className="text-[var(--color-neutral-600)] hover:text-[var(--color-text)] text-xl leading-none px-2"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <iframe
                        src={profile?.resumeUrl}
                        title="Resume preview"
                        className="w-full h-full"
                    />
                </div>

                {/* Mobile fallback — some mobile browsers don't render PDFs inline */}
                <p className="sm:hidden text-center text-xs text-[var(--color-neutral-600)] py-3 border-t-2 border-[var(--color-divider)]">
                    Preview not showing?{" "}
                    <a href={profile?.resumeUrl} download={getResumeFilename(profile?.name)} className="text-[var(--color-accent-700)] hover:underline">
                        Download instead
                    </a>
                </p>
            </div>
        </div>
    );
}
