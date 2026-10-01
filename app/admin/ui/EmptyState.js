export default function EmptyState({ title, description }) {
    return (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{title}</p>
            {description && <p className="text-sm text-[var(--color-body)]">{description}</p>}
        </div>
    );
}
