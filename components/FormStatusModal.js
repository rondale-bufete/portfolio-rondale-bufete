"use client";

import { useEffect } from "react";

export default function FormStatusModal({ status, onClose }) {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${isSuccess ? "bg-[#27C93F]/10" : "bg-[#E5484D]/10"
                        }`}
                >
                    <span className={`text-2xl ${isSuccess ? "text-[#27C93F]" : "text-[#E5484D]"}`}>
                        {isSuccess ? "✓" : "✕"}
                    </span>
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-xl font-medium mb-2">
                    {isSuccess ? "Message sent" : "Something went wrong"}
                </h3>

                <p className="text-[#5B5F66] text-sm leading-relaxed mb-6">
                    {isSuccess
                        ? "Thanks for reaching out — I'll get back to you soon."
                        : "Your message couldn't be sent. Please try again, or email me directly."}
                </p>

                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}