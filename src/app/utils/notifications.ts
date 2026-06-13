const TELEGRAM_BOT_TOKEN = '8998508406:AAF2h2xdYJNiAw34ns7KwGOhfcw8t9VODoY';
const TELEGRAM_CHAT_ID = '1406483220';

export async function sendTelegramNotification(message: string) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    }
  } catch (error) {
    console.error('Telegram API error:', error);
  }
}
