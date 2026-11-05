"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

const GRID_SIZE = 32;

// A drafting-lamp highlight that follows the cursor across the blueprint grid
// behind the hero. It writes CSS variables straight onto its own element, so
// moving the mouse never re-renders React. Mouse/trackpad only.
export default function PointerSpotlight() {
    const layerRef = useRef(null);

    useEffect(() => {
        const layer = layerRef.current;
        const host = layer?.parentElement;
        if (!layer || !host || prefersReducedMotion() || !hasFinePointer()) return;

        // Line the highlight's grid up with the page's grid, which starts at the site wrapper's corner.
        function alignGrid() {
            const site = host.closest(".portfolio-site") ?? document.body;
            const siteRect = site.getBoundingClientRect();
            const hostRect = host.getBoundingClientRect();
            layer.style.setProperty("--grid-x", `${(siteRect.left - hostRect.left) % GRID_SIZE}px`);
            layer.style.setProperty("--grid-y", `${(siteRect.top - hostRect.top) % GRID_SIZE}px`);
        }

        let frame = 0;
        function handleMove(event) {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const rect = host.getBoundingClientRect();
                layer.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
                layer.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
                layer.dataset.active = "true";
            });
        }
        function handleLeave() {
            cancelAnimationFrame(frame);
            delete layer.dataset.active;
        }

        alignGrid();
        host.addEventListener("pointermove", handleMove);
        host.addEventListener("pointerleave", handleLeave);
        window.addEventListener("resize", alignGrid);
        return () => {
            cancelAnimationFrame(frame);
            host.removeEventListener("pointermove", handleMove);
            host.removeEventListener("pointerleave", handleLeave);
            window.removeEventListener("resize", alignGrid);
        };
    }, []);

    return <div ref={layerRef} className="pointer-spotlight" aria-hidden="true" />;
}
