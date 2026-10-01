import Link from "next/link";
import Image from "next/image";
import { pageShell } from "./SectionHeader";

function statusSlug(label) {
    return (label || "").trim().toLowerCase().replace(/\s+/g, "_") || "open_to_work";
}

export default function Hero({ profile, projects = [], education = [], skills = [] }) {
    if (!profile) return null;

    const coreStack = skills.flatMap((group) => group.items).slice(0, 6);
    const topProjects = projects.slice(0, 3);
    const heroImage = profile.photo || topProjects[0]?.imageUrl;

    return (
        <section id="work" className={`${pageShell} home-page`}>
            <div className="home-hero">
                <div className="home-hero__copy">
                    <div className="home-hero__eyebrow">
                        <span className={`home-hero__availability ${profile.available ? "is-available" : ""}`} />
                        {profile.role || "Full-stack developer"}
                        {profile.available && <span className="home-hero__status">{statusSlug(profile.statusLabel).replaceAll("_", " ")}</span>}
                    </div>
                    <h1 className="home-hero__title">{profile.name}</h1>
                    <p className="home-hero__tagline">{profile.tagline}</p>
                    <p className="home-hero__bio">{profile.bio}</p>
                    <div className="home-hero__actions">
                        <Link href="/#projects" className="home-button home-button--primary">
                            Explore selected work <span aria-hidden="true">↗</span>
                        </Link>
                        <Link href="/#about" className="home-button home-button--text">
                            More about me <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    {coreStack.length > 0 && (
                        <div className="home-hero__stack" aria-label="Core technologies">
                            {coreStack.map((item) => <span key={item}>{item}</span>)}
                        </div>
                    )}
                </div>

                <div className="home-hero__visual">
                    <div className={`home-hero__image-wrap ${profile.photo ? "is-portrait" : "is-project-preview"}`}>
                        {heroImage ? (
                            <Image
                                src={heroImage}
                                alt={profile.photo ? `${profile.name} portrait` : `${topProjects[0]?.title} project preview`}
                                fill
                                priority
                                sizes="(max-width: 760px) 90vw, 44vw"
                                className="home-hero__image"
                            />
                        ) : (
                            <div className="home-hero__initials" aria-hidden="true">
                                {profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
                            </div>
                        )}
                    </div>
                    <div className="home-hero__caption">
                        <span>Currently based</span>
                        <span>{profile.location || "Available worldwide"}</span>
                    </div>
                </div>
            </div>

            <div className="home-stats" aria-label="Portfolio overview">
                <div><strong>{String(projects.length).padStart(2, "0")}</strong><span>Selected projects</span></div>
                <div><strong>{String(education.length).padStart(2, "0")}</strong><span>Qualifications</span></div>
                <div><strong>{String(coreStack.length).padStart(2, "0")}</strong><span>Core technologies</span></div>
                <p>Thoughtful work, built with care.</p>
            </div>
        </section>
    );
}
