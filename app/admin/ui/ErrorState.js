// Shown when a page-level Supabase read fails, instead of silently
// falling through to an empty list as if there were just no data yet.
export default function ErrorState({ title = "Couldn't load this data", message }) {
    return (
        <div role="alert" className="rounded-[var(--radius-lg)] border border-[var(--color-danger)]/40 bg-[var(--color-danger-solid)]/5 px-6 py-5">
            <p className="text-sm font-semibold text-[var(--color-danger-text)] mb-1">{title}</p>
            {message && <p className="text-sm text-[var(--color-body)]">{message}</p>}
        </div>
    );
}
