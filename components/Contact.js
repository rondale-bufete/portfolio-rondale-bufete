"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import FormStatusModal from "./FormStatusModal";
import SectionHeader, { pageShell } from "./SectionHeader";
import { stripProtocol } from "@/lib/format";
import { MailIcon, LinkedInIcon, FacebookIcon, InstagramIcon } from "./SocialIcons";

// A single "Direct" contact method — its own bordered card with an icon,
// instead of one shared box listing every method as a row. Renders as a
// link when href is given (and a value exists), otherwise a plain card.
function ContactCard({ icon: Icon, label, value, href }) {
    if (!value) return null;

    const Wrapper = href ? "a" : "div";
    const linkProps = href
        ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" }
        : {};

    return (
        <Wrapper
            {...linkProps}
            className="group flex items-center gap-3 border-2 border-[var(--color-divider)] bg-[var(--color-neutral-100)] px-4 py-3 transition-colors hover:border-[var(--color-text)]"
        >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--color-accent-100)] text-[var(--color-accent-700)] transition-colors group-hover:bg-[var(--color-text)] group-hover:text-white">
                <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
                <span className="field-label block">{label}</span>
                <span className="block truncate text-xs font-bold text-[var(--color-text)]" title={value}>{value}</span>
            </span>
        </Wrapper>
    );
}

export default function Contact({ profile, label = "04 — Contact", heading ="Let\u2019s work together" }) {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("sending");

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                {
                    name: form.name,
                    email: form.email,
                    message: form.message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );

            setStatus("success");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            setStatus("error");
        }
    }

    function closeModal() {
        setStatus("idle");
    }

    return (
        <section className={pageShell}>
            <SectionHeader label={label} heading={heading} />

            <div className="grid md:grid-cols-[1fr_440px] items-start gap-8 max-w-5xl">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-neutral-700)] mb-1" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            disabled={status === "sending"}
                            className="w-full px-3.5 py-2 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-60"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--color-neutral-700)] mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            disabled={status === "sending"}
                            className="w-full px-3.5 py-2 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-60"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--color-neutral-700)] mb-1" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={3}
                            value={form.message}
                            onChange={handleChange}
                            disabled={status === "sending"}
                            className="w-full px-3.5 py-2 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none disabled:opacity-60"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {status === "sending" ? "Sending..." : "Send Message"}
                    </button>
                </form>

                <div className="space-y-2.5">
                    <p className="field-label text-[var(--color-accent-700)]">Direct</p>
                    <div className="grid grid-cols-2 gap-2">
                        <ContactCard
                            icon={MailIcon}
                            label="Email"
                            value={profile?.email}
                            href={profile?.email ? `mailto:${profile.email}` : undefined}
                        />
                        <ContactCard
                            icon={LinkedInIcon}
                            label="LinkedIn"
                            value={stripProtocol(profile?.linkedin)}
                            href={profile?.linkedin}
                        />
                        <ContactCard
                            icon={FacebookIcon}
                            label="Facebook"
                            value={stripProtocol(profile?.facebook)}
                            href={profile?.facebook}
                        />
                        <ContactCard
                            icon={InstagramIcon}
                            label="Instagram"
                            value={stripProtocol(profile?.instagram)}
                            href={profile?.instagram}
                        />
                    </div>
                </div>
            </div>

            {(status === "success" || status === "error") && (
                <FormStatusModal status={status} onClose={closeModal} />
            )}
        </section>
    );
}