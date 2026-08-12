import { inputBase, labelBase } from "./tokens";

export default function Field({
    label,
    name,
    defaultValue,
    placeholder,
    type = "text",
    textarea = false,
    rows = 3,
    required = false,
    hint,
}) {
    return (
        <div>
            <label className={labelBase} htmlFor={name}>
                {label}
            </label>
            {textarea ? (
                <textarea
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    rows={rows}
                    required={required}
                    className={`${inputBase} resize-none px-3`}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    required={required}
                        className={`${inputBase} px-3`}
                />
            )}
            {hint && <p className="mt-1.5 text-xs text-[#9A9DA3]">{hint}</p>}
        </div>
    );
}
