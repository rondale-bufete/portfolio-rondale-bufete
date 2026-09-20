import { ChevronIcon, PlusIcon } from "./icons";
import { cardBase } from "./tokens";

// A single item row in a list (project, cert, education entry, etc).
// Click the summary to expand its edit form.
export function ItemRow({ title, meta, badges, children, defaultOpen = false }) {
    return (
        <details className={`group ${cardBase} overflow-hidden`} open={defaultOpen || undefined}>
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--color-neutral-100)] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                    <ChevronIcon className="w-4 h-4 text-[var(--color-neutral-500)] shrink-0 transition-transform duration-200 group-open:rotate-90" />
                    <span className="font-bold text-sm truncate">{title}</span>
                    {badges}
                </div>
                {meta && (
                    <span className="text-xs text-[var(--color-neutral-700)] font-[family-name:var(--font-mono)] shrink-0 max-w-[40%] truncate">
                        {meta}
                    </span>
                )}
            </summary>
            <div className="px-5 pb-6 pt-1 border-t-2 border-[var(--color-divider)]">{children}</div>
        </details>
    );
}

// The "+ Add new X" affordance — visually distinct (dashed border, accent
// text) so it never gets mistaken for an existing item, and placed above
// the list so it doesn't require scrolling past every entry to find it.
export function AddNewRow({ label, children }) {
    return (
        <details className="group border-2 border-dashed border-[var(--color-neutral-400)] bg-[var(--color-bg)] transition-colors open:border-[var(--color-accent)]/50">
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-2 px-5 py-4 text-sm font-bold text-[var(--color-accent-700)] hover:bg-[var(--color-accent)]/[0.04] transition-colors">
                <PlusIcon className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-45" />
                {label}
            </summary>
            <div className="px-5 pb-6 pt-1 border-t-2 border-[var(--color-divider)]">{children}</div>
        </details>
    );
}
