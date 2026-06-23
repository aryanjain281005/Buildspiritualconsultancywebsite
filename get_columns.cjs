const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('bookings').select('*').limit(1).then(res => {
  if (res.error) console.error(res.error);
  else console.log(Object.keys(res.data[0] || {}));
});
