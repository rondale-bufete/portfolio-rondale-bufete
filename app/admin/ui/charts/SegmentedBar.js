import { formatCount } from "@/lib/chartScale";

// One whole split into parts (e.g. desktop vs mobile). The legend names every
// part with its share, so color is never the only key.
export default function SegmentedBar({ parts, label }) {
    const total = parts.reduce((sum, part) => sum + part.value, 0);
    if (total === 0) return null;
    const share = (value) => Math.round((value / total) * 100);

    return (
        <div>
            <div className="segmented-bar" role="img" aria-label={`${label}: ${parts.map((part) => `${part.label} ${share(part.value)}%`).join(", ")}`}>
                {parts
                    .filter((part) => part.value > 0)
                    .map((part) => (
                        <span key={part.label} style={{ "--key": part.color, flexGrow: part.value }} title={`${part.label}: ${share(part.value)}%`} />
                    ))}
            </div>
            <ul className="chart-legend chart-legend--stacked">
                {parts.map((part) => (
                    <li key={part.label}>
                        <span className="chart-key chart-key--block" style={{ "--key": part.color }} />
                        {part.label}
                        <strong>{share(part.value)}%</strong>
                        <span>{formatCount(part.value)} views</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
