import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createEducationAction,
    updateEducationAction,
    deleteEducationAction,
} from "../../actions/education";

export default async function EducationAdminPage() {
    const { data: education } = await supabaseAdmin
        .from("education")
        .select("*")
        .order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createEducationAction(formData);
    }

    return (
        <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Education</h1>
            <p className="text-sm text-[#5B5F66] mb-8">Shown as a timeline under About.</p>

            <div className="space-y-4 mb-10">
                {(education || []).map((edu) => (
                    <EduRow key={edu.id} edu={edu} />
                ))}
                {(!education || education.length === 0) && (
                    <p className="text-sm text-[#5B5F66]">Nothing yet — add your first entry below.</p>
                )}
            </div>

            <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
                <summary className="cursor-pointer font-medium text-sm">+ Add an entry</summary>
                <form action={handleCreate} className="mt-5 space-y-4 max-w-xl">
                    <EduFields />
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        Add entry
                    </button>
                </form>
            </details>
        </div>
    );
}

function EduRow({ edu }) {
    async function handleUpdate(formData) {
        "use server";
        await updateEducationAction(edu.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteEducationAction(edu.id);
    }

    return (
        <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
            <summary className="cursor-pointer flex items-center justify-between">
                <span className="font-medium text-sm">{edu.degree}</span>
                <span className="text-xs text-[#5B5F66] font-[family-name:var(--font-mono)]">{edu.period}</span>
            </summary>

            <form action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <EduFields edu={edu} />
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-3">
                <button type="submit" className="text-sm text-[#E5484D] hover:underline">
                    Delete this entry
                </button>
            </form>
        </details>
    );
}

function EduFields({ edu }) {
    return (
        <>
            <Field label="Degree / Program" name="degree" defaultValue={edu?.degree} required />
            <Field label="School" name="school" defaultValue={edu?.school} required />
            <Field label="Period" name="period" defaultValue={edu?.period} placeholder="2022 — 2026" />
            <Field label="Description (optional)" name="description" defaultValue={edu?.description} textarea />
        </>
    );
}

function Field({ label, name, defaultValue, placeholder, textarea = false, required = false }) {
    return (
        <div>
            <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor={name}>
                {label}
            </label>
            {textarea ? (
                <textarea
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    rows={3}
                    required={required}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors resize-none"
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
                />
            )}
        </div>
    );
}
