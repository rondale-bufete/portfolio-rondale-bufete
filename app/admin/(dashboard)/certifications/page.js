import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createCertificationAction,
    updateCertificationAction,
    deleteCertificationAction,
} from "../../actions/certifications";

export default async function CertificationsAdminPage() {
    const { data: certifications } = await supabaseAdmin
        .from("certifications")
        .select("*")
        .order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createCertificationAction(formData);
    }

    return (
        <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Certifications</h1>
            <p className="text-sm text-[#5B5F66] mb-8">Shown as a grid under the About section.</p>

            <div className="space-y-4 mb-10">
                {(certifications || []).map((cert) => (
                    <CertRow key={cert.id} cert={cert} />
                ))}
                {(!certifications || certifications.length === 0) && (
                    <p className="text-sm text-[#5B5F66]">No certifications yet — add your first one below.</p>
                )}
            </div>

            <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
                <summary className="cursor-pointer font-medium text-sm">+ Add a new certification</summary>
                <form action={handleCreate} className="mt-5 space-y-4 max-w-xl">
                    <CertFields />
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        Add certification
                    </button>
                </form>
            </details>
        </div>
    );
}

function CertRow({ cert }) {
    async function handleUpdate(formData) {
        "use server";
        await updateCertificationAction(cert.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteCertificationAction(cert.id);
    }

    return (
        <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
            <summary className="cursor-pointer flex items-center justify-between">
                <span className="font-medium text-sm">{cert.title}</span>
                <span className="text-xs text-[#5B5F66] font-[family-name:var(--font-mono)]">{cert.issuer}</span>
            </summary>

            <form action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <CertFields cert={cert} />
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-3">
                <button type="submit" className="text-sm text-[#E5484D] hover:underline">
                    Delete this certification
                </button>
            </form>
        </details>
    );
}

function CertFields({ cert }) {
    return (
        <>
            <Field label="Title" name="title" defaultValue={cert?.title} required />
            <Field label="Issuer" name="issuer" defaultValue={cert?.issuer} />
            <Field label="Date" name="date" defaultValue={cert?.date} placeholder="2026" />
            <Field label="Description" name="description" defaultValue={cert?.description} textarea />
            <Field
                label="Verification URL (leave blank if you only have a PDF)"
                name="url"
                defaultValue={cert?.url}
            />
            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5">
                    Badge image {cert?.image_url && <span className="text-[#3355FF]">(current set)</span>}
                </label>
                {cert?.image_url && (
                    <img src={cert.image_url} alt="" className="w-32 h-20 object-cover rounded-md mb-2 border border-[#E4E4E7]" />
                )}
                <input type="file" name="image" accept="image/*" className="text-sm" />
            </div>
            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5">
                    Certificate PDF (used only if no URL is set) {cert?.pdf_url && <span className="text-[#3355FF]">(current set)</span>}
                </label>
                <input type="file" name="pdf" accept="application/pdf" className="text-sm" />
            </div>
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
