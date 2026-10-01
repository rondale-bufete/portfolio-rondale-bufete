const TONES = {
    neutral: "bg-[var(--color-raised)] text-[var(--color-body)]",
    accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    danger: "bg-[var(--color-danger-solid)]/10 text-[var(--color-danger-text)]",
};

export default function Badge({ children, tone = "neutral" }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] font-[family-name:var(--font-mono)] text-[11px] font-medium whitespace-nowrap ${TONES[tone] || TONES.neutral}`}
        >
            {children}
        </span>
    );
}
