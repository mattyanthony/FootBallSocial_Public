import { createClient } from '@supabase/supabase-js'

const URL = 'https://ehhbobumcmpcsymbjtdo.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaGJvYnVtY21wY3N5bWJqdGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5NTA5NDgsImV4cCI6MjAyODUyNjk0OH0.WE0-eHQfWSsBMB3WqEYV4aVcyAlU71w4i95KVEwhQNU';

export const supabase = createClient(URL, API_KEY);