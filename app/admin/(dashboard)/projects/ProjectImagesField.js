"use client";

import { useRef, useState } from "react";

export default function ProjectImagesField({ imageUrls = [] }) {
    const [remainingImages, setRemainingImages] = useState(imageUrls);
    const draggedIndex = useRef(null);

    function moveImage(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;

        setRemainingImages((current) => {
            if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) {
                return current;
            }

            const reordered = [...current];
            const [imageUrl] = reordered.splice(fromIndex, 1);
            reordered.splice(toIndex, 0, imageUrl);
            return reordered;
        });
    }

    return (
        <div>
            <label className="field-label block mb-1.5">Showcase images</label>
            <div className="flex flex-wrap items-start gap-3" role="list" aria-label="Project showcase images">
                {remainingImages.map((imageUrl, index) => (
                    <div
                        key={imageUrl}
                        role="listitem"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            if (draggedIndex.current !== null) {
                                moveImage(draggedIndex.current, index);
                            }
                            draggedIndex.current = null;
                        }}
                        className="w-28 shrink-0"
                    >
                        <img
                            src={imageUrl}
                            alt=""
                            draggable
                            onDragStart={(event) => {
                                draggedIndex.current = index;
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setData("text/plain", imageUrl);
                            }}
                            onDragEnd={() => {
                                draggedIndex.current = null;
                            }}
                            className="w-28 aspect-video cursor-grab rounded-[var(--radius-md)] object-cover border border-[var(--color-border-strong)] active:cursor-grabbing"
                        />
                        <p className="mt-1 text-xs text-[var(--color-faint)]">
                            {index === 0 ? "Thumbnail" : `Image ${index + 1}`}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveImage(index, index - 1)}
                                    disabled={index === 0}
                                    aria-label={`Move showcase image ${index + 1} earlier`}
                                    className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-xs text-[var(--color-body)] hover:text-[var(--color-text)] disabled:opacity-40"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveImage(index, index + 1)}
                                    disabled={index === remainingImages.length - 1}
                                    aria-label={`Move showcase image ${index + 1} later`}
                                    className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-xs text-[var(--color-body)] hover:text-[var(--color-text)] disabled:opacity-40"
                                >
                                    ↓
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setRemainingImages((current) => current.filter((url) => url !== imageUrl))}
                                aria-label={`Remove showcase image ${index + 1}`}
                                className="text-xs text-[var(--color-danger-text)] hover:text-[var(--color-danger-solid)]"
                            >
                                Remove
                            </button>
                        </div>
                        <input type="hidden" name="existing_images" value={imageUrl} />
                    </div>
                ))}
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    className="max-w-full text-sm text-[var(--color-body)]"
                />
            </div>
            <p className="mt-1 text-xs text-[var(--color-faint)]">
                Drag images to reorder, or use the arrows. The first image is the project thumbnail. Changes take effect when you save.
            </p>
        </div>
    );
}
