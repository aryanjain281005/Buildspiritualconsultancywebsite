const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env';
let supabaseUrl, supabaseKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
} catch(e) {}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('consultancy_requests').select('*').limit(1);
  console.log('SELECT:', { data, error });
  
  const { error: insErr } = await supabase.from('consultancy_requests').insert({
    full_name: 'Test', email: 'test@example.com', status: 'pending'
  });
  console.log('INSERT:', { error: insErr });
}
test();
