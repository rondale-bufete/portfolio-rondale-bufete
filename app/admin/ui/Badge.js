const TONES = {
    neutral: "bg-[var(--color-neutral-200)] text-[var(--color-neutral-800)]",
    accent: "bg-[var(--color-accent-100)] text-[var(--color-accent-800)]",
    success: "bg-[#1A9E4A]/10 text-[#1A9E4A]",
    danger: "bg-[#E5484D]/10 text-[#E5484D]",
};

export default function Badge({ children, tone = "neutral" }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${TONES[tone] || TONES.neutral}`}
        >
            {children}
        </span>
    );
}
