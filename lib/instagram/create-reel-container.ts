import {
  getGraphUrl,
  getInstagramAccessToken,
  getInstagramUserId,
} from './client';

type CreateReelContainerParams = {
  videoUrl: string;
  caption: string;
};

export async function createReelContainer({
  videoUrl,
  caption,
}: CreateReelContainerParams) {
  const instagramUserId = getInstagramUserId();
  const accessToken = getInstagramAccessToken();

  const response = await fetch(getGraphUrl(`${instagramUserId}/media`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
      access_token: accessToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error creating reel container: ${JSON.stringify(data)}`);
  }

  return data.id as string;
}
