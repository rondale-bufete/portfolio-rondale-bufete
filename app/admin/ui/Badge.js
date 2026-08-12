const TONES = {
    neutral: "bg-[#F0F0F2] text-[#5B5F66]",
    accent: "bg-[#3355FF]/10 text-[#3355FF]",
    success: "bg-[#1A9E4A]/10 text-[#1A9E4A]",
    danger: "bg-[#E5484D]/10 text-[#E5484D]",
};

export default function Badge({ children, tone = "neutral" }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${TONES[tone] || TONES.neutral}`}
        >
            {children}
        </span>
    );
}
