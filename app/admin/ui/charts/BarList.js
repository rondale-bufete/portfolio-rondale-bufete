import { formatCount } from "@/lib/chartScale";

// Ranked rows with the value printed and a bar scaled to the largest row, so
// it reads like a small table with a chart built in.
export default function BarList({ rows, total, label }) {
    const max = Math.max(1, ...rows.map((row) => row.value));

    return (
        <ul className="bar-list" aria-label={label}>
            {rows.map((row) => (
                <li key={row.key} className="bar-list__row">
                    <span className="bar-list__label" title={row.title}>
                        {row.label}
                    </span>
                    <span className="bar-list__value">
                        {formatCount(row.value)}
                        {total > 0 && <span>{Math.round((row.value / total) * 100)}%</span>}
                    </span>
                    <span className="bar-list__track" aria-hidden="true">
                        <span className="bar-list__bar" style={{ "--share": `${(row.value / max) * 100}%` }} />
                    </span>
                </li>
            ))}
        </ul>
    );
}
