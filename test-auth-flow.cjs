const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFlow() {
  // 1. Sign in with the user's actual email (I can't without password)
  // Let's just create a test user
  const email = `testadmin_${Date.now()}@vyanasoul.com`;
  const password = 'TestPassword123!';
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) {
    console.error('Sign up error:', authError.message);
    return;
  }
  
  console.log('Signed up user:', email);
  const token = authData.session.access_token;
  
  // 2. Fetch /consultancy
  const res = await fetch(`${supabaseUrl}/functions/v1/make-server-d03e957c/consultancy`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log('Status:', res.status);
  const json = await res.json();
  console.log('Response:', JSON.stringify(json, null, 2));
}

testFlow();
