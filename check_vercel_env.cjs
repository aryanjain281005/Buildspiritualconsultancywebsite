const https = require('https');

https.get('https://vyanasoul.com/', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      https.get('https://vyanasoul.com' + match[1], (res2) => {
        let js = '';
        res2.on('data', d => js += d);
        res2.on('end', () => {
          const supabaseUrl = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/g);
          console.log("Found Supabase URLs in Vercel:", [...new Set(supabaseUrl)]);
        });
      });
    } else {
      console.log("No JS file found in HTML");
    }
  });
});
