import DeleteUploadButton from '@/components/DeleteUploadButton';
import PublishReelButton from '@/components/PublishReelButton';
import { prisma } from '@/lib/prisma';

export default async function UploadHistoryPage() {
  const uploads = await prisma.upload.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Upload History</h1>

      <div className="mt-6 rounded-lg border bg-white">
        <div className="divide-y">
          {uploads.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No uploads yet</p>
          )}

          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-start justify-between gap-6 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {upload.title}
                </p>

                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {upload.description}
                </p>

                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    File: {upload.originalFileName}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(upload.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`text-xs ${
                    upload.publishStatus === 'published'
                      ? 'text-green-600'
                      : upload.publishStatus === 'failed'
                        ? 'text-red-600'
                        : upload.publishStatus === 'publishing'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                  }`}
                >
                  {upload.publishStatus}
                </span>

                {upload.publishStatus !== 'published' && (
                  <PublishReelButton uploadId={upload.id} />
                )}

                <DeleteUploadButton uploadId={upload.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
