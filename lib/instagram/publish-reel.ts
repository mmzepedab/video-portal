import {
  getGraphUrl,
  getInstagramAccessToken,
  getInstagramUserId,
} from './client';

export async function publishReel(creationId: string) {
  const instagramUserId = getInstagramUserId();
  const accessToken = getInstagramAccessToken();

  const response = await fetch(
    getGraphUrl(`${instagramUserId}/media_publish`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error publishing reel: ${JSON.stringify(data)}`);
  }

  return data.id as string;
}
