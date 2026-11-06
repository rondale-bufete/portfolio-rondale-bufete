// The site's logo: a blue "RB" square on an offset ink plate, the same
// plate motif used across the site. The letters are Space Grotesk Bold
// converted to outlines, so the mark matches public/brand/*.svg and the
// favicon (app/icon.svg) wherever it's drawn. Decorative: the link around it
// carries the accessible name.
export const LOGO_LETTERS =
    "M16.5 41.45V22.55H24.71Q26.49 22.55 27.82 23.17Q29.14 23.79 29.87 24.93Q30.6 26.06 30.6 27.6V27.92Q30.6 29.62 29.79 30.68Q28.98 31.73 27.79 32.22V32.7Q28.87 32.76 29.46 33.44Q30.06 34.13 30.06 35.27V41.45H26.49V35.78Q26.49 35.13 26.15 34.73Q25.82 34.32 25.03 34.32H20.07V41.45ZM20.07 31.08H24.33Q25.6 31.08 26.32 30.39Q27.03 29.71 27.03 28.57V28.3Q27.03 27.17 26.33 26.48Q25.63 25.79 24.33 25.79H20.07ZM31.95 41.45V38.32H34.43V25.68H31.95V22.55H41.67Q43.39 22.55 44.68 23.13Q45.96 23.71 46.67 24.78Q47.39 25.84 47.39 27.33V27.6Q47.39 28.9 46.9 29.72Q46.42 30.54 45.76 30.99Q45.09 31.43 44.5 31.62V32.11Q45.09 32.27 45.8 32.72Q46.5 33.16 47 34Q47.5 34.84 47.5 36.19V36.46Q47.5 38.02 46.77 39.14Q46.04 40.26 44.76 40.86Q43.48 41.45 41.77 41.45ZM37.99 38.21H41.34Q42.5 38.21 43.22 37.64Q43.93 37.08 43.93 36.02V35.75Q43.93 34.7 43.23 34.13Q42.53 33.57 41.34 33.57H37.99ZM37.99 30.33H41.29Q42.4 30.33 43.11 29.76Q43.83 29.19 43.83 28.19V27.92Q43.83 26.9 43.12 26.34Q42.42 25.79 41.29 25.79H37.99Z";

const MARK = 64;
const PLATE_OFFSET = 8;

export default function Logo({ size = 38, plate = true, className = "" }) {
    // Keep the plate's outline 1.5–3 px wide on screen at any size.
    const stroke = (Math.min(3, Math.max(1.5, size / 19)) * MARK) / size;
    const view = plate ? MARK + PLATE_OFFSET : MARK;
    const box = (size * view) / MARK;

    return (
        <svg
            className={`logo ${className}`.trim()}
            width={box}
            height={box}
            viewBox={`0 0 ${view} ${view}`}
            aria-hidden="true"
            focusable="false"
        >
            {plate && (
                <rect
                    className="logo__plate"
                    x={PLATE_OFFSET + stroke / 2}
                    y={PLATE_OFFSET + stroke / 2}
                    width={MARK - stroke}
                    height={MARK - stroke}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                />
            )}
            <g className="logo__mark">
                <rect width={MARK} height={MARK} fill="var(--color-accent, #2563eb)" />
                <path d={LOGO_LETTERS} fill="#fff" />
            </g>
        </svg>
    );
}
