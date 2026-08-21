import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateProfileAction } from "../../actions/profile";
import PageHeader from "../../ui/PageHeader";
import Card from "../../ui/Card";
import Field from "../../ui/Field";
import AdminActionForm from "../../ui/AdminActionForm";
import { labelBase, buttonPrimary } from "../../ui/tokens";

export default async function ProfileAdminPage() {
    const { data: profile } = await supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle();

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

            <Card className="max-w-xl">
                <AdminActionForm action={handleSubmit} className="space-y-5">
                    <input type="hidden" name="existing_photo_url" value={profile?.photo_url || ""} />
                    <input type="hidden" name="existing_resume_url" value={profile?.resume_url || ""} />

                    <Field label="Name" name="name" defaultValue={profile?.name} required />
                    <Field label="Role" name="role" defaultValue={profile?.role} required />
                    <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} textarea rows={2} />
                    <Field label="Bio" name="bio" defaultValue={profile?.bio} textarea rows={4} />
                    <Field label="Email" name="email" defaultValue={profile?.email} type="email" required />
                    <Field label="GitHub URL" name="github" defaultValue={profile?.github} />
                    <Field label="LinkedIn URL" name="linkedin" defaultValue={profile?.linkedin} />

                    <div>
                        <label className={labelBase}>Photo</label>
                        <div className="flex items-center gap-4">
                            {profile?.photo_url && (
                                <img
                                    src={profile.photo_url}
                                    alt="Current photo"
                                    className="w-16 h-16 object-cover rounded-lg border border-[#E4E4E7] shrink-0"
                                />
                            )}
                            <input type="file" name="photo" accept="image/*" className="text-sm text-[#5B5F66]" />
                        </div>
                    </div>

                    <div>
                        <label className={labelBase}>
                            Resume (PDF) {profile?.resume_url && <span className="text-[#3355FF] font-normal normal-case">— currently set</span>}
                        </label>
                        <input type="file" name="resume" accept="application/pdf" className="text-sm text-[#5B5F66]" />
                    </div>

                    <div className="pt-2">
                        <button type="submit" className={buttonPrimary}>
                            Save changes
                        </button>
                    </div>
                </AdminActionForm>
            </Card>
        </div>
    );
}
