import { getGraphUrl, getInstagramAccessToken } from './client';

export async function getInstagramPermalink(mediaId: string) {
  const accessToken = getInstagramAccessToken();

  const url = new URL(getGraphUrl(mediaId));
  url.searchParams.set('fields', 'permalink');
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error getting permalink: ${JSON.stringify(data)}`);
  }

  return data.permalink as string;
}
