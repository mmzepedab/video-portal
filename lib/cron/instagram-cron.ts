import cron, { ScheduledTask } from 'node-cron';
import { publishNextVideoToInstagram } from '../instagram/publish-next-video-to-instagram';

let isInstagramCronStarted = false;
let instagramCronTask: ScheduledTask | null = null;
let isInstagramJobRunning = false;

export function startInstagramCron() {
  if (isInstagramCronStarted) {
    console.log('Instagram cron already started');
    return;
  }

  isInstagramCronStarted = true;

  console.log('Starting Instagram cron job...');

  instagramCronTask = cron.schedule('0 13,14,15 * * *', async () => {
    if (isInstagramJobRunning) {
      console.log(
        'Instagram job skipped because previous run is still in progress'
      );
      return;
    }

    isInstagramJobRunning = true;

    try {
      console.log(
        'Running Instagram scheduled job at:',
        new Date().toISOString()
      );

      const result = await publishNextVideoToInstagram();

      console.log('Instagram cron result:', result);
    } catch (error) {
      console.error('Instagram cron failed:', error);
    } finally {
      isInstagramJobRunning = false;
    }
  });
}

export function stopInstagramCron() {
  instagramCronTask?.stop();
  instagramCronTask = null;
  isInstagramCronStarted = false;
}
