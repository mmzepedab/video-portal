type SendInstagramLinkToTelegramProps = {
  title: string;
  permalink: string;
};

export async function sendInstagramLinkToTelegram({
  title,
  permalink,
}: SendInstagramLinkToTelegramProps) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken) {
    throw new Error('Telegram Bot token missing');
  }

  if (!chatId) {
    throw new Error('Telegram Chat ID missing');
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Nuevo Reel publicado ✅\n\n${title}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Abrir en Instagram',
                url: permalink,
              },
            ],
          ],
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`Telegram error: ${JSON.stringify(data)}`);
  }

  return data;
}
