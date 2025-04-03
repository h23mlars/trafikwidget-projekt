import { createClient } from '@supabase/supabase-js';

// Ersätt med dina Supabase-uppgifter som du får från Supabase Dashboard
const supabaseUrl = 'https://owiszgzxvfcmldeawhpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXN6Z3p4dmZjbWxkZWF3aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTY5MTYsImV4cCI6MjA1OTI3MjkxNn0.l1QOPd9zR5rgeJvpPs1cZx-A1Ly2kPLRY-IXqt_soFA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
