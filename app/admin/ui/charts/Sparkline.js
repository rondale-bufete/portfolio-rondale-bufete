// A small trend line for a stat tile; the tile's number carries the value.
export default function Sparkline({ values, width = 96, height = 32, color = "var(--series-1)" }) {
    if (!values?.length || values.every((value) => value === 0)) return null;

    const max = Math.max(...values, 1);
    const x = (index) => (values.length === 1 ? width : (index / (values.length - 1)) * width);
    const y = (value) => height - 3 - (value / max) * (height - 6);
    const points = values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(" ");

    return (
        <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={x(values.length - 1)} cy={y(values.at(-1))} r="3" fill={color} />
        </svg>
    );
}
