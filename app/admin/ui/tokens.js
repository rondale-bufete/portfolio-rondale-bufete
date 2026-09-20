// Design tokens for the admin panel — sourced from the same CSS custom
// properties as the public site (app/globals.css, loaded globally by the
// root layout) so admin and public share one visual language instead of
// two unrelated systems. Every admin component pulls its classNames from
// here rather than inlining its own — that's what keeps buttons, fields,
// and cards consistent across every page instead of drifting page by page.

export const colors = {
    accent: "var(--color-accent)",
    ink: "var(--color-text)",
    muted: "var(--color-neutral-700)",
    faint: "var(--color-neutral-500)",
    border: "var(--color-divider)",
    bg: "var(--color-bg)",
    surface: "var(--color-surface)",
    danger: "#E5484D",
    success: "#1A9E4A",
};

export const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25 focus:border-[var(--color-accent)]";

export const inputBase =
    `w-full px-3.5 py-2.5 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-neutral-500)] transition-colors ${focusRing}`;

export const labelBase = "field-label block mb-1.5";

export const cardBase = "bg-[var(--color-surface)] border-2 border-[var(--color-divider)]";

export const buttonPrimary =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)] text-sm font-bold transition-colors hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export const buttonSecondary =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-sm font-bold text-[var(--color-text)] transition-colors hover:border-[var(--color-text)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export const buttonIcon =
    "inline-flex items-center justify-center w-9 h-9 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-[var(--color-neutral-600)] transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export const linkDanger =
    "inline-flex items-center gap-1.5 text-sm font-bold text-[#E5484D] transition-colors hover:text-[#c53339]";
