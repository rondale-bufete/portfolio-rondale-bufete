import { createClient } from "@supabase/supabase-js";

// Use the anon key for public reads; RLS restricts it to SELECT access.
export const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: { persistSession: false },
    }
);
