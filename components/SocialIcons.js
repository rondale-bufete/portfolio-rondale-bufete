// Shared icon set for contact/social links — used by Footer's social row
// and Contact's "Direct" cards, so the GitHub/LinkedIn/Email marks aren't
// drawn twice with two chances to drift. Brand icons (GitHub, LinkedIn,
// Facebook, Instagram) are filled; generic contact-method icons (Mail,
// Phone, MapPin, Briefcase) are outline strokes, matching Instagram's
// square-cornered redraw to the site's zero-radius system.

export function GitHubIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.12c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.44-2.28 1.17-3.09-.12-.29-.51-1.46.11-3.04 0 0 .95-.31 3.12 1.17a10.8 10.8 0 0 1 5.68 0c2.17-1.48 3.12-1.17 3.12-1.17.62 1.58.23 2.75.11 3.04.73.81 1.17 1.84 1.17 3.09 0 4.41-2.7 5.39-5.27 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
        </svg>
    );
}

export function LinkedInIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.88v8.75H5.5V9.75Zm4.97 0h2.76v1.2h.04c.38-.73 1.32-1.5 2.72-1.5 2.9 0 3.44 1.91 3.44 4.39v6.66h-2.87v-6.24c0-1.48-.03-3.39-2.07-3.39-2.07 0-2.38 1.62-2.38 3.28v6.35H10.47V9.75Z" />
        </svg>
    );
}

export function FacebookIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M13.5 22v-8.5h2.9l.4-3.4h-3.3V7.9c0-1 .3-1.6 1.7-1.6h1.7V3.3C16.6 3.2 15.6 3 14.5 3c-2.5 0-4.3 1.6-4.3 4.4v2.7H7.3v3.4h2.9V22h3.3Z" />
        </svg>
    );
}

export function InstagramIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <rect x="2.5" y="2.5" width="19" height="19" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function EmailIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-11Zm2.05 1.14 6.45 4.8 6.45-4.8a.5.5 0 0 0-.38-.14H5.93a.5.5 0 0 0-.38.14Zm13.45 1.3-6.58 4.9a.75.75 0 0 1-.84 0L5.5 8.94v8.56c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5V8.94Z" />
        </svg>
    );
}

export function MailIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" />
            <path d="m2 7 10 6 10-6" />
        </svg>
    );
}

export function PhoneIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

export function MapPinIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export function BriefcaseIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}
