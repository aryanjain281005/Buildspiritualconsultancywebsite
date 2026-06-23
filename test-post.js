fetch('https://xvdoutqezjsuogankqna.supabase.co/functions/v1/make-server-d03e957c/consultancy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fullName: 'Arjun Test', email: 'arjun@example.com' })
}).then(r => r.json()).then(console.log).catch(console.error);
