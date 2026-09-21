import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateProfileAction } from "../../actions/profile";
import PageHeader from "../../ui/PageHeader";
import Card from "../../ui/Card";
import Field from "../../ui/Field";
import ErrorState from "../../ui/ErrorState";
import AdminActionForm from "../../ui/AdminActionForm";
import { labelBase, buttonPrimary } from "../../ui/tokens";

export default async function ProfileAdminPage() {
    const { data: profile, error } = await supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle();

    async function handleSubmit(formData) {
        "use server";
        await updateProfileAction(formData);
    }

    return (
        <div>
            <PageHeader
                title="Profile"
                description="Powers the navbar, hero section, footer, and resume modal on your site."
            />

            {error && <ErrorState message={error.message} />}

            {!error && (
            <Card className="max-w-xl">
                <AdminActionForm action={handleSubmit} className="space-y-5">
                    <input type="hidden" name="existing_photo_url" value={profile?.photo_url || ""} />
                    <input type="hidden" name="existing_resume_url" value={profile?.resume_url || ""} />

                    <Field label="Name" name="name" defaultValue={profile?.name} required />
                    <Field label="Role" name="role" defaultValue={profile?.role} required />
                    <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} textarea rows={2} />
                    <Field label="Bio" name="bio" defaultValue={profile?.bio} textarea rows={4} />
                    <Field label="Email" name="email" defaultValue={profile?.email} type="email" required />
                    <Field label="Phone (optional)" name="phone" defaultValue={profile?.phone} />
                    <Field label="Location (optional)" name="location" defaultValue={profile?.location} placeholder="Camarines Sur, PH · Remote" />
                    <Field label="GitHub URL" name="github" defaultValue={profile?.github} />
                    <Field label="LinkedIn URL" name="linkedin" defaultValue={profile?.linkedin} />
                    <Field label="Facebook URL (optional)" name="facebook" defaultValue={profile?.facebook} />
                    <Field label="Instagram URL (optional)" name="instagram" defaultValue={profile?.instagram} />
                    <Field
                        label="Open to (optional)"
                        name="open_to"
                        defaultValue={profile?.open_to}
                        placeholder="Full-time · Contract"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="available"
                            name="available"
                            defaultChecked={profile?.available ?? true}
                            className="w-4 h-4 border-[var(--color-divider)] accent-[var(--color-accent)]"
                        />
                        <label htmlFor="available" className="text-sm text-[var(--color-text)]">
                            Show the status pill in the navbar
                        </label>
                    </div>
                    <Field
                        label="Status pill label"
                        name="status_label"
                        defaultValue={profile?.status_label || "OPEN TO WORK"}
                    />

                    <div>
                        <label className={labelBase}>Photo</label>
                        <div className="flex items-center gap-4">
                            {profile?.photo_url && (
                                <img
                                    src={profile.photo_url}
                                    alt="Current photo"
                                    className="w-16 h-16 object-cover border-2 border-[var(--color-divider)] shrink-0"
                                />
                            )}
                            <input type="file" name="photo" accept="image/*" className="text-sm text-[var(--color-neutral-700)]" />
                        </div>
                    </div>

                    <div>
                        <label className={labelBase}>
                            Resume (PDF) {profile?.resume_url && <span className="text-[var(--color-accent-700)] font-normal normal-case">— currently set</span>}
                        </label>
                        <input type="file" name="resume" accept="application/pdf" className="text-sm text-[var(--color-neutral-700)]" />
                    </div>

                    <div className="pt-2">
                        <button type="submit" className={buttonPrimary}>
                            Save changes
                        </button>
                    </div>
                </AdminActionForm>
            </Card>
            )}
        </div>
    );
}
