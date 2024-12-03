import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL y SUPABASE_ANON_KEY son obligatorios. Posibles problemas ha de ser el dotenv.");
}
export const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY)
