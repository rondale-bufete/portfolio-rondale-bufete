"use client";

import { useEffect } from "react";
import { profile } from "@/data/portfolio";

function getResumeFilename(name) {
    const cleaned = name.trim().replace(/\s+/g, "-");
    return `${cleaned}-Resume.pdf`;
}

export default function ResumeModal({ onClose }) {
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#E4E4E7]">
                    <h2 className="font-[family-name:var(--font-display)] text-lg">Resume</h2>
                    <div className="flex items-center gap-2">
                        <a
                            href={profile.resumeUrl}
                            download={getResumeFilename(profile.name)}
                            className="text-sm px-3 py-1.5 rounded-md bg-[#14161A] text-white hover:bg-[#3355FF] transition-colors"
                        >
                            Download
                        </a>
                        <button
                            onClick={onClose}
                            className="text-[#5B5F66] hover:text-[#14161A] text-xl leading-none px-2"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <iframe
                        src={profile.resumeUrl}
                        title="Resume preview"
                        className="w-full h-full"
                    />
                </div>

                {/* Mobile fallback — some mobile browsers don't render PDFs inline */}
                <p className="sm:hidden text-center text-xs text-[#5B5F66] py-3 border-t border-[#E4E4E7]">
                    Preview not showing?{" "}
                    <a href={profile.resumeUrl} download={getResumeFilename(profile.name)} className="text-[#3355FF] hover:underline">
                        Download instead
                    </a>
                </p>
            </div>
        </div>
    );
}