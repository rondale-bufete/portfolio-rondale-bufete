"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
import { useModalBehavior } from "@/components/useModalBehavior";

// Asked only before something can't be undone. Focus starts on Cancel.
export default function ConfirmDialog({ title = "Delete this?", message, confirmLabel = "Delete", onCancel, onConfirm }) {
    const dialogRef = useModalBehavior(onCancel);
    const titleId = useId();
    const messageId = useId();

    return createPortal(
        <div
            className="admin-dialog-backdrop"
            onClick={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
        >
            <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} className="admin-dialog">
                <h2 id={titleId} className="admin-dialog__title">
                    {title}
                </h2>
                <p id={messageId} className="admin-dialog__body">
                    {message}
                </p>
                <div className="admin-dialog__actions">
                    <button type="button" onClick={onCancel} className="button button--ghost button--compact">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="button button--danger button--compact">
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.querySelector(".admin-shell") ?? document.body
    );
}
