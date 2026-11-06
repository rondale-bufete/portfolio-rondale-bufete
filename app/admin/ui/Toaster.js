"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertIcon, CheckIcon } from "@/components/icons";

const ToastContext = createContext(null);
const VISIBLE_MS = 3200;
const MAX_VISIBLE = 3;

// Short, self-dismissing confirmations ("Changes saved") so routine edits never
// stop for an OK button. The region is always mounted so screen readers
// announce each message.
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);

    const show = useCallback((message, tone = "success") => {
        nextId.current += 1;
        const id = nextId.current;
        setToasts((current) => [...current.slice(1 - MAX_VISIBLE), { id, message, tone }]);
        setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), VISIBLE_MS);
    }, []);

    const value = useMemo(() => ({ show }), [show]);

    return (
        <ToastContext value={value}>
            {children}
            <div className="admin-toasts" role="status" aria-live="polite">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`admin-toast admin-toast--${toast.tone}`}>
                        <span className="admin-toast__icon" aria-hidden="true">
                            {toast.tone === "error" ? <AlertIcon size={16} /> : <CheckIcon size={16} />}
                        </span>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
