"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import FormStatusModal from "./FormStatusModal";
import SectionHeader from "./SectionHeader";
import { ArrowRightIcon, ExternalLinkIcon, FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon } from "./icons";
import { stripProtocol } from "@/lib/format";

function contactMethodsFor(profile) {
    return [
        profile?.email && { label: "Email", value: profile.email, href: `mailto:${profile.email}`, Icon: MailIcon },
        profile?.linkedin && { label: "LinkedIn", value: stripProtocol(profile.linkedin), href: profile.linkedin, Icon: LinkedInIcon },
        profile?.facebook && { label: "Facebook", value: stripProtocol(profile.facebook), href: profile.facebook, Icon: FacebookIcon },
        profile?.instagram && { label: "Instagram", value: stripProtocol(profile.instagram), href: profile.instagram, Icon: InstagramIcon },
    ].filter(Boolean);
}

function ContactMethod({ label, value, href, Icon, index }) {
    const isExternal = href.startsWith("http");
    return (
        <li style={{ "--i": index }}>
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="contact-method"
            >
                <span className="contact-method__icon" aria-hidden="true">
                    <Icon size={18} />
                </span>
                <span className="contact-method__text">
                    <span className="contact-method__label">{label}</span>
                    <span className="contact-method__value" title={value}>{value}</span>
                </span>
                {isExternal ? (
                    <>
                        <ExternalLinkIcon size={16} className="contact-method__arrow" />
                        <span className="sr-only"> (opens in a new tab)</span>
                    </>
                ) : (
                    <ArrowRightIcon size={16} className="contact-method__arrow" />
                )}
            </a>
        </li>
    );
}

export default function Contact({ profile, label = "Contact", heading = "Let’s talk" }) {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus("sending");

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                { name: form.name, email: form.email, message: form.message },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );
            setStatus("success");
            setForm({ name: "", email: "", message: "" });
        } catch {
            setStatus("error");
        }
    }

    const methods = contactMethodsFor(profile);
    const isSending = status === "sending";

    return (
        <section id="contact" className="section contact">
            <div className="container contact__layout">
                <div className="contact__intro">
                    <SectionHeader label={label} heading={heading} />
                    <p className="contact__lead">Send a message here, or reach me directly.</p>
                    {methods.length > 0 && (
                        <ul className="contact__methods" data-reveal>
                            {methods.map((method, index) => (
                                <ContactMethod key={method.label} {...method} index={index} />
                            ))}
                        </ul>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="contact-form" data-reveal>
                    <div className="contact-form__header">
                        <span>Send a message</span>
                        <span>Usually replies within a day</span>
                    </div>

                    <div className="contact-form__fields">
                        <label className="field">
                            <span className="field__label">Name</span>
                            <input name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} disabled={isSending} className="field__input" />
                        </label>
                        <label className="field">
                            <span className="field__label">Email</span>
                            <input name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} disabled={isSending} className="field__input" />
                        </label>
                        <label className="field">
                            <span className="field__label">Message</span>
                            <textarea
                                name="message"
                                required
                                rows={5}
                                placeholder="What would you like to talk about?"
                                value={form.message}
                                onChange={handleChange}
                                disabled={isSending}
                                className="field__input field__input--area"
                            />
                        </label>

                        <div className="contact-form__footer">
                            <span>All fields are required</span>
                            <button type="submit" disabled={isSending} className={`button button--primary ${isSending ? "is-loading" : ""}`}>
                                {isSending ? "Sending…" : "Send message"}
                                {!isSending && <ArrowRightIcon size={16} />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {(status === "success" || status === "error") && <FormStatusModal status={status} onClose={() => setStatus("idle")} />}
        </section>
    );
}
