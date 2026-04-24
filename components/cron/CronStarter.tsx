'use client';

import { useEffect } from 'react';

export default function CronStarter() {
  useEffect(() => {
    fetch('/api/cron/start').catch((error) => {
      console.error('Failed to start cron:', error);
    });
  }, []);

  return null;
}
