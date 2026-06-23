const botToken = "8998508406:AAF2h2xdYJNiAw34ns7KwGOhfcw8t9VODoY";
const chatId = "-1004474709313";
const tgMessage = "🔔 *Test Message from Edge Function debug*";
fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ chat_id: chatId, text: tgMessage, parse_mode: "Markdown" })
}).then(r => r.json()).then(console.log).catch(console.error);
