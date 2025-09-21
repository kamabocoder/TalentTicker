import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujkkzlcrivxykawuytdt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa2t6bGNyaXZ4eWthd3V5dGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzYyOTAsImV4cCI6MjA3NDA1MjI5MH0.Lb4AiaT3rY1aeD73jYyz31C-HPnavR92B6UlwZ4ePYY'

export const supabase = createClient(supabaseUrl, supabaseKey)