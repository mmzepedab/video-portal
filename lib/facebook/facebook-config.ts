export default function getFacebookConfig() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !pageAccessToken) {
    throw new Error('Facebook environment variables are missing');
  }

  return {
    pageId,
    pageAccessToken,
  };
}
