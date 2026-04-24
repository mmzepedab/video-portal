import { readFile } from 'fs/promises';
import path from 'path';

type SendVideoToTelegramProps = {
  videoUrl: string;
  caption?: string;
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendVideoToTelegram({
  videoUrl,
  caption,
}: SendVideoToTelegramProps) {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('Telegram Bot token missing');
  }

  if (!TELEGRAM_CHAT_ID) {
    throw new Error('Telegram Chat token missing');
  }

  const filePath = path.join(process.cwd(), 'public', videoUrl);
  const buffer = await readFile(filePath);

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('caption', caption ?? '');

  const blob = new Blob([buffer], { type: 'video/mp4' });
  formData.append('video', blob, videoUrl);

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`Telegram error: ${JSON.stringify(data)}`);
  }

  return data;
}
