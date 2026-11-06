"use client";

import { niceTicks, formatCount, shortDate } from "@/lib/chartScale";
import { tooltipPosition, useChartHover } from "./useChartHover";

const PAD = { top: 12, right: 8, bottom: 28, left: 36 };
const MAX_BAR = 24;
const RADIUS = 4;

// A bar with a rounded data end and a square foot on the baseline.
function columnPath(left, top, width, base) {
    const radius = Math.min(RADIUS, width / 2, base - top);
    if (base - top <= 0) return "";
    return `M${left},${base}V${top + radius}Q${left},${top} ${left + radius},${top}H${left + width - radius}Q${left + width},${top} ${left + width},${top + radius}V${base}Z`;
}

// One value per day. Each column is its own hover and keyboard target.
export default function ColumnChart({ dates, values, color = "var(--series-1)", height = 200, label, unit }) {
    const { frameRef, width, active, setActive, handleKeyDown } = useChartHover(dates.length);
    const plotWidth = width - PAD.left - PAD.right;
    const plotHeight = height - PAD.top - PAD.bottom;
    const ticks = niceTicks(Math.max(1, ...values), 3);
    const top = ticks.at(-1);
    const slot = plotWidth / dates.length;
    const barWidth = Math.max(2, Math.min(MAX_BAR, slot - 2));
    const base = PAD.top + plotHeight;
    const y = (value) => base - (value / top) * plotHeight;
    const center = (index) => PAD.left + slot * index + slot / 2;
    const labelEvery = Math.ceil(dates.length / 6);

    return (
        <div ref={frameRef} className="chart-frame">
            <svg className="chart-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
                <g className="chart-grid">
                    {ticks.map((tick) => (
                        <line key={tick} x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} />
                    ))}
                </g>
                {ticks.map((tick) => (
                    <text key={tick} x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end">
                        {formatCount(tick)}
                    </text>
                ))}
                {dates.map((date, index) =>
                    index % labelEvery === 0 || index === dates.length - 1 ? (
                        <text key={date} x={center(index)} y={height - 8} textAnchor="middle">
                            {shortDate(date)}
                        </text>
                    ) : null
                )}
                {values.map((value, index) => (
                    <path
                        key={dates[index]}
                        d={columnPath(center(index) - barWidth / 2, y(value), barWidth, base)}
                        fill={color}
                        opacity={active === null || active === index ? 1 : 0.45}
                    />
                ))}
                <line className="chart-axis" x1={PAD.left} x2={width - PAD.right} y1={base} y2={base} />
                <rect
                    x={PAD.left}
                    y={PAD.top}
                    width={plotWidth}
                    height={plotHeight}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${label}. Use the left and right arrow keys to read each day.`}
                    onPointerMove={(event) => {
                        const box = event.currentTarget.ownerSVGElement.getBoundingClientRect();
                        const index = Math.floor((event.clientX - box.left - PAD.left) / slot);
                        setActive(Math.min(dates.length - 1, Math.max(0, index)));
                    }}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(dates.length - 1)}
                    onBlur={() => setActive(null)}
                    onKeyDown={handleKeyDown}
                />
            </svg>

            {active !== null && (
                <div className="chart-tooltip" style={tooltipPosition(center(active), width, PAD.top)} aria-live="polite">
                    <p className="chart-tooltip__title">{shortDate(dates[active])}</p>
                    <p className="chart-tooltip__row">
                        <strong>{formatCount(values[active])}</strong>
                        {unit}
                    </p>
                </div>
            )}
        </div>
    );
}
