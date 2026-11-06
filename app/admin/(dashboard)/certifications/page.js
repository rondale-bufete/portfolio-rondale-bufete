import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { displayToMonthValue } from "@/lib/monthYear";
import {
    createCertificationAction,
    updateCertificationAction,
    deleteCertificationAction,
    moveCertificationAction,
} from "../../actions/certifications";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { MonthField } from "../../ui/MonthYearFields";
import ReorderControls from "../../ui/ReorderControls";
import DeleteAction from "../../ui/DeleteAction";
import { buttonPrimary } from "../../ui/tokens";
import AdminActionForm from "../../ui/AdminActionForm";

export default async function CertificationsAdminPage() {
    const { data: certifications, error } = await supabaseAdmin.from("certifications").select("*").order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createCertificationAction(formData);
    }

    return (
        <div>
            <PageHeader title="Certifications" description="Shown as cards under About. A card links to the verification URL, or to the PDF when there's no URL." />

            <div className="admin-stack">
                <AddNewRow label="Add a certification">
                    <AdminActionForm action={handleCreate} className="admin-form" successMessage="Certification added.">
                        <CertFields />
                        <div className="admin-form__actions">
                            <button type="submit" className={buttonPrimary}>
                                Add certification
                            </button>
                        </div>
                    </AdminActionForm>
                </AddNewRow>

                {error && <ErrorState message={error.message} />}

                {!error && (
                    <div className="admin-list">
                        {(certifications || []).map((cert, index) => (
                            <CertRow
                                key={cert.id}
                                cert={cert}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === (certifications?.length || 0) - 1}
                            />
                        ))}
                        {(!certifications || certifications.length === 0) && (
                            <EmptyState title="No certifications yet" description="Add your first one above." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function CertRow({ cert, index, isFirst, isLast }) {
    async function handleMoveUp() {
        "use server";
        await moveCertificationAction(cert.id, "up");
    }
    async function handleMoveDown() {
        "use server";
        await moveCertificationAction(cert.id, "down");
    }
    async function handleUpdate(formData) {
        "use server";
        await updateCertificationAction(cert.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteCertificationAction(cert.id);
    }

    const link = cert.url ? "Verify link" : cert.pdf_url ? "PDF" : null;

    return (
        <ItemRow
            index={index}
            title={cert.title}
            media={<span className="admin-row__media">{cert.image_url && <Image src={cert.image_url} alt="" fill sizes="64px" />}</span>}
            meta={
                <>
                    <span>{[cert.issuer, cert.date].filter(Boolean).join(" · ")}</span>
                    {link ? <Badge tone="accent">{link}</Badge> : <Badge>No link</Badge>}
                </>
            }
            actions={<ReorderControls label={cert.title} isFirst={isFirst} isLast={isLast} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />}
        >
            <AdminActionForm action={handleUpdate} className="admin-form">
                <CertFields cert={cert} />
                <div className="admin-form__actions">
                    <button type="submit" className={buttonPrimary}>
                        Save changes
                    </button>
                </div>
            </AdminActionForm>

            <div className="admin-row__footer">
                <DeleteAction
                    action={handleDelete}
                    label="Delete certification"
                    confirmMessage={`“${cert.title}” and its uploaded files will be removed for good.`}
                    successMessage="Certification deleted."
                />
            </div>
        </ItemRow>
    );
}

function CertFields({ cert }) {
    const key = cert?.id ?? "new";

    return (
        <>
            <Field label="Title" name="title" defaultValue={cert?.title} required />
            <div className="admin-grid-2">
                <Field label="Issuer" name="issuer" defaultValue={cert?.issuer} placeholder="Coursera" />
                <MonthField label="Issued" name="issued" defaultValue={displayToMonthValue(cert?.date)} />
            </div>
            <Field
                label="Verification URL"
                name="url"
                defaultValue={cert?.url}
                type="url"
                hint="Leave empty if you only have a PDF."
                optional
            />
            <Field
                label="Description"
                name="description"
                defaultValue={cert?.description}
                textarea
                hint="Not shown on the card; the chat assistant uses it to answer questions about this certification."
                optional
            />
            <div className="admin-field">
                <label className="admin-label" htmlFor={`cert-image-${key}`}>
                    Badge image
                </label>
                <div className="admin-upload">
                    {cert?.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element -- a small admin preview of an uploaded file
                        <img src={cert.image_url} alt="Current badge" className="admin-upload__preview admin-upload__preview--wide" />
                    )}
                    <input id={`cert-image-${key}`} type="file" name="image" accept="image/*" className="admin-file" />
                </div>
            </div>
            <div className="admin-field">
                <label className="admin-label" htmlFor={`cert-pdf-${key}`}>
                    Certificate PDF
                </label>
                <input id={`cert-pdf-${key}`} type="file" name="pdf" accept="application/pdf" className="admin-file" />
                <p className="admin-hint">
                    {cert?.pdf_url ? (
                        <>
                            A PDF is uploaded.{" "}
                            <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="link">
                                Open it
                            </a>
                            . The card links to it only when there&rsquo;s no verification URL.
                        </>
                    ) : (
                        "Optional. Used when there's no verification URL."
                    )}
                </p>
            </div>
        </>
    );
}
