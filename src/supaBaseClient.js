
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqzglwajbnjbvyecreiv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xemdsd2FqYm5qYnZ5ZWNyZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjMzOTgsImV4cCI6MjA2NjAzOTM5OH0.OiwXFS9MtVKdEAT-FrgiZEL_sm-STmXUJMzbXbAZt_I';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
