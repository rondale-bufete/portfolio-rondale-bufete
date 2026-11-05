import { Fragment } from "react";
import Image from "next/image";
import PointerSpotlight from "./motion/PointerSpotlight";
import { ArrowDownIcon } from "./icons";
import { initials } from "@/lib/format";

// Numbers like "300+", "+60%" or "200+" count up on load; anything else
// (a comma, a decimal, plain text) is shown as written.
const COUNTABLE_STAT = /^(\D*?)(\d{1,6})(\D*)$/;

function sentenceCase(text) {
    const value = (text || "").trim().toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// Each word rises from behind its own clipping line, one after another.
function RevealWords({ text, startDelay = 0, step = 90 }) {
    return (text || "")
        .split(/\s+/)
        .filter(Boolean)
        .map((word, index) => (
            <Fragment key={`${word}-${index}`}>
                {index > 0 && " "}
                <span className="word-reveal">
                    <span style={{ "--delay": `${startDelay + index * step}ms` }}>{word}</span>
                </span>
            </Fragment>
        ));
}

// The count is drawn by CSS (a registered custom property animated from 0),
// so it needs no JavaScript and can't flash the wrong number; screen readers
// get the plain value.
function StatValue({ value, index }) {
    const match = value.match(COUNTABLE_STAT);
    if (!match) return <strong className="hero-stats__value">{value}</strong>;

    const [, prefix, digits, suffix] = match;
    return (
        <strong className="hero-stats__value">
            <span className="sr-only">{value}</span>
            <span aria-hidden="true">
                {prefix}
                <span className="count-up" style={{ "--count-to": Number(digits), "--delay": `${650 + index * 120}ms` }} />
                {suffix}
            </span>
        </strong>
    );
}

export default function Hero({ profile, projects = [], skills = [] }) {
    if (!profile) return null;

    const coreStack = skills.flatMap((group) => group.items).slice(0, 6);
    const stats = profile.stats ?? [];
    const heroImage = profile.photo || projects[0]?.imageUrl;

    return (
        <section id="work" className="hero" aria-labelledby="hero-title">
            <PointerSpotlight />
            <div className="container hero__inner">
                <div className="hero__copy">
                    <div className="hero__meta">
                        {profile.role && <p className="hero__role">{profile.role}</p>}
                        {profile.available && (
                            <p className="hero__status">
                                <span className="hero__status-dot" aria-hidden="true" />
                                {sentenceCase(profile.statusLabel) || "Open to work"}
                            </p>
                        )}
                    </div>

                    <h1 id="hero-title" className="hero__title">
                        <RevealWords text={profile.name} startDelay={120} />
                    </h1>
                    {profile.tagline && <p className="hero__tagline">{profile.tagline}</p>}
                    {profile.bio && <p className="hero__bio">{profile.bio}</p>}

                    <div className="hero__actions">
                        <a href="#projects" className="button button--primary">
                            View my projects
                            <ArrowDownIcon size={16} />
                        </a>
                        <a href="#about" className="button button--ghost">
                            About me
                        </a>
                    </div>

                    {coreStack.length > 0 && (
                        <ul className="hero__stack" aria-label="Core technologies">
                            {coreStack.map((item, index) => (
                                <li key={item} className="tech-tag" style={{ "--i": index }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <figure className="hero__portrait">
                    <div className="hero__frame">
                        {heroImage ? (
                            <Image
                                src={heroImage}
                                alt={profile.photo ? `${profile.name} portrait` : `${projects[0]?.title} project preview`}
                                fill
                                preload
                                sizes="(max-width: 700px) 90vw, 40vw"
                                className="hero__image"
                            />
                        ) : (
                            <div className="hero__initials" aria-hidden="true">
                                {initials(profile.name)}
                            </div>
                        )}
                    </div>
                    {profile.location && (
                        <figcaption className="hero__location">
                            <span>Based in</span> {profile.location}
                        </figcaption>
                    )}
                </figure>
            </div>

            {stats.length > 0 && (
                <div className="container">
                    <ul className="hero-stats" aria-label="Highlights">
                        {stats.map((stat, index) => (
                            <li key={`${stat.value}-${stat.label}`}>
                                <StatValue value={stat.value} index={index} /> <span>{stat.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
