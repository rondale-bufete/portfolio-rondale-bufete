import { vi } from "vitest";

export function createQueryBuilder(result = { data: null, error: null }) {
    const builder = {
        select: vi.fn(() => builder),
        insert: vi.fn(() => builder),
        update: vi.fn(() => builder),
        upsert: vi.fn(() => builder),
        delete: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        neq: vi.fn(() => builder),
        order: vi.fn(() => builder),
        limit: vi.fn(() => builder),
        single: vi.fn(() => Promise.resolve(result)),
        maybeSingle: vi.fn(() => Promise.resolve(result)),
        then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
    };
    return builder;
}

export function createStorageMock({ uploadResult = { error: null }, publicUrl = "https://example.test/asset.png" } = {}) {
    return {
        from: vi.fn(() => ({
            upload: vi.fn(() => Promise.resolve(uploadResult)),
            getPublicUrl: vi.fn(() => ({ data: { publicUrl } })),
            remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
    };
}

export function createSupabaseMock({ from, storage } = {}) {
    return {
        from: from || vi.fn(() => createQueryBuilder()),
        storage: storage || createStorageMock(),
    };
}
