"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectImageCarousel({ images = [], title }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#14161A] text-center font-mono text-xs uppercase tracking-[0.14em] text-[#9A9DA3]">
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
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#14161A] shadow-[0_1px_2px_rgba(20,22,26,0.04)]">
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
                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#14161A]/75 text-lg text-white backdrop-blur-sm transition-colors hover:bg-[#3355FF] focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Show previous project image"
                        >
                            <span aria-hidden="true">&larr;</span>
                        </button>
                        <button
                            type="button"
                            onClick={showNext}
                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#14161A]/75 text-lg text-white backdrop-blur-sm transition-colors hover:bg-[#3355FF] focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Show next project image"
                        >
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#14161A]/75 px-3 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
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
                            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-[#14161A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3355FF] ${index === activeIndex ? "border-[#3355FF] ring-2 ring-[#3355FF]/20" : "border-[#E4E4E7] hover:border-[#3355FF]/60"}`}
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
