"use client";

import { useEffect, useEffectEvent, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])';

// Share dialog scroll locking, keyboard focus handling, and focus restoration.
export function useModalBehavior(onClose) {
    const dialogRef = useRef(null);
    const handleClose = useEffectEvent(() => onClose());

    useEffect(() => {
        const dialog = dialogRef.current;
        const previouslyFocused = document.activeElement;
        document.body.style.overflow = "hidden";
        dialog?.querySelector(FOCUSABLE)?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                handleClose();
                return;
            }
            if (event.key !== "Tab" || !dialog) return;

            const focusable = [...dialog.querySelectorAll(FOCUSABLE)];
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            previouslyFocused?.focus?.();
        };
    }, []);

    return dialogRef;
}
