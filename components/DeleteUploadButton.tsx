'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteUploadButtonProps = {
  uploadId: string;
};

export default function DeleteUploadButton({
  uploadId,
}: DeleteUploadButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this upload?'
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/uploads/${uploadId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      // 🔥 refresh server data
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
