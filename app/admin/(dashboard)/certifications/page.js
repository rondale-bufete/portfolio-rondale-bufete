import { supabaseAdmin } from "@/lib/supabase/admin";
import { MONTHS } from "@/lib/monthYear";
import {
    createCertificationAction,
    updateCertificationAction,
    deleteCertificationAction,
} from "../../actions/certifications";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { MonthYearFields } from "../../ui/MonthYearFields";
import { labelBase, buttonPrimary, linkDanger } from "../../ui/tokens";
import { TrashIcon } from "../../ui/icons";

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
            <PageHeader title="Certifications" description="Shown as a grid under the About section." />

            <div className="mb-6">
                <AddNewRow label="Add a new certification">
                    <form action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <CertFields />
                        <button type="submit" className={buttonPrimary}>
                            Add certification
                        </button>
                    </form>
                </AddNewRow>
            </div>

            <div className="space-y-3">
                {(certifications || []).map((cert) => (
                    <CertRow key={cert.id} cert={cert} />
                ))}
                {(!certifications || certifications.length === 0) && (
                    <EmptyState title="No certifications yet" description="Add your first one above." />
                )}
            </div>
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
        <ItemRow title={cert.title} meta={cert.issuer}>
            <form action={handleUpdate} className="mt-4 space-y-4 max-w-xl">
                <CertFields cert={cert} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-4">
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this certification
                </button>
            </form>
        </ItemRow>
    );
}

// Best-effort parse of an existing "Mon YYYY" string (or a bare year like
// "2026" from before the date picker existed) so the pickers preselect.
function parseExistingDate(date) {
    if (!date) return {};
    const full = date.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
    if (full) {
        const idx = MONTHS.findIndex((m) => m.toLowerCase().startsWith(full[1].toLowerCase().slice(0, 3)));
        return idx === -1 ? {} : { month: idx + 1, year: Number(full[2]) };
    }
    const yearOnly = date.match(/^(\d{4})$/);
    if (yearOnly) return { year: Number(yearOnly[1]) };
    return {};
}

function CertFields({ cert }) {
    const { month, year } = parseExistingDate(cert?.date);

    return (
        <>
            <Field label="Title" name="title" defaultValue={cert?.title} required />
            <Field label="Issuer" name="issuer" defaultValue={cert?.issuer} />

            <input type="hidden" name="date_fallback" value={cert?.date || ""} />
            <MonthYearFields
                label="Issued"
                monthName="issued_month"
                yearName="issued_year"
                monthDefault={month}
                yearDefault={year}
            />

            <Field label="Credential ID (optional)" name="credential_id" defaultValue={cert?.credential_id} placeholder="UC-384c2ce8-fe37" />
            <Field label="Description" name="description" defaultValue={cert?.description} textarea />
            <Field
                label="Verification URL (leave blank if you only have a PDF)"
                name="url"
                defaultValue={cert?.url}
            />
            <div>
                <label className={labelBase}>Badge image</label>
                <div className="flex items-center gap-4">
                    {cert?.image_url && (
                        <img src={cert.image_url} alt="" className="w-20 h-14 object-cover rounded-md border border-[#E4E4E7] shrink-0" />
                    )}
                    <input type="file" name="image" accept="image/*" className="text-sm text-[#5B5F66]" />
                </div>
            </div>
            <div>
                <label className={labelBase}>
                    Certificate PDF {cert?.pdf_url && <span className="text-[#3355FF] font-normal normal-case">— currently set, used only if no URL is set</span>}
                </label>
                <input type="file" name="pdf" accept="application/pdf" className="text-sm text-[#5B5F66]" />
            </div>
        </>
    );
}
