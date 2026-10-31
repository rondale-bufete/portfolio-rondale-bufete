"use client";

import Image from "next/image";
import { useEffect, useEffectEvent } from "react";
import { useModalBehavior } from "../useModalBehavior";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "./icons";

export default function ImageLightbox({ images, title, index, onIndexChange, onClose }) {
    const dialogRef = useModalBehavior(onClose);
    const count = images.length;
    const hasMultiple = count > 1;

    function show(nextIndex) {
        onIndexChange((nextIndex + count) % count);
    }

    const handleArrowKeys = useEffectEvent((event) => {
        if (!hasMultiple) return;
        if (event.key === "ArrowLeft") show(index - 1);
        if (event.key === "ArrowRight") show(index + 1);
    });

    useEffect(() => {
        const listener = (event) => handleArrowKeys(event);
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);

    const label = `${title} screenshot ${index + 1} of ${count}`;

    return (
        <div className="lightbox" onClick={onClose}>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                className="lightbox__dialog"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="lightbox__bar">
                    <p className="lightbox__count">
                        {index + 1} of {count}
                    </p>
                    <button type="button" className="lightbox__button" onClick={onClose} aria-label="Close screenshot viewer">
                        <CloseIcon size={20} />
                    </button>
                </div>

                <div className="lightbox__stage">
                    <Image key={images[index]} src={images[index]} alt={label} fill sizes="100vw" className="lightbox__image" />
                </div>

                {hasMultiple && (
                    <div className="lightbox__nav">
                        <button type="button" className="lightbox__button" onClick={() => show(index - 1)} aria-label="Previous screenshot">
                            <ArrowLeftIcon size={20} />
                        </button>
                        <button type="button" className="lightbox__button" onClick={() => show(index + 1)} aria-label="Next screenshot">
                            <ArrowRightIcon size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
