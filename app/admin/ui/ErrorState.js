// Show read failures instead of presenting them as empty data.
export default function ErrorState({ title = "Couldn't load this data", message }) {
    return (
        <div role="alert" className="admin-error">
            <p className="admin-error__title">{title}</p>
            {message && <p className="admin-error__message">{message}</p>}
        </div>
    );
}
