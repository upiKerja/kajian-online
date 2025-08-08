import { createClient } from "@supabase/supabase-js";

export const client = createClient(
    process.env.SUPA, process.env.BASE
)