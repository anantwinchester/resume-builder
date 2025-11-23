import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vwdljkxkqsbswanwvrfp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZGxqa3hrcXNic3dhbnd2cmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzgxMjUsImV4cCI6MjA3OTQxNDEyNX0.5T3LqHrCbsN-j3DB7cEkqYhL2Obq2cUN5PlDJMqtUEQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
