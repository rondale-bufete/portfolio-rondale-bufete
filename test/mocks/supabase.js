import { vi } from "vitest";

/**
 * A minimal chainable stand-in for the Supabase JS query builder, covering
 * the methods this project's admin actions/pages actually call
 * (select/insert/update/upsert/delete/eq/order/single). Every chain method
 * returns `this` so calls can be chained in any order the real client
 * allows, and the chain is `await`-able because it implements `.then`,
 * resolving to whatever `result` was configured for it.
 *
 * Usage:
 *   const table = createQueryBuilder({ data: [{ id: 1 }], error: null });
 *   const client = createSupabaseMock({ from: () => table });
 *   vi.doMock("@/lib/supabase/admin", () => ({ supabaseAdmin: client, ... }));
 */
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
