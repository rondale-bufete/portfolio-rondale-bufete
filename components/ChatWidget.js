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

const SUGGESTED_QUESTIONS = ["What is your strongest stack?", "Are you open to remote work?", "Show me client projects"];

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
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-faint)] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-faint)] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-faint)] animate-bounce" />
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
                    <table className="w-full border-collapse text-left text-[11px] sm:text-xs font-[family-name:var(--font-mono)]">
                        <thead>
                            <tr>
                                {header.map((cell, cellIndex) => (
                                    <th key={`${blockIndex}-head-${cellIndex}`} className="border border-[var(--color-border)] bg-[var(--color-raised)] px-2 py-1.5 font-medium text-[var(--color-muted)]">
                                        {renderInlineMarkdown(cell)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((row, rowIndex) => (
                                <tr key={`${blockIndex}-row-${rowIndex}`}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={`${blockIndex}-cell-${rowIndex}-${cellIndex}`} className="border border-[var(--color-border)] px-2 py-1.5 align-top text-[var(--color-body)]">
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
                                        <span className="font-semibold text-[var(--color-text)]">{labelMatch[1]}:</span> {renderInlineMarkdown(labelMatch[2].trim())}
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
            return <Tag key={blockIndex} className="font-semibold text-[var(--color-text)] mt-1 mb-1">{renderInlineMarkdown(headingText)}</Tag>;
        }

        if (/^(Quick answer|Short answer|Brief answer|Summary):\s*/i.test(block)) {
            const cleaned = block.replace(/^(Quick answer|Short answer|Brief answer|Summary):\s*/i, "");
            return (
                <p key={blockIndex} className="leading-relaxed">
                    <span className="font-semibold text-[var(--color-text)]">Quick answer:</span> {renderInlineMarkdown(cleaned)}
                </p>
            );
        }

        if (/^(Details|More details|Notes):\s*/i.test(block)) {
            const cleaned = block.replace(/^(Details|More details|Notes):\s*/i, "");
            return (
                <div key={blockIndex} className="pt-1">
                    <p className="font-semibold text-[var(--color-text)]">Details</p>
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

    // ⌘K / Ctrl+K toggles the palette from anywhere on the page; Esc closes
    // it while open (the textarea's own Enter-to-send is handled separately
    // below, since Escape here needs to fire even when the input isn't focused).
    useEffect(() => {
        function handleGlobalKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setWelcomeMessage(WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);
                setIsOpen((current) => !current);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        }
        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, []);

    async function sendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const nextMessages = [...messages, { role: "user", content: trimmed }];
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

    function handleSend(e) {
        e.preventDefault();
        sendMessage(input);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSend(e);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={handleToggleChat}
                aria-label="Open chat"
                aria-expanded={false}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-[560px] items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-raised)] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,.5)] transition-colors hover:border-[var(--color-body)]"
            >
                <span className="chat-launcher__icon" aria-hidden="true">?</span>
                <span className="flex-1 truncate text-left font-[family-name:var(--font-mono)] text-sm text-[var(--color-faint)]">
                    Ask me about my work
                </span>
                <span className="kbd shrink-0">⌘K</span>
            </button>
        );
    }

    return (
        <div
            role="dialog"
            aria-label="Portfolio assistant chat"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-[560px] max-h-[75vh] w-[calc(100vw-2rem)] max-w-[680px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(0,0,0,.6)]"
        >
            <div className="chat-panel__header">
                <div className="chat-panel__identity">
                    <span className="chat-panel__status" aria-hidden="true" />
                    <div className="chat-panel__title-group">
                        <span className="chat-panel__title">Portfolio guide</span>
                        <span className="chat-panel__byline">Rondale Rae Bufete</span>
                    </div>
                </div>
                <span className="chat-panel__actions">
                    {messages.length > 0 && (
                        <button onClick={() => setMessages([])} className="chat-panel__clear">
                            Clear
                        </button>
                    )}
                    <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="chat-panel__close">
                        <span aria-hidden="true">×</span>
                    </button>
                </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.length === 0 && (
                    <p className="chat-welcome text-[15px] leading-relaxed text-[var(--color-body)]">
                        {welcomeMessage || WELCOME_MESSAGES[0]}
                    </p>
                )}
                {messages.map((m, i) =>
                    m.role === "user" ? (
                        <div key={i} className="chat-message chat-message--user">
                            <span>You</span>{m.content}
                        </div>
                    ) : m.role === "error" ? (
                        <div key={i} className="chat-message chat-message--error">
                            {m.content}
                        </div>
                    ) : (
                        <div key={i} className="chat-message chat-message--assistant">
                            <div className="space-y-2">{renderMarkdownContent(m.content)}</div>
                        </div>
                    )
                )}
                {isLoading && (
                    <div className="inline-block rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2">
                        <TypingDots />
                    </div>
                )}
            </div>

            {messages.length === 0 && (
                <div className="chat-panel__suggestions flex shrink-0 flex-wrap gap-2 px-5 pb-4 font-[family-name:var(--font-mono)] text-xs">
                    {SUGGESTED_QUESTIONS.map((question) => (
                        <button
                            key={question}
                            onClick={() => sendMessage(question)}
                            disabled={isLoading}
                            className="chat-panel__suggestion rounded-[var(--radius-md)] border border-[var(--color-border)] px-2.5 py-1.5 text-[var(--color-body)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] disabled:opacity-50"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSend} className="chat-panel__form flex shrink-0 items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-raised)] px-4 py-3.5">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up question…"
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 resize-none bg-transparent font-[family-name:var(--font-mono)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-faint)] focus:outline-none disabled:opacity-60 max-h-24"
                />
                {input.trim() ? (
                    <button
                        type="submit"
                        disabled={isLoading}
                        aria-label="Send message"
                        className="shrink-0 text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] disabled:opacity-40"
                    >
                        <SendIcon className="w-4 h-4" />
                    </button>
                ) : (
                    <span className="kbd shrink-0">↵</span>
                )}
            </form>
        </div>
    );
}
