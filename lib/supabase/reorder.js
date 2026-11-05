import { supabaseAdmin } from "./admin";

// Swap sort_order with the adjacent row for admin list reordering.
// `includes` limits which rows take part, so a move skips rows that aren't
// shown in the same list (e.g. legacy sections that never render).
// The two updates are not transactional, so concurrent moves can briefly race.
export async function moveItem(table, id, direction, includes = () => true) {
    const { data: rows, error: fetchError } = await supabaseAdmin.from(table).select("*").order("sort_order");
    if (fetchError) throw new Error(fetchError.message);
    if (!rows) return;
    const all = rows.filter(includes);

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

// Return the next sort_order, optionally scoped by equality filters.
export async function nextSortOrder(table, filters = {}) {
    let query = supabaseAdmin.from(table).select("sort_order");
    for (const [column, value] of Object.entries(filters)) {
        query = query.eq(column, value);
    }
    const { data, error } = await query.order("sort_order", { ascending: false }).limit(1);
    if (error) throw new Error(error.message);
    return data?.[0] ? data[0].sort_order + 1 : 0;
}
