"use client";

import { useLayoutEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const READY_CLASS = "motion-ready";

function isOnScreen(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

// Scroll reveals: elements marked data-reveal get data-revealed when they
// scroll into view, and globals.css animates them. Content only starts out
// hidden once this has run (html.motion-ready), and anything already on
// screen is revealed first, so server-rendered content never flashes away,
// stays visible without JavaScript, and isn't hidden at all with reduced motion.
// Elements added later (a filter change remounting the project grid) are
// picked up too, so nothing stays hidden. A layout effect, so the class is
// added and removed before paint when navigating between pages.
export default function MotionProvider() {
    useLayoutEffect(() => {
        if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

        const reveal = (element) => element.setAttribute("data-revealed", "");
        const pending = [...document.querySelectorAll("[data-reveal]:not([data-revealed])")];
        pending.filter(isOnScreen).forEach(reveal);

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -8% 0px" }
        );
        pending.filter((element) => !element.hasAttribute("data-revealed")).forEach((element) => observer.observe(element));

        // New elements are observed rather than revealed on the spot, so the
        // ones that land on screen still animate in.
        const mutations = new MutationObserver((records) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    const added = node.matches("[data-reveal]") ? [node] : [];
                    added.push(...node.querySelectorAll("[data-reveal]"));
                    added.filter((element) => !element.hasAttribute("data-revealed")).forEach((element) => observer.observe(element));
                }
            }
        });
        mutations.observe(document.body, { childList: true, subtree: true });

        const root = document.documentElement;
        root.classList.add(READY_CLASS);
        return () => {
            observer.disconnect();
            mutations.disconnect();
            root.classList.remove(READY_CLASS);
        };
    }, []);

    return null;
}
