import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Créer une erreur si jamais on oublie de mettre les variables d'environnement.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase URL or Anon Key");
}

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export default supabase;
