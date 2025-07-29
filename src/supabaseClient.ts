// npm install @supabase/supabase-js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * This taken from https://supabase.com/dashboard/project/mydashsboard,
 * https://supabase.com/dashboard/project/{supabaseURL}/api
 * but, for security purposes, I use .env
 */
