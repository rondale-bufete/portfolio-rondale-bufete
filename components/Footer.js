import { container } from "./SectionHeader";

function SocialLink({ href, children }) {
    if (!href) return null;
    return (
        <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="hover:text-[var(--color-text)] transition-colors"
        >
            {children}
        </a>
    );
}

export default function Footer({ profile }) {
    return (
        <footer className={`${container} site-footer flex items-center justify-between gap-6 pt-6 pb-24 font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)] border-t border-[var(--color-border)]`}>
            <span>© {new Date().getFullYear()} {profile?.name}</span>
            <div className="site-footer__links flex flex-wrap items-center gap-5">
                <SocialLink href={profile?.github}>github</SocialLink>
                <SocialLink href={profile?.linkedin}>linkedin</SocialLink>
                <SocialLink href={profile?.facebook}>facebook</SocialLink>
                <SocialLink href={profile?.instagram}>instagram</SocialLink>
                <SocialLink href={profile?.email ? `mailto:${profile.email}` : undefined}>email</SocialLink>
            </div>
        </footer>
    );
}
