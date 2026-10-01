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
                className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,.5)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)]">
                    <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-text)]">
                        Resume <span className="text-[var(--color-faint)]">· PDF preview</span>
                    </div>
                    <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-sm">
                        <a
                            href={profile?.resumeUrl}
                            download={getResumeFilename(profile?.name)}
                            className="rounded-[var(--radius-md)] px-3.5 py-2 bg-[var(--color-accent)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
                        >
                            Download PDF ↓
                        </a>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] text-[var(--color-text)] hover:bg-[var(--color-raised)] transition-colors"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-[var(--color-bg)]">
                    <iframe
                        src={profile?.resumeUrl}
                        title="Resume preview"
                        className="w-full h-full"
                    />
                </div>

                {/* Mobile fallback — some mobile browsers don't render PDFs inline */}
                <p className="sm:hidden text-center text-xs text-[var(--color-faint)] py-3 border-t border-[var(--color-border)]">
                    Preview not showing?{" "}
                    <a href={profile?.resumeUrl} download={getResumeFilename(profile?.name)} className="text-[var(--color-accent)] hover:underline">
                        Download instead
                    </a>
                </p>
            </div>
        </div>
    );
}
