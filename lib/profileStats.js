// Headline numbers under the homepage intro ("300+ subscriber accounts").
// Stored on the profile row as a JSON array of { value, label }.
export const MAX_STATS = 3;
export const STAT_VALUE_MAX_LENGTH = 12;
export const STAT_LABEL_MAX_LENGTH = 40;

// Admin form fields are stat_value_1/stat_label_1 … stat_value_3/stat_label_3.
// Rows left fully empty are skipped; a half-filled row is a mistake worth flagging.
export function parseStatsForm(formData) {
    const stats = [];

    for (let row = 1; row <= MAX_STATS; row += 1) {
        const value = formData.get(`stat_value_${row}`)?.toString().trim() || "";
        const label = formData.get(`stat_label_${row}`)?.toString().trim() || "";
        if (!value && !label) continue;

        if (!value || !label) {
            throw new Error(`Headline number ${row} needs both a number and a label.`);
        }
        if (value.length > STAT_VALUE_MAX_LENGTH) {
            throw new Error(`Headline number ${row}: keep the number to ${STAT_VALUE_MAX_LENGTH} characters or fewer.`);
        }
        if (label.length > STAT_LABEL_MAX_LENGTH) {
            throw new Error(`Headline number ${row}: keep the label to ${STAT_LABEL_MAX_LENGTH} characters or fewer.`);
        }
        stats.push({ value, label });
    }

    return stats;
}

// The column is JSON, so anything not shaped like a stat is dropped rather than rendered.
export function normalizeStats(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((stat) => typeof stat?.value === "string" && typeof stat?.label === "string" && stat.value && stat.label)
        .slice(0, MAX_STATS)
        .map(({ value, label }) => ({ value, label }));
}
