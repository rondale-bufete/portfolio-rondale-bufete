import { ChevronIcon, PlusIcon } from "./icons";
import { cardBase } from "./tokens";

// A single item row in a list (project, cert, education entry, etc).
// Click the summary to expand its edit form.
export function ItemRow({ title, meta, badges, children, defaultOpen = false }) {
    return (
        <details
            className={`group ${cardBase} overflow-hidden open:shadow-[0_2px_8px_rgba(20,22,26,0.06)] transition-shadow`}
            open={defaultOpen || undefined}
        >
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                    <ChevronIcon className="w-4 h-4 text-[#9A9DA3] shrink-0 transition-transform duration-200 group-open:rotate-90" />
                    <span className="font-medium text-sm truncate">{title}</span>
                    {badges}
                </div>
                {meta && (
                    <span className="text-xs text-[#5B5F66] font-[family-name:var(--font-mono)] shrink-0 max-w-[40%] truncate">
                        {meta}
                    </span>
                )}
            </summary>
            <div className="px-5 pb-6 pt-1 border-t border-[#E4E4E7]">{children}</div>
        </details>
    );
}

// The "+ Add new X" affordance — visually distinct (dashed border, accent
// text) so it never gets mistaken for an existing item, and placed above
// the list so it doesn't require scrolling past every entry to find it.
export function AddNewRow({ label, children }) {
    return (
        <details className="group border border-dashed border-[#D8D8DC] rounded-xl bg-white transition-colors open:border-[#3355FF]/40">
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-2 px-5 py-4 text-sm font-medium text-[#3355FF] hover:bg-[#3355FF]/[0.03] transition-colors rounded-xl">
                <PlusIcon className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-45" />
                {label}
            </summary>
            <div className="px-5 pb-6 pt-1 border-t border-[#E4E4E7]">{children}</div>
        </details>
    );
}
