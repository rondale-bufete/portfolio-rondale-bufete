"use client";

import { useEffect, useRef, useState } from "react";

const WELCOME_MESSAGES = [
    "Hi! I'm Rondale's portfolio guide — ask me about his skills, projects, experience, or how to connect.",
    "Hello! I can help you explore Rondale Rae Bufete's work, from projects to experience and background.",
    "Hey there! Looking for a quick overview of Rondale's work, skills, or experience? I've got you.",
    "Welcome! Ask me about Rondale's portfolio, key strengths, projects, or the best way to reach him.",
    "Hi! I'm here to walk you through the story behind Rondale's work, skills, and experience.",
    "Hello! Want a snapshot of Rondale's experience, projects, or qualifications? I can help.",
    "Hey! Curious about Rondale's background, projects, certifications, or how to get in touch? Ask away.",
    "Hi there! I can point you to Rondale's most relevant projects, skills, and experience.",
    "Welcome aboard! Happy to answer questions about Rondale's work, background, and experience.",
    "Hello! Need a quick profile summary of Rondale or a list of his strengths? Just ask.",
    "Hi! I can help you dig into Rondale's portfolio with friendly, focused answers.",
    "Hey! I'm Rondale's assistant here — ask about his projects, skills, or how to connect with him directly.",
];

const INK = "#1C1F26";
const INK_SOFT = "#4B5058";
const MUTED = "#6B7280";
const BORDER = "#E4E5E9";
const SURFACE_MUTED = "#F4F5F7";
const ACCENT = "#2E5F52";
const ACCENT_HOVER = "#25493F";
const ERROR = "#B4433A";

function ChatIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
    );
}

function CloseIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}

function SendIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
        </svg>
    );
}

function TypingDots() {
    return (
        <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA0A8] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA0A8] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA0A8] animate-bounce" />
        </span>
    );
}

function renderInlineMarkdown(text) {
    const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

    return tokens.map((token, index) => {
        if (token.startsWith("**") && token.endsWith("**")) {
            return <strong key={index}>{token.slice(2, -2)}</strong>;
        }

        if (token.startsWith("*") && token.endsWith("*")) {
            return <em key={index}>{token.slice(1, -1)}</em>;
        }

        return <span key={index}>{token}</span>;
    });
}

function renderMarkdownContent(content) {
    const blocks = content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

    return blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

        if (lines.length > 1 && lines.every((line) => line.includes("|") && line.split("|").length >= 2)) {
            const rows = lines.map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean));
            const header = rows[0];
            const body = rows.slice(1);

            return (
                <div key={blockIndex} className="overflow-x-auto my-2">
                    <table className="w-full border-collapse text-left text-[11px] sm:text-xs">
                        <thead>
                            <tr>
                                {header.map((cell, cellIndex) => (
                                    <th
                                        key={`${blockIndex}-head-${cellIndex}`}
                                        className="border px-2 py-1 font-semibold"
                                        style={{ borderColor: BORDER, backgroundColor: SURFACE_MUTED, color: INK }}
                                    >
                                        {renderInlineMarkdown(cell)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((row, rowIndex) => (
                                <tr key={`${blockIndex}-row-${rowIndex}`}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={`${blockIndex}-cell-${rowIndex}-${cellIndex}`}
                                            className="border px-2 py-1 align-top"
                                            style={{ borderColor: BORDER }}
                                        >
                                            {renderInlineMarkdown(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        const isList = lines.length > 0 && lines.every((line) => /^([-*]|\d+\.)\s+/.test(line));
        if (isList) {
            const ordered = lines.every((line) => /^\d+\.\s+/.test(line));
            const ListTag = ordered ? "ol" : "ul";
            const listClass = ordered ? "list-decimal pl-5 space-y-1.5" : "list-disc pl-5 space-y-1.5";

            return (
                <ListTag key={blockIndex} className={listClass}>
                    {lines.map((line, lineIndex) => {
                        const cleanLine = line.replace(/^([-*]|\d+\.)\s+/, "");

                        if (/^\*\*[^:]+:\*\*/.test(cleanLine)) {
                            const labelMatch = cleanLine.match(/^\*\*([^:]+):\*\*(.*)$/);
                            if (labelMatch) {
                                return (
                                    <li key={`${blockIndex}-${lineIndex}`}>
                                        <span className="font-semibold" style={{ color: INK }}>{labelMatch[1]}:</span>{" "}
                                        {renderInlineMarkdown(labelMatch[2].trim())}
                                    </li>
                                );
                            }
                        }

                        return <li key={`${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(cleanLine)}</li>;
                    })}
                </ListTag>
            );
        }

        if (/^#{1,3}\s+/.test(block)) {
            const level = Math.min(3, block.match(/^#+/)?.[0].length || 1);
            const headingText = block.replace(/^#{1,3}\s+/, "");
            const Tag = `h${level}`;
            return (
                <Tag key={blockIndex} className="font-semibold mt-1 mb-1" style={{ color: INK }}>
                    {renderInlineMarkdown(headingText)}
                </Tag>
            );
        }

        if (/^(Quick answer|Short answer|Brief answer|Summary):\s*/i.test(block)) {
            const cleaned = block.replace(/^(Quick answer|Short answer|Brief answer|Summary):\s*/i, "");
            return (
                <p key={blockIndex} className="leading-relaxed">
                    <span className="font-semibold" style={{ color: INK }}>Quick answer:</span> {renderInlineMarkdown(cleaned)}
                </p>
            );
        }

        if (/^(Details|More details|Notes):\s*/i.test(block)) {
            const cleaned = block.replace(/^(Details|More details|Notes):\s*/i, "");
            return (
                <div key={blockIndex} className="pt-1">
                    <p className="font-semibold" style={{ color: INK }}>Details</p>
                    <p className="leading-relaxed">{renderInlineMarkdown(cleaned)}</p>
                </div>
            );
        }

        return (
            <p key={blockIndex} className="leading-relaxed">
                {renderInlineMarkdown(block)}
            </p>
        );
    });
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    // { role: "user" | "assistant" | "error", content: string }
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState(
        () => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
    );
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, isOpen]);

    function handleToggleChat() {
        setIsOpen((current) => {
            const next = !current;
            if (next && messages.length === 0) {
                setWelcomeMessage(WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);
            }
            return next;
        });
    }

    async function handleSend(e) {
        e.preventDefault();
        const text = input.trim();
        if (!text || isLoading) return;

        const nextMessages = [...messages, { role: "user", content: text }];
        setMessages(nextMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMessages
                        .filter((m) => m.role === "user" || m.role === "assistant")
                        .map((m) => ({ role: m.role, content: m.content })),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessages((prev) => [...prev, { role: "error", content: data.error || "Something went wrong." }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
            }
        } catch {
            setMessages((prev) => [...prev, { role: "error", content: "Network error — please try again." }]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSend(e);
        }
    }

    return (
        <>
            <button
                onClick={handleToggleChat}
                aria-label={isOpen ? "Close chat" : "Open chat"}
                aria-expanded={isOpen}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-md transition-colors flex items-center justify-center"
                style={{ backgroundColor: isOpen ? ACCENT_HOVER : INK }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isOpen ? ACCENT_HOVER : INK)}
            >
                {isOpen ? <CloseIcon className="w-5 h-5" /> : <ChatIcon className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Portfolio assistant chat"
                    className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden"
                    style={{ border: `1px solid ${BORDER}` }}
                >
                    <div
                        className="px-4 py-3.5 flex items-center justify-between shrink-0"
                        style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                            <p className="font-[family-name:var(--font-display)] text-sm font-medium" style={{ color: INK }}>
                                Ask me anything
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="transition-colors"
                            style={{ color: MUTED }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = INK)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                        >
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.length === 0 && (
                            <div
                                className="max-w-[88%] rounded-xl px-4 py-3"
                                style={{ backgroundColor: SURFACE_MUTED, border: `1px solid ${BORDER}` }}
                            >
                                <p className="text-xs font-medium mb-1.5" style={{ color: MUTED }}>
                                    Portfolio assistant
                                </p>
                                <p className="text-sm leading-relaxed" style={{ color: INK }}>
                                    {welcomeMessage || WELCOME_MESSAGES[0]}
                                </p>
                            </div>
                        )}
                        {messages.map((m, i) =>
                            m.role === "user" ? (
                                <div
                                    key={i}
                                    className="rounded-xl rounded-br-sm px-4 py-2.5 max-w-[85%] ml-auto text-sm leading-relaxed whitespace-pre-wrap text-white"
                                    style={{ backgroundColor: INK }}
                                >
                                    {m.content}
                                </div>
                            ) : m.role === "error" ? (
                                <div key={i} className="text-xs px-1" style={{ color: ERROR }}>
                                    {m.content}
                                </div>
                            ) : (
                                <div
                                    key={i}
                                    className="rounded-xl rounded-bl-sm px-4 py-2.5 max-w-[85%] text-sm leading-relaxed"
                                    style={{ backgroundColor: SURFACE_MUTED, color: INK }}
                                >
                                    <div className="space-y-2">{renderMarkdownContent(m.content)}</div>
                                </div>
                            )
                        )}
                        {isLoading && (
                            <div
                                className="rounded-xl rounded-bl-sm px-4 py-3 max-w-[85%] inline-block"
                                style={{ backgroundColor: SURFACE_MUTED }}
                            >
                                <TypingDots />
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={handleSend}
                        className="p-3 flex items-end gap-2 shrink-0"
                        style={{ borderTop: `1px solid ${BORDER}` }}
                    >
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a question..."
                            rows={1}
                            disabled={isLoading}
                            className="flex-1 resize-none px-3.5 py-2.5 rounded-lg bg-white text-sm focus:outline-none transition-colors disabled:opacity-60 max-h-24"
                            style={{ border: `1px solid ${BORDER}`, color: INK }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = ACCENT;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}22`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = BORDER;
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="Send message"
                            className="w-10 h-10 shrink-0 rounded-lg text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: INK }}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = ACCENT;
                            }}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = INK)}
                        >
                            <SendIcon className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}