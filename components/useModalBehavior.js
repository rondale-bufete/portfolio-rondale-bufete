"use client";

import { useEffect, useEffectEvent, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])';

// Counted rather than a flag so a modal opened over another one (e.g. a
// result pop-up over a form) doesn't unlock the page when it closes first.
let openModalCount = 0;

// While any modal is open, <body data-modal-open> lets page-level overlays
// such as the chat widget step out of the way (see globals.css).
function lockPage() {
    openModalCount += 1;
    document.body.style.overflow = "hidden";
    document.body.dataset.modalOpen = "true";
}

function unlockPage() {
    openModalCount = Math.max(0, openModalCount - 1);
    if (openModalCount > 0) return;
    document.body.style.overflow = "";
    delete document.body.dataset.modalOpen;
}

// Share dialog scroll locking, keyboard focus handling, and focus restoration.
export function useModalBehavior(onClose) {
    const dialogRef = useRef(null);
    const handleClose = useEffectEvent(() => onClose());

    useEffect(() => {
        const dialog = dialogRef.current;
        const previouslyFocused = document.activeElement;
        lockPage();
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
            unlockPage();
            previouslyFocused?.focus?.();
        };
    }, []);

    return dialogRef;
}
