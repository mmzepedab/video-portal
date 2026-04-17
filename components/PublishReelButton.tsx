'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type PublishReelButtonProps = {
  uploadId: string;
};

export default function PublishReelButton({
  uploadId,
}: PublishReelButtonProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);

    try {
      const response = await fetch(`/api/reels/publish/${uploadId}`, {
        method: 'POST',
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Publish failed');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Publish failed');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={isPublishing}
      className="rounded-md border px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-50"
    >
      {isPublishing ? 'Publishing...' : 'Publish Reel'}
    </button>
  );
}
