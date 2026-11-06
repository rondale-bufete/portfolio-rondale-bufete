export default function EmptyState({ title, description }) {
    return (
        <div className="admin-empty">
            <p className="admin-empty__title">{title}</p>
            {description && <p className="admin-empty__description">{description}</p>}
        </div>
    );
}
