import { createClient } from "@supabase/supabase-js";

// Anon-key client. RLS only allows SELECT with this key, so it's safe
// to use anywhere data is read for the public-facing site.
export const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: { persistSession: false },
    }
);
