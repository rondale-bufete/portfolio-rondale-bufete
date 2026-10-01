"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import FormStatusModal from "./FormStatusModal";
import SectionHeader, { pageShell } from "./SectionHeader";
import { stripProtocol } from "@/lib/format";

const CONTACT_METHODS = [
    { key: "email", icon: "@" },
    { key: "linkedin", icon: "in" },
    { key: "facebook", icon: "fb" },
    { key: "instagram", icon: "ig" },
];

// A single "Direct" contact method
function ContactCard({ icon, label, value, href }) {
    if (!value) return null;

    const Wrapper = href ? "a" : "div";
    const linkProps = href
        ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" }
        : {};

    return (
        <Wrapper
            {...linkProps}
            className="flex items-center gap-3.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-colors hover:border-[var(--color-border-strong)]"
        >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-raised)] font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">
                {icon}
            </span>
            <span className="min-w-0 flex flex-col gap-0.5">
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)]">{label}</span>
                <span className="block truncate text-sm text-[var(--color-text)]" title={value}>{value}</span>
            </span>
        </Wrapper>
    );
}

export default function Contact({ profile, label = "04 — Contact", heading ="Let’s talk" }) {
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

    const values = {
        email: profile?.email,
        linkedin: stripProtocol(profile?.linkedin),
        facebook: stripProtocol(profile?.facebook),
        instagram: stripProtocol(profile?.instagram),
    };
    const hrefs = {
        email: profile?.email ? `mailto:${profile.email}` : undefined,
        linkedin: profile?.linkedin,
        facebook: profile?.facebook,
        instagram: profile?.instagram,
    };

    return (
        <section id="contact" className={`${pageShell} contact-page`}>
            <div className="contact-layout grid md:grid-cols-2 items-start gap-10">
                <div className="contact-intro">
                    <SectionHeader label={label} heading={heading} />
                    <div className="contact-methods grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CONTACT_METHODS.map(({ key, icon }) => (
                            <ContactCard key={key} icon={icon} label={key} value={values[key]} href={hrefs[key]} />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="contact-form rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">
                        <span>Send a message</span>
                        <span>Usually replies within a day</span>
                    </div>

                    <div className="px-5 py-5 flex flex-col gap-5">
                        <label className="flex flex-col gap-2">
                            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-body)]">Name</span>
                            <input
                                name="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={handleChange}
                                disabled={status === "sending"}
                                className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-3 focus:ring-[var(--color-accent)]/20 transition-colors disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-body)]">Email</span>
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                disabled={status === "sending"}
                                className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-3 focus:ring-[var(--color-accent)]/20 transition-colors disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-body)]">Message</span>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="What would you like to talk about?"
                                value={form.message}
                                onChange={handleChange}
                                disabled={status === "sending"}
                                className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-faint)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-3 focus:ring-[var(--color-accent)]/20 transition-colors resize-none disabled:opacity-60"
                            />
                        </label>

                        <div className="flex items-center justify-between pt-1">
                            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)]">All fields are required</span>
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status === "sending" ? "Sending…" : "Send message ↗"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {(status === "success" || status === "error") && (
                <FormStatusModal status={status} onClose={closeModal} />
            )}
        </section>
    );
}