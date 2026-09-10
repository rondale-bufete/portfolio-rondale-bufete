"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectImageCarousel({ images = [], title }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-video w-full items-center justify-center border-2 border-[var(--color-text)] bg-[var(--color-text)] text-center font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-neutral-400)]">
                Preview unavailable
            </div>
        );
    }

    const activeImage = images[activeIndex];
    const hasMultipleImages = images.length > 1;

    function showPrevious() {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
    }

    function showNext() {
        setActiveIndex((index) => (index + 1) % images.length);
    }

    return (
        <div className="w-full">
            <div className="relative aspect-video w-full overflow-hidden border-2 border-[var(--color-text)] bg-[var(--color-text)]">
                <Image
                    src={activeImage}
                    alt={`${title} showcase image ${activeIndex + 1} of ${images.length}`}
                    fill
                    priority={activeIndex === 0}
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain"
                />

                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            onClick={showPrevious}
                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border-2 border-white/40 bg-[var(--color-text)]/75 text-lg text-white backdrop-blur-sm transition-colors hover:bg-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Show previous project image"
                        >
                            <span aria-hidden="true">&larr;</span>
                        </button>
                        <button
                            type="button"
                            onClick={showNext}
                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border-2 border-white/40 bg-[var(--color-text)]/75 text-lg text-white backdrop-blur-sm transition-colors hover:bg-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Show next project image"
                        >
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                        <div className="tag tag-neutral absolute bottom-3 left-1/2 -translate-x-1/2 !bg-[var(--color-text)]/75 !text-white backdrop-blur-sm">
                            {activeIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {hasMultipleImages && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Project image thumbnails">
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 bg-[var(--color-text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${index === activeIndex ? "border-[var(--color-accent)]" : "border-[var(--color-divider)] hover:border-[var(--color-accent)]"}`}
                            aria-label={`Show project image ${index + 1}`}
                            aria-current={index === activeIndex ? "true" : undefined}
                        >
                            <Image
                                src={image}
                                alt=""
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
