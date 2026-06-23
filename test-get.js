fetch('https://xvdoutqezjsuogankqna.supabase.co/functions/v1/make-server-d03e957c/consultancy', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' }
}).then(r => r.json()).then(console.log).catch(console.error);
