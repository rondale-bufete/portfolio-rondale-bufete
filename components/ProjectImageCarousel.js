"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectImageCarousel({ images = [], title }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="eyebrow flex aspect-video w-full items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-raised)] text-center">
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
        <div className="project-carousel w-full">
            <div className="project-carousel__main relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-raised)]">
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
                        <div className="absolute bottom-3.5 left-3.5 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-bg)]/85 px-2.5 py-1 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text)]">
                            {activeIndex + 1}/{images.length}
                        </div>
                        <div className="absolute bottom-3.5 right-3.5 flex gap-1.5">
                            <button
                                type="button"
                                onClick={showPrevious}
                                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg)]/85 text-[var(--color-text)] backdrop-blur-sm transition-colors hover:border-[var(--color-body)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                                aria-label="Show previous project image"
                            >
                                <span aria-hidden="true">&larr;</span>
                            </button>
                            <button
                                type="button"
                                onClick={showNext}
                                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                aria-label="Show next project image"
                            >
                                <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {hasMultipleImages && (
                <div className="mt-2.5 grid grid-cols-6 gap-2.5" aria-label="Project image thumbnails">
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative aspect-video overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-raised)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${index === activeIndex ? "border-[var(--color-accent)]" : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"}`}
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
