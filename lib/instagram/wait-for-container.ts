import { getGraphUrl, getInstagramAccessToken } from './client';

type ContainerStatus = {
  status_code: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
  status?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getContainerStatus(
  creationId: string
): Promise<ContainerStatus> {
  const accessToken = getInstagramAccessToken();

  const url = new URL(getGraphUrl(creationId));
  url.searchParams.set('fields', 'status_code,status');
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error checking container status: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function waitForContainer(creationId: string) {
  const maxAttempts = 12;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await getContainerStatus(creationId);

    console.log(`Instagram container status:`, status);

    if (status.status_code === 'FINISHED') {
      return;
    }

    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') {
      throw new Error(`Instagram container failed: ${JSON.stringify(status)}`);
    }

    await sleep(5000);
  }

  throw new Error('Instagram container was not ready after waiting');
}
