// Design tokens for the admin panel. Every admin component pulls its
// classNames from here rather than inlining its own — that's what keeps
// buttons, fields, and cards consistent across every page instead of
// drifting page by page.

export const colors = {
    accent: "#3355FF",
    ink: "#14161A",
    muted: "#5B5F66",
    faint: "#9A9DA3",
    border: "#E4E4E7",
    bg: "#FAFAFA",
    danger: "#E5484D",
    success: "#1A9E4A",
};

export const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]";

export const inputBase =
    `w-full px-3.5 py-2.5 rounded-lg border border-[#E4E4E7] bg-white text-sm text-[#14161A] placeholder:text-[#9A9DA3] transition-colors ${focusRing}`;

export const labelBase =
    "block text-xs font-semibold uppercase tracking-wide text-[#5B5F66] mb-1.5";

export const cardBase =
    "bg-white border border-[#E4E4E7] rounded-xl shadow-[0_1px_2px_rgba(20,22,26,0.04)]";

export const buttonPrimary =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#14161A] text-white text-sm font-medium transition-colors hover:bg-[#3355FF] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3355FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const buttonSecondary =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E4E4E7] bg-white text-sm font-medium text-[#14161A] transition-colors hover:border-[#14161A] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3355FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const buttonIcon =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E4E4E7] bg-white text-[#5B5F66] transition-colors hover:border-[#14161A] hover:text-[#14161A] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3355FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const linkDanger =
    "inline-flex items-center gap-1.5 text-sm font-medium text-[#E5484D] transition-colors hover:text-[#c53339]";
