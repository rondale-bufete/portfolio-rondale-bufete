export default function PageHeader({ title, description, action }) {
    return (
        <div className="flex items-start justify-between gap-6 mb-8">
            <div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-[28px] font-medium tracking-tight text-[var(--color-text)]">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-[var(--color-body)] mt-1.5 max-w-xl leading-relaxed">{description}</p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
