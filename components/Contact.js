"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import FormStatusModal from "./FormStatusModal";
import SectionHeader, { sectionShell } from "./SectionHeader";

export default function Contact({ label = "04 — Contact", heading = "Let\u2019s work together" }) {
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
        <section id="contact" className={sectionShell}>
            <SectionHeader label={label} heading={heading} />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5" htmlFor="name">
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
                        className="w-full px-4 py-2.5 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-60"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5" htmlFor="email">
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
                        className="w-full px-4 py-2.5 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-60"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        disabled={status === "sending"}
                        className="w-full px-4 py-2.5 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none disabled:opacity-60"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="px-6 py-2.5 bg-[var(--color-text)] text-white text-sm font-bold hover:bg-[var(--color-accent)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {status === "sending" ? "Sending..." : "Send Message"}
                </button>
            </form>

            {(status === "success" || status === "error") && (
                <FormStatusModal status={status} onClose={closeModal} />
            )}
        </section>
    );
}