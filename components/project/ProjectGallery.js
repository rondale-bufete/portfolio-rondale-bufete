"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageLightbox from "./ImageLightbox";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

// Every screenshot is drawn at the same height and keeps its own width, so
// tall phone captures sit side by side while wide web captures fill the
// stage — without storing image dimensions, and without the stage height
// shifting as images load.
export default function ProjectGallery({ images = [], title }) {
    const stripRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(null);
    const [scroll, setScroll] = useState({ canGoBack: false, canGoForward: false });

    const updateScroll = useCallback(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const maxScroll = strip.scrollWidth - strip.clientWidth;
        const canGoBack = strip.scrollLeft > 1;
        const canGoForward = strip.scrollLeft < maxScroll - 1;
        setScroll((current) =>
            current.canGoBack === canGoBack && current.canGoForward === canGoForward ? current : { canGoBack, canGoForward }
        );
    }, []);

    useEffect(() => {
        updateScroll();
        window.addEventListener("resize", updateScroll);
        return () => window.removeEventListener("resize", updateScroll);
    }, [updateScroll]);

    if (images.length === 0) return null;

    function scrollStrip(direction) {
        const strip = stripRef.current;
        if (!strip) return;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }

    const count = images.length;
    const isScrollable = scroll.canGoBack || scroll.canGoForward;

    return (
        <section className="project-gallery" aria-label="Screenshots">
            <div className="project-gallery__inner">
                <ul ref={stripRef} className="project-gallery__strip" onScroll={updateScroll}>
                    {images.map((src, index) => (
                        <li key={src} className="project-gallery__item">
                            <button
                                type="button"
                                className="project-gallery__shot"
                                onClick={() => setOpenIndex(index)}
                                aria-label={`Enlarge screenshot ${index + 1} of ${count}`}
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    width={1600}
                                    height={1000}
                                    sizes="(max-width: 700px) 100vw, 1280px"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    onLoad={updateScroll}
                                    className="project-gallery__image"
                                />
                            </button>
                        </li>
                    ))}
                </ul>

                {count > 1 && (
                    <div className="project-gallery__bar">
                        <p className="project-gallery__count">{count} screenshots</p>
                        {isScrollable && (
                            <div className="project-gallery__controls">
                                <button
                                    type="button"
                                    className="project-gallery__control"
                                    onClick={() => scrollStrip(-1)}
                                    disabled={!scroll.canGoBack}
                                    aria-label="Scroll to earlier screenshots"
                                >
                                    <ArrowLeftIcon />
                                </button>
                                <button
                                    type="button"
                                    className="project-gallery__control"
                                    onClick={() => scrollStrip(1)}
                                    disabled={!scroll.canGoForward}
                                    aria-label="Scroll to later screenshots"
                                >
                                    <ArrowRightIcon />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {openIndex !== null && (
                <ImageLightbox
                    images={images}
                    title={title}
                    index={openIndex}
                    onIndexChange={setOpenIndex}
                    onClose={() => setOpenIndex(null)}
                />
            )}
        </section>
    );
}
