import { createClient } from "@supabase/supabase-js";

export const client = createClient(
    "https://hggxutlouhypvgmrsjkm.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ3h1dGxvdWh5cHZnbXJzamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTE2OTAsImV4cCI6MjA3MDEyNzY5MH0.CX683jMxjy-UIHI_3Cy2wq12zFnuN9d20he_nCv8J6c"
)