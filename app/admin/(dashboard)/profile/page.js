import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateProfileAction } from "../../actions/profile";

export default async function ProfileAdminPage() {
    const { data: profile } = await supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle();

    async function handleSubmit(formData) {
        "use server";
        await updateProfileAction(formData);
    }

    return (
        <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Profile</h1>
            <p className="text-sm text-[#5B5F66] mb-8">
                This powers the navbar, hero section, footer, and resume modal.
            </p>

            <form action={handleSubmit} className="max-w-xl space-y-4 bg-white border border-[#E4E4E7] rounded-xl p-6">
                <input type="hidden" name="existing_photo_url" value={profile?.photo_url || ""} />
                <input type="hidden" name="existing_resume_url" value={profile?.resume_url || ""} />

                <Field label="Name" name="name" defaultValue={profile?.name} />
                <Field label="Role" name="role" defaultValue={profile?.role} />
                <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} textarea />
                <Field label="Bio" name="bio" defaultValue={profile?.bio} textarea />
                <Field label="Email" name="email" defaultValue={profile?.email} type="email" />
                <Field label="GitHub URL" name="github" defaultValue={profile?.github} />
                <Field label="LinkedIn URL" name="linkedin" defaultValue={profile?.linkedin} />

                <div>
                    <label className="block text-sm text-[#5B5F66] mb-1.5">
                        Photo {profile?.photo_url && <span className="text-[#3355FF]">(current set)</span>}
                    </label>
                    {profile?.photo_url && (
                        <img src={profile.photo_url} alt="Current photo" className="w-24 h-24 object-cover rounded-md mb-2 border border-[#E4E4E7]" />
                    )}
                    <input type="file" name="photo" accept="image/*" className="text-sm" />
                </div>

                <div>
                    <label className="block text-sm text-[#5B5F66] mb-1.5">
                        Resume (PDF) {profile?.resume_url && <span className="text-[#3355FF]">(current set)</span>}
                    </label>
                    <input type="file" name="resume" accept="application/pdf" className="text-sm" />
                </div>

                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
                    Save changes
                </button>
            </form>
        </div>
    );
}

function Field({ label, name, defaultValue, type = "text", textarea = false }) {
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
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors resize-none"
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
                />
            )}
        </div>
    );
}
