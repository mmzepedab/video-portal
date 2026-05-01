import { NextResponse } from 'next/server';

type CloudflareR2StorageResponse = {
  data?: {
    viewer?: {
      accounts?: {
        r2StorageAdaptiveGroups?: {
          max: {
            objectCount: number;
            uploadCount: number;
            payloadSize: number;
            metadataSize: number;
          };
          dimensions: {
            datetime: string;
          };
        }[];
      }[];
    };
  };
  errors?: {
    message: string;
  }[];
};

const bytesToGb = (bytes: number) =>
  Number((bytes / 1024 / 1024 / 1024).toFixed(2));

export async function GET() {
  const accountId = process.env.CLOUDFARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const bucketName = process.env.R2_BUCKET_NAME;
  const freeTierBytes = Number(process.env.R2_FREE_TIER_BYTES ?? 10737418240);

  if (!accountId || !apiToken || !bucketName) {
    return NextResponse.json(
      { error: 'Missing cloudfare environment variables' },
      { status: 500 }
    );
  }

  const endDate = new Date();

  const startDate = new Date();

  startDate.setDate(endDate.getDate() - 1);

  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${apiToken}`,

      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
        query R2StorageUsage(
          $accountTag: string!
          $startDate: Time
          $endDate: Time
          $bucketName: string
        ) {
          viewer {
            accounts(filter: { accountTag: $accountTag }) {
              r2StorageAdaptiveGroups(
                limit: 10000
                filter: {
                  datetime_geq: $startDate
                  datetime_leq: $endDate
                  bucketName: $bucketName
                }
                orderBy: [datetime_DESC]
              ) {
                max {
                  objectCount
                  uploadCount
                  payloadSize
                  metadataSize
                }
                dimensions {
                  datetime
                }
              }
            }
          }
        }
      `,
      variables: {
        accountTag: accountId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        bucketName,
      },
    }),
  });

  const data = (await response.json()) as CloudflareR2StorageResponse;

  if (!response.ok || data.errors?.length) {
    return NextResponse.json(
      {
        error: 'Unable to fetch R2 usage',
        details: data.errors,
      },
      { status: 500 }
    );
  }

  const latest = data.data?.viewer?.accounts?.[0]?.r2StorageAdaptiveGroups?.[0];

  if (!latest) {
    return NextResponse.json({
      bucketName,
      usedBytes: 0,
      usedGb: 0,
      freeTierGb: bytesToGb(freeTierBytes),
      remainingBytes: freeTierBytes,
      remainingGb: bytesToGb(freeTierBytes),
      objectCount: 0,
      uploadCount: 0,
      lastUpdatedAt: null,
    });
  }

  const usedBytes = latest.max.payloadSize + latest.max.metadataSize;

  const remainingBytes = Math.max(freeTierBytes - usedBytes, 0);

  return NextResponse.json({
    bucketName,
    usedBytes,
    usedGb: bytesToGb(usedBytes),
    freeTierGb: bytesToGb(freeTierBytes),
    remainingBytes,
    remainingGb: bytesToGb(remainingBytes),
    objectCount: latest.max.objectCount,
    uploadCount: latest.max.uploadCount,
    lastUpdatedAt: latest.dimensions.datetime,
  });
}
