// Design tokens for the admin panel — sourced from the same CSS custom
// properties as the public site (app/globals.css, loaded globally by the
// root layout) so admin and public share one visual language instead of
// two unrelated systems. Every admin component pulls its classNames from
// here rather than inlining its own — that's what keeps buttons, fields,
// and cards consistent across every page instead of drifting page by page.

export const colors = {
    accent: "var(--color-accent)",
    ink: "var(--color-text)",
    muted: "var(--color-body)",
    faint: "var(--color-faint)",
    border: "var(--color-border)",
    bg: "var(--color-bg)",
    surface: "var(--color-surface)",
    danger: "var(--color-danger-solid)",
    success: "var(--color-success)",
};

export const focusRing =
    "focus:outline-none focus:ring-3 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]";

export const inputBase =
    `w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-faint)] transition-colors ${focusRing}`;

export const labelBase = "field-label block mb-1.5";

export const cardBase = "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]";

export const buttonPrimary =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium font-[family-name:var(--font-mono)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export const buttonSecondary =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-transparent text-sm font-medium font-[family-name:var(--font-mono)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-raised)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export const buttonIcon =
    "inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-transparent text-[var(--color-muted)] transition-colors hover:border-[var(--color-body)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export const linkDanger =
    "inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger-text)] transition-colors hover:text-[var(--color-danger-solid)]";
