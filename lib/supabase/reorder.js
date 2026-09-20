import { supabaseAdmin } from "./admin";

// Shared by every admin content type that supports drag-free up/down
// reordering (projects, certifications, sections, experience, education).
// Swaps `sort_order` between a row and its immediate neighbor.
//
// This reads the current order, then issues two updates — it is not
// wrapped in a database transaction, so two concurrent moves on the same
// table can still race and leave sort_order briefly inconsistent. A fully
// atomic fix needs a Postgres function that does both updates in one
// transaction; this is the best that's achievable from the client alone.
export async function moveItem(table, id, direction) {
    const { data: all, error: fetchError } = await supabaseAdmin
        .from(table)
        .select("id, sort_order")
        .order("sort_order");
    if (fetchError) throw new Error(fetchError.message);
    if (!all) return;

    const index = all.findIndex((row) => row.id === id);
    if (index === -1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= all.length) return;

    const current = all[index];
    const neighbor = all[swapIndex];

    const results = await Promise.all([
        supabaseAdmin.from(table).update({ sort_order: neighbor.sort_order }).eq("id", current.id),
        supabaseAdmin.from(table).update({ sort_order: current.sort_order }).eq("id", neighbor.id),
    ]);
    const updateError = results.find((result) => result.error)?.error;
    if (updateError) throw new Error(updateError.message);
}

// Returns the sort_order for a new row appended to the end of `table`,
// optionally scoped by equality filters (e.g. { category_id: id } for
// skill_items nested under a category).
export async function nextSortOrder(table, filters = {}) {
    let query = supabaseAdmin.from(table).select("sort_order");
    for (const [column, value] of Object.entries(filters)) {
        query = query.eq(column, value);
    }
    const { data, error } = await query.order("sort_order", { ascending: false }).limit(1);
    if (error) throw new Error(error.message);
    return data?.[0] ? data[0].sort_order + 1 : 0;
}
