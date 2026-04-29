const GRAPH_API_VERSION = 'v25.0';

export function getInstagramAccessToken() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    throw new Error('Missing INSTAGRAM_ACCESS_TOKEN');
  }

  return token;
}

export function getInstagramUserId() {
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!userId) {
    throw new Error('Missing INSTAGRAM_USER_ID');
  }

  return userId;
}

export function getGraphUrl(path: string) {
  return `https://graph.facebook.com/${GRAPH_API_VERSION}/${path}`;
}
