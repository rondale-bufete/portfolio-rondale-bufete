"use client";

import { useEffect } from "react";

export default function FormStatusModal({ status, onClose, title, message, buttonLabel }) {
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

    const isSuccess = status === "success";

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] max-w-sm w-full p-6 shadow-[0_24px_80px_rgba(0,0,0,.5)]"
                onClick={(e) => e.stopPropagation()}
            >
                <p
                    className={`font-[family-name:var(--font-mono)] text-xs mb-2.5 ${isSuccess ? "text-[var(--color-live)]" : "text-[var(--color-danger-text)]"}`}
                >
                    {isSuccess ? "SENT SUCCESSFULLY" : "NOT SENT"}
                </p>

                <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)] mb-1.5">
                    {title || (isSuccess ? "Message sent" : "Something went wrong")}
                </h3>

                <p className="text-[var(--color-body)] text-sm leading-relaxed mb-6">
                    {message || (isSuccess
                        ? "Thanks for reaching out — I'll get back to you soon."
                        : "Your message couldn't be sent. Please try again, or email me directly.")}
                </p>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-primary"
                    >
                        {buttonLabel || "done"}
                    </button>
                </div>
            </div>
        </div>
    );
}