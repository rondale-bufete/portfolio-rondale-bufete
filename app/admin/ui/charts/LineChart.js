"use client";

import { niceTicks, formatCount, shortDate } from "@/lib/chartScale";
import { tooltipPosition, useChartHover } from "./useChartHover";

const PAD = { top: 12, right: 12, bottom: 28, left: 44 };

function xTickIndexes(count, maxTicks = 6) {
    if (count <= maxTicks) return Array.from({ length: count }, (_, index) => index);
    const step = Math.ceil((count - 1) / (maxTicks - 1));
    const indexes = [];
    for (let index = 0; index < count - 1; index += step) indexes.push(index);
    if (count - 1 - indexes.at(-1) < step / 2) indexes.pop();
    indexes.push(count - 1);
    return indexes;
}

// Daily values for one or more series on one axis. The first series gets a
// light area wash; hovering (or arrow keys) moves a crosshair that reads out
// every series at that day.
export default function LineChart({ dates, series, height = 240, label }) {
    const { frameRef, width, active, setActive, indexAt, handleKeyDown } = useChartHover(dates.length);
    const plotWidth = width - PAD.left - PAD.right;
    const plotHeight = height - PAD.top - PAD.bottom;
    const ticks = niceTicks(Math.max(1, ...series.flatMap((line) => line.values)));
    const top = ticks.at(-1);
    const x = (index) => PAD.left + (dates.length === 1 ? plotWidth / 2 : (index / (dates.length - 1)) * plotWidth);
    const y = (value) => PAD.top + plotHeight - (value / top) * plotHeight;
    const pathOf = (values) => values.map((value, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join("");
    const shown = active;

    return (
        <div ref={frameRef} className="chart-frame">
            <svg
                className="chart-svg"
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={label}
            >
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
                {xTickIndexes(dates.length).map((index) => (
                    <text key={dates[index]} x={x(index)} y={height - 8} textAnchor={index === 0 ? "start" : index === dates.length - 1 ? "end" : "middle"}>
                        {shortDate(dates[index])}
                    </text>
                ))}
                <line className="chart-axis" x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} />

                {series[0] && (
                    <path
                        d={`${pathOf(series[0].values)}L${x(dates.length - 1)},${y(0)}L${x(0)},${y(0)}Z`}
                        fill={series[0].color}
                        opacity="0.1"
                    />
                )}
                {series.map((line) => (
                    <path key={line.key} d={pathOf(line.values)} fill="none" stroke={line.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                ))}

                {shown !== null && <line className="chart-crosshair" x1={x(shown)} x2={x(shown)} y1={PAD.top} y2={y(0)} />}
                {series.map((line) => {
                    const index = shown ?? dates.length - 1;
                    return (
                        <circle
                            key={line.key}
                            cx={x(index)}
                            cy={y(line.values[index])}
                            r="4"
                            fill={line.color}
                            stroke="var(--color-surface)"
                            strokeWidth="2"
                        />
                    );
                })}

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
                        setActive(indexAt(event.clientX, box.left, PAD.left, plotWidth));
                    }}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(dates.length - 1)}
                    onBlur={() => setActive(null)}
                    onKeyDown={handleKeyDown}
                />
            </svg>

            {shown !== null && (
                <div
                    className="chart-tooltip"
                    style={tooltipPosition(x(shown), width, PAD.top)}
                    aria-live="polite"
                >
                    <p className="chart-tooltip__title">{shortDate(dates[shown])}</p>
                    {series.map((line) => (
                        <p key={line.key} className="chart-tooltip__row">
                            <span className="chart-key" style={{ "--key": line.color }} />
                            <strong>{formatCount(line.values[shown])}</strong>
                            {line.label}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
