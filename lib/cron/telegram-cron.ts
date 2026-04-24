import cron, { ScheduledTask } from 'node-cron';
import { sendNextVideoToTelegram } from '../video/send-next-video-to-telegram';

let isTelegramCronStarted = false;
let telegramCronTask: ScheduledTask | null = null;
let isTelegramJobRunning = false;

export function startTelegramCron() {
  if (isTelegramCronStarted) {
    console.log('Telegram cron already started');
    return;
  }

  isTelegramCronStarted = true;

  console.log('Starting Telegram cron job...');

  telegramCronTask = cron.schedule('0 9,12,21 * * *', async () => {
    if (isTelegramJobRunning) {
      console.log(
        'Telegram job skipped because previous run is still in progress'
      );
      return;
    }

    isTelegramJobRunning = true;

    try {
      console.log(
        'Running Telegram scheduled job at:',
        new Date().toISOString()
      );
      const result = await sendNextVideoToTelegram();
      console.log('Telegram cron result:', result);
    } catch (error) {
      console.error('Telegram cron failed:', error);
    } finally {
      isTelegramJobRunning = false;
    }
  });
}

export function stopTelegramCron() {
  telegramCronTask?.stop();
  telegramCronTask = null;
  isTelegramCronStarted = false;
}
