"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

// Vercel rejects request bodies over 4.5 MB, so warn before a save would fail.
const UPLOAD_WARNING_BYTES = 4 * 1024 * 1024;

function fileSignature(file) {
    return `${file.name}:${file.size}:${file.lastModified}`;
}

function formatMegabytes(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Object URLs are created and revoked in an effect so a preview never
// outlives its tile (and stays correct under Strict Mode's double effects).
function NewImagePreview({ file }) {
    const imageRef = useRef(null);

    useEffect(() => {
        const previewUrl = URL.createObjectURL(file);
        if (imageRef.current) imageRef.current.src = previewUrl;
        return () => URL.revokeObjectURL(previewUrl);
    }, [file]);

    return (
        // eslint-disable-next-line @next/next/no-img-element -- previews a local file before upload; next/image can't optimize it
        <img
            ref={imageRef}
            alt=""
            className="w-28 aspect-video rounded-[var(--radius-md)] object-cover border border-dashed border-[var(--color-accent)]"
        />
    );
}

export default function ProjectImagesField({ imageUrls = [] }) {
    const [remainingImages, setRemainingImages] = useState(imageUrls);
    // A file input can't keep files across separate picks (choosing again
    // replaces the selection), so picked files are kept here and added to
    // the form's data when it submits.
    const [newImages, setNewImages] = useState([]);
    const fieldRef = useRef(null);
    const draggedIndex = useRef(null);
    const nextNewImageId = useRef(0);

    // After a save the page re-renders with the saved list from the database.
    // Start over from it, so a second save can't act on a stale list (and
    // delete the image that was just added) or upload the same files again.
    const savedListKey = imageUrls.join("\n");
    const [shownListKey, setShownListKey] = useState(savedListKey);
    if (savedListKey !== shownListKey) {
        setShownListKey(savedListKey);
        setRemainingImages(imageUrls);
        setNewImages([]);
    }

    const appendNewImages = useEffectEvent((formData) => {
        newImages.forEach(({ file }) => formData.append("images", file));
    });

    useEffect(() => {
        const form = fieldRef.current?.closest("form");
        if (!form) return;
        const handleFormData = (event) => appendNewImages(event.formData);
        form.addEventListener("formdata", handleFormData);
        return () => form.removeEventListener("formdata", handleFormData);
    }, []);

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

    function addPickedFiles(event) {
        const pickedFiles = [...event.target.files];
        // Clear the picker so choosing the same file again still fires a change.
        event.target.value = "";

        setNewImages((current) => {
            const alreadyAdded = new Set(current.map(({ file }) => fileSignature(file)));
            const additions = pickedFiles
                .filter((file) => !alreadyAdded.has(fileSignature(file)))
                .map((file) => {
                    nextNewImageId.current += 1;
                    return { id: nextNewImageId.current, file };
                });
            return [...current, ...additions];
        });
    }

    const newImagesBytes = newImages.reduce((total, { file }) => total + file.size, 0);

    return (
        <div ref={fieldRef}>
            <p className="admin-label">Showcase images</p>
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
                        {/* eslint-disable-next-line @next/next/no-img-element -- a small draggable admin preview */}
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
                {newImages.map(({ id, file }) => (
                    <div key={id} role="listitem" className="w-28 shrink-0">
                        <NewImagePreview file={file} />
                        <p className="mt-1 truncate text-xs text-[var(--color-accent)]" title={file.name}>
                            New: {file.name}
                        </p>
                        <button
                            type="button"
                            onClick={() => setNewImages((current) => current.filter((image) => image.id !== id))}
                            aria-label={`Remove new image ${file.name}`}
                            className="mt-1 text-xs text-[var(--color-danger-text)] hover:text-[var(--color-danger-solid)]"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={addPickedFiles}
                    aria-label="Add showcase images"
                    className="admin-file"
                />
            </div>
            {newImagesBytes > UPLOAD_WARNING_BYTES && (
                <p role="status" className="mt-2 text-xs font-semibold text-[var(--color-danger-text)]">
                    The new images add up to {formatMegabytes(newImagesBytes)}. Uploads over about 4 MB at once can fail, so save
                    fewer images at a time.
                </p>
            )}
            <p className="mt-1 text-xs text-[var(--color-faint)]">
                Drag images to reorder, or use the arrows. The first image is the project thumbnail. New images are added after
                the saved ones. Changes take effect when you save.
            </p>
        </div>
    );
}
