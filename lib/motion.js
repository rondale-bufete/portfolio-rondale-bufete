// JS-driven effects (reveals, tilt, spotlight) check these before running;
// CSS animations are switched off by the reduced-motion rule in globals.css.
export function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export function hasFinePointer() {
    return typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches === true;
}
