import { createClient } from '@supabase/supabase-js';
import https from 'https';

const projectId = "xvdoutqezjsuogankqna";
const url = `https://${projectId}.supabase.co/functions/v1/make-server-d03e957c/consultancy`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Body:", data);
  });
});
