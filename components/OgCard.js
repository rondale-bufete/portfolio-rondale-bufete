import { LOGO_LETTERS } from "./Logo";

// next/og uses Satori, which requires inline styles and flex for multi-child elements.
export const OG_SIZE = { width: 1200, height: 630 };

const COLORS = { bg: "#f4f6f8", text: "#18222f", body: "#465364", accent: "#2563eb" };

export default function OgCard({ eyebrow, title, subtitle, name, host }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "64px 80px",
                background: COLORS.bg,
                color: COLORS.text,
                borderTop: `12px solid ${COLORS.accent}`,
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                {eyebrow && (
                    <div style={{ fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: COLORS.accent, marginBottom: 28 }}>
                        {eyebrow}
                    </div>
                )}
                <div style={{ fontSize: title.length > 40 ? 58 : 84, fontWeight: 700, lineHeight: 1.08, maxWidth: 1040 }}>{title}</div>
                {subtitle && (
                    <div style={{ fontSize: 32, color: COLORS.body, marginTop: 28, lineHeight: 1.35, maxWidth: 1000 }}>{subtitle}</div>
                )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: COLORS.body }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <svg width="72" height="72" viewBox="0 0 72 72">
                        <rect x="9.5" y="9.5" width="61" height="61" fill="none" stroke={COLORS.text} strokeWidth="3" />
                        <rect width="64" height="64" fill={COLORS.accent} />
                        <path d={LOGO_LETTERS} fill="#ffffff" />
                    </svg>
                    <div style={{ color: COLORS.text, fontWeight: 600 }}>{name}</div>
                </div>
                <div>{host}</div>
            </div>
        </div>
    );
}
