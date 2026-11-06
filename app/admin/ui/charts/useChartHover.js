"use client";

import { useEffect, useRef, useState } from "react";

// The readout sits beside the hovered point, flipping to its left past the
// middle, so it never covers the values it describes.
export function tooltipPosition(x, width, top) {
    return { left: x, top, transform: x > width * 0.55 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" };
}

// Shared by the line and column charts: tracks the chart's rendered width and
// which data point the pointer (or arrow keys) is on.
export function useChartHover(count, initialWidth = 640) {
    const frameRef = useRef(null);
    const [width, setWidth] = useState(initialWidth);
    const [active, setActive] = useState(null);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
        observer.observe(frame);
        return () => observer.disconnect();
    }, []);

    function indexAt(clientX, left, plotLeft, plotWidth) {
        const ratio = (clientX - left - plotLeft) / plotWidth;
        return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
    }

    function handleKeyDown(event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        setActive((current) => {
            const start = current ?? count - 1;
            return Math.min(count - 1, Math.max(0, start + (event.key === "ArrowRight" ? 1 : -1)));
        });
    }

    return { frameRef, width, active, setActive, indexAt, handleKeyDown };
}
