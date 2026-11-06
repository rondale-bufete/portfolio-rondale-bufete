import Logo from "./Logo";
import { ArrowUpIcon, FacebookIcon, GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from "./icons";

export default function Footer({ profile }) {
    const links = [
        profile?.github && { label: "GitHub", href: profile.github, Icon: GitHubIcon },
        profile?.linkedin && { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon },
        profile?.facebook && { label: "Facebook", href: profile.facebook, Icon: FacebookIcon },
        profile?.instagram && { label: "Instagram", href: profile.instagram, Icon: InstagramIcon },
        profile?.email && { label: "Email", href: `mailto:${profile.email}`, Icon: MailIcon },
    ].filter(Boolean);

    return (
        <footer className="site-footer">
            <div className="container site-footer__inner">
                <div className="site-footer__brand">
                    <Logo size={28} />
                    <p className="site-footer__copy">
                        © {new Date().getFullYear()} {profile?.name}
                    </p>
                </div>
                {links.length > 0 && (
                    <ul className="site-footer__links">
                        {links.map(({ label, href, Icon }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    aria-label={label}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                >
                                    <Icon size={18} />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                <a href="#top" className="site-footer__top">
                    Back to top
                    <ArrowUpIcon size={14} />
                </a>
            </div>
        </footer>
    );
}
