import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://egwishjwlrhhumtnkrfo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnd2lzaGp3bHJoaHVtdG5rcmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI4NDQsImV4cCI6MjA2Nzc2ODg0NH0.6w-G_nOuz-HdrFIKJpwA5ChQvSD4cDTfmvG5K0hh9o4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)