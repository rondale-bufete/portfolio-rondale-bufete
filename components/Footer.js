import { container } from "./SectionHeader";
import { GitHubIcon, LinkedInIcon, EmailIcon, FacebookIcon, InstagramIcon } from "./SocialIcons";

function SocialLink({ href, label, children }) {
    return (
        <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="group inline-flex items-center gap-2 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] px-3 py-2 text-sm font-semibold text-[var(--color-neutral-800)] transition-colors duration-200 hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
        >
            <span className="flex h-7 w-7 items-center justify-center bg-[var(--color-neutral-200)] text-[var(--color-text)] transition-colors group-hover:bg-[var(--color-accent-100)] group-hover:text-[var(--color-accent-700)]">
                {children}
            </span>
            {label}
        </a>
    );
}

export default function Footer({ profile }) {
    return (
        <footer className="border-t-2 border-[var(--color-divider)] bg-[var(--color-bg)]">
            <div className={`${container} flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between`}>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-[var(--color-accent)] text-sm font-bold text-white">
                        {profile?.name?.charAt(0) || "R"}
                    </div>
                    <div>
                        <p className="font-[family-name:var(--font-display)] text-lg font-extrabold text-[var(--color-text)]">
                            {profile?.name}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SocialLink href={profile?.github} label="GitHub">
                        <GitHubIcon className="h-4 w-4" />
                    </SocialLink>

                    <SocialLink href={profile?.linkedin} label="LinkedIn">
                        <LinkedInIcon className="h-4 w-4" />
                    </SocialLink>

                    {profile?.facebook && (
                        <SocialLink href={profile.facebook} label="Facebook">
                            <FacebookIcon className="h-4 w-4" />
                        </SocialLink>
                    )}

                    {profile?.instagram && (
                        <SocialLink href={profile.instagram} label="Instagram">
                            <InstagramIcon className="h-4 w-4" />
                        </SocialLink>
                    )}

                    <SocialLink href={`mailto:${profile?.email}`} label="Email">
                        <EmailIcon className="h-4 w-4" />
                    </SocialLink>
                </div>
            </div>

            <div className={`${container} border-t-2 border-[var(--color-divider)] py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-neutral-500)]`}>
                © {new Date().getFullYear()} {profile?.name}
            </div>
        </footer>
    );
}
