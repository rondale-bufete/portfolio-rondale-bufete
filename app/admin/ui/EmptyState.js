export default function EmptyState({ title, description }) {
    return (
        <div className="border-2 border-dashed border-[var(--color-neutral-400)] px-6 py-12 text-center">
            <p className="text-sm font-bold text-[var(--color-text)] mb-1">{title}</p>
            {description && <p className="text-sm text-[var(--color-neutral-700)]">{description}</p>}
        </div>
    );
}
