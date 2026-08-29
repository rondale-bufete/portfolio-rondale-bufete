function SocialLink({ href, label, children }) {
    return (
        <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="group inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-medium text-[#454951] transition-all duration-200 hover:border-[#3355FF] hover:text-[#14161A] hover:shadow-sm"
        >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF0F3] text-[#14161A] transition-colors group-hover:bg-[#E8EDFF] group-hover:text-[#3355FF]">
                {children}
            </span>
            {label}
        </a>
    );
}

export default function Footer({ profile }) {
    return (
        <footer className="border-t border-[#E4E4E7] bg-[#FAFAFA]">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14161A] text-sm font-bold text-white">
                        {profile?.name?.charAt(0) || "R"}
                    </div>
                    <div>
                        <p className="font-[family-name:var(--font-display)] text-lg font-medium text-[#14161A]">
                            {profile?.name}
                        </p>
                        {/* <p className="text-xs uppercase tracking-[0.18em] text-[#9A9DA3]">Available for work</p> */}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SocialLink href={profile?.github} label="GitHub">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.12c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.44-2.28 1.17-3.09-.12-.29-.51-1.46.11-3.04 0 0 .95-.31 3.12 1.17a10.8 10.8 0 0 1 5.68 0c2.17-1.48 3.12-1.17 3.12-1.17.62 1.58.23 2.75.11 3.04.73.81 1.17 1.84 1.17 3.09 0 4.41-2.7 5.39-5.27 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                        </svg>
                    </SocialLink>

                    <SocialLink href={profile?.linkedin} label="LinkedIn">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.88v8.75H5.5V9.75Zm4.97 0h2.76v1.2h.04c.38-.73 1.32-1.5 2.72-1.5 2.9 0 3.44 1.91 3.44 4.39v6.66h-2.87v-6.24c0-1.48-.03-3.39-2.07-3.39-2.07 0-2.38 1.62-2.38 3.28v6.35H10.47V9.75Z" />
                        </svg>
                    </SocialLink>

                    <SocialLink href={`mailto:${profile?.email}`} label="Email">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5v-11Zm2.05 1.14 6.45 4.8 6.45-4.8a.5.5 0 0 0-.38-.14H5.93a.5.5 0 0 0-.38.14Zm13.45 1.3-6.58 4.9a.75.75 0 0 1-.84 0L4.5 8.94v8.56c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5V8.94Z" />
                        </svg>
                    </SocialLink>
                </div>
            </div>

            <div className="mx-auto max-w-5xl border-t border-[#E4E4E7] px-6 py-4 text-center text-xs uppercase tracking-[0.16em] text-[#9A9DA3]">
                © {new Date().getFullYear()} {profile?.name}
            </div>
        </footer>
    );
}
