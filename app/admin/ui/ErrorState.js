// Shown when a page-level Supabase read fails, instead of silently
// falling through to an empty list as if there were just no data yet.
export default function ErrorState({ title = "Couldn't load this data", message }) {
    return (
        <div role="alert" className="border-2 border-[#E5484D]/40 bg-[#E5484D]/5 px-6 py-5">
            <p className="text-sm font-bold text-[#E5484D] mb-1">{title}</p>
            {message && <p className="text-sm text-[var(--color-neutral-700)]">{message}</p>}
        </div>
    );
}
