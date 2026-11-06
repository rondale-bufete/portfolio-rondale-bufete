import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateProfileAction } from "../../actions/profile";
import PageHeader from "../../ui/PageHeader";
import Card from "../../ui/Card";
import Field from "../../ui/Field";
import ErrorState from "../../ui/ErrorState";
import AdminActionForm from "../../ui/AdminActionForm";
import { buttonPrimary } from "../../ui/tokens";
import { MAX_STATS, normalizeStats } from "@/lib/profileStats";

function HeadlineNumbersFields({ profile }) {
    // select("*") omits the column until the profile_stats migration runs.
    if (!profile || !("stats" in profile)) {
        return (
            <p className="admin-note">
                Run supabase/profile_stats_migration.sql in the Supabase SQL Editor to add headline numbers under your intro.
            </p>
        );
    }

    const stats = normalizeStats(profile.stats);
    const rows = Array.from({ length: MAX_STATS }, (_, index) => index + 1);

    return rows.map((row) => (
        <div key={row} className="admin-stat-row">
            <Field label={`Number ${row}`} name={`stat_value_${row}`} defaultValue={stats[row - 1]?.value} placeholder="300+" />
            <Field label={`Label ${row}`} name={`stat_label_${row}`} defaultValue={stats[row - 1]?.label} placeholder="subscriber accounts managed" />
        </div>
    ));
}

export default async function ProfileAdminPage() {
    const { data: profile, error } = await supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle();

    async function handleSubmit(formData) {
        "use server";
        await updateProfileAction(formData);
    }

    return (
        <div>
            <PageHeader title="Profile" description="Your name, intro, links, photo and resume: the hero, navbar, footer and contact section all read from here." />

            {error && <ErrorState message={error.message} />}

            {!error && (
                <Card className="admin-card--form">
                    <AdminActionForm action={handleSubmit} className="admin-form">
                        <input type="hidden" name="existing_photo_url" value={profile?.photo_url || ""} />
                        <input type="hidden" name="existing_resume_url" value={profile?.resume_url || ""} />

                        <fieldset className="admin-fieldset">
                            <legend className="admin-fieldset__legend">Intro</legend>
                            <div className="admin-grid-2">
                                <Field label="Name" name="name" defaultValue={profile?.name} autoComplete="name" required />
                                <Field label="Role" name="role" defaultValue={profile?.role} placeholder="Full Stack Developer" required />
                            </div>
                            <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} hint="One line under your name." optional />
                            <Field label="Bio" name="bio" defaultValue={profile?.bio} textarea rows={4} optional />
                        </fieldset>

                        <fieldset className="admin-fieldset">
                            <legend className="admin-fieldset__legend">Availability and numbers</legend>
                            <label className="admin-check">
                                <input type="checkbox" name="available" defaultChecked={profile?.available ?? true} />
                                Show the status badge next to your role
                            </label>
                            <Field label="Status badge" name="status_label" defaultValue={profile?.status_label || "Open to work"} />
                            <p className="admin-fieldset__note">Headline numbers sit under your intro and count up on load. Leave a row empty to skip it.</p>
                            <HeadlineNumbersFields profile={profile} />
                        </fieldset>

                        <fieldset className="admin-fieldset">
                            <legend className="admin-fieldset__legend">Contact and links</legend>
                            <div className="admin-grid-2">
                                <Field label="Email" name="email" defaultValue={profile?.email} type="email" autoComplete="email" required />
                                <Field label="Location" name="location" defaultValue={profile?.location} placeholder="Camarines Sur, PH · Remote" optional />
                                <Field label="GitHub URL" name="github" defaultValue={profile?.github} type="url" />
                                <Field label="LinkedIn URL" name="linkedin" defaultValue={profile?.linkedin} type="url" />
                                <Field label="Facebook URL" name="facebook" defaultValue={profile?.facebook} type="url" optional />
                                <Field label="Instagram URL" name="instagram" defaultValue={profile?.instagram} type="url" optional />
                            </div>
                        </fieldset>

                        <fieldset className="admin-fieldset">
                            <legend className="admin-fieldset__legend">Photo and resume</legend>
                            <div className="admin-field">
                                <label className="admin-label" htmlFor="profile-photo">
                                    Photo
                                </label>
                                <div className="admin-upload">
                                    {profile?.photo_url && (
                                        // eslint-disable-next-line @next/next/no-img-element -- a small admin preview of an uploaded file
                                        <img src={profile.photo_url} alt="Current photo" className="admin-upload__preview" />
                                    )}
                                    <input id="profile-photo" type="file" name="photo" accept="image/*" className="admin-file" />
                                </div>
                                <p className="admin-hint">Shown in the hero. A new upload replaces the current photo.</p>
                            </div>
                            <div className="admin-field">
                                <label className="admin-label" htmlFor="profile-resume">
                                    Resume (PDF)
                                </label>
                                <input id="profile-resume" type="file" name="resume" accept="application/pdf" className="admin-file" />
                                <p className="admin-hint">
                                    {profile?.resume_url ? (
                                        <>
                                            A resume is uploaded.{" "}
                                            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="link">
                                                Open the current file
                                            </a>
                                            . A new upload replaces it.
                                        </>
                                    ) : (
                                        "No resume yet. Upload one to show the Resume button in the navbar."
                                    )}
                                </p>
                            </div>
                        </fieldset>

                        <div className="admin-form__actions">
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
