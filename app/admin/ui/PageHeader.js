export default function PageHeader({ title, description, action }) {
    return (
        <header className="admin-page-header">
            <div>
                <h1 className="admin-page-header__title">{title}</h1>
                {description && <p className="admin-page-header__description">{description}</p>}
            </div>
            {action}
        </header>
    );
}
