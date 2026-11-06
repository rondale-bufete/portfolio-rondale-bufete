import { ChevronRightIcon, PlusIcon } from "@/components/icons";

// An expandable list item. `actions` (the reorder arrows) sit on the summary
// line but outside the toggle, so an item can be moved without opening it.
export function ItemRow({ index, title, meta, media, actions, children, defaultOpen = false }) {
    return (
        <div className="admin-row" style={actions ? { "--row-actions": "88px" } : undefined}>
            <details open={defaultOpen || undefined}>
                <summary className="admin-row__summary">
                    <ChevronRightIcon size={16} className="admin-row__chevron" />
                    {typeof index === "number" && <span className="admin-row__index">{String(index + 1).padStart(2, "0")}</span>}
                    {media}
                    <span className="admin-row__text">
                        <span className="admin-row__title">{title}</span>
                        {meta && <span className="admin-row__meta">{meta}</span>}
                    </span>
                </summary>
                <div className="admin-row__body">{children}</div>
            </details>
            {actions && <div className="admin-row__actions">{actions}</div>}
        </div>
    );
}

// The add-new form, kept distinct from and above the list.
export function AddNewRow({ label, children }) {
    return (
        <details className="admin-add">
            <summary className="admin-add__summary">
                <PlusIcon size={18} />
                {label}
            </summary>
            <div className="admin-add__body">{children}</div>
        </details>
    );
}
