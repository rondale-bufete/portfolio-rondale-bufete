// Small stroke icons for the project page; decorative, so hidden from
// assistive tech (the surrounding control carries the accessible name).
function Icon({ children, size = 18, className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={className}
        >
            {children}
        </svg>
    );
}

export function ArrowLeftIcon(props) {
    return (
        <Icon {...props}>
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </Icon>
    );
}

export function ArrowRightIcon(props) {
    return (
        <Icon {...props}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </Icon>
    );
}

export function ExternalLinkIcon(props) {
    return (
        <Icon {...props}>
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </Icon>
    );
}

export function CloseIcon(props) {
    return (
        <Icon {...props}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </Icon>
    );
}
