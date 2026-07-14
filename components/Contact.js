"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import FormStatusModal from "./FormStatusModal";

export default function Contact() {
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
        <section id="contact" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">04 — Contact</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                Let&rsquo;s work together
            </h2>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                <div>
                    <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor="name">
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
                        className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors disabled:opacity-60"
                    />
                </div>

                <div>
                    <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor="email">
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
                        className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors disabled:opacity-60"
                    />
                </div>

                <div>
                    <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor="message">
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
                        className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors resize-none disabled:opacity-60"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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