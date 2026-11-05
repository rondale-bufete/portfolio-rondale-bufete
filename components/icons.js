// One stroke icon set for the public site (24px grid, 1.75 stroke). Icons are
// decorative; the link or button around each one carries its accessible name.
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

export function ArrowDownIcon(props) {
    return (
        <Icon {...props}>
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
        </Icon>
    );
}

export function ArrowUpIcon(props) {
    return (
        <Icon {...props}>
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
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

export function MenuIcon(props) {
    return (
        <Icon {...props}>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </Icon>
    );
}

export function ChatIcon(props) {
    return (
        <Icon {...props}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
        </Icon>
    );
}

export function MailIcon(props) {
    return (
        <Icon {...props}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Icon>
    );
}

export function GitHubIcon(props) {
    return (
        <Icon {...props}>
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </Icon>
    );
}

export function LinkedInIcon(props) {
    return (
        <Icon {...props}>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </Icon>
    );
}

export function FacebookIcon(props) {
    return (
        <Icon {...props}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </Icon>
    );
}

export function InstagramIcon(props) {
    return (
        <Icon {...props}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <path d="M17.5 6.5h.01" />
        </Icon>
    );
}
