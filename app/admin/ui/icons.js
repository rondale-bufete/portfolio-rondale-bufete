function base(props) {
    return {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
    };
}

export function ChevronIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    );
}

export function PlusIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

export function ArrowUpIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
    );
}

export function ArrowDownIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
    );
}

export function ExternalLinkIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
        </svg>
    );
}

export function TrashIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M4 7h16" />
            <path d="M10 11v6M14 11v6" />
            <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
            <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        </svg>
    );
}

export function EyeIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export function EyeOffIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.6 18.6 0 0 1 4.22-5.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <path d="M1 1l22 22" />
        </svg>
    );
}

export function LogOutIcon({ className }) {
    return (
        <svg {...base({ className })}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}
