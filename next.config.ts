import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.93',
    '192.168.1.11',
    'motivate-slideshow-gorged.ngrok-free.dev',
  ],
};

export default nextConfig;
