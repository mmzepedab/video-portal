'use client';

import CreateVideoDialog from '@/components/video/CreateVideoDialog';
import UploadVideoButton from '@/components/video/UploadVideoButton';
import VideoFilters from '@/components/video/VideoFilters';
import { videoSchema } from '@/lib/shared/video/schema';
import { Video } from '@/lib/shared/video/types';
import { Trash2 } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function VideosPageContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const searchParams = useSearchParams();

  const getVideos = async () => {
    const response = await fetch(`/api/videos?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error('Error loading videos');
    }

    const data = await response.json();
    const parsedVideos = videoSchema.array().parse(data);

    setVideos(parsedVideos);
  };

  const deleteVideo = async (id: string): Promise<void> => {
    const response = await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting video');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoUpload = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}/publish/instagram`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error uploading video');
      }

      await getVideos();
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    getVideos().catch(console.error);
  }, [searchParams]);

  return (
    <div className="p-0">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Videos Page</h1>
        <CreateVideoDialog onCreated={getVideos} />
      </div>

      <div className="space-y-4">
        <VideoFilters />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-full w-32 shrink-0">
                <video
                  src={video.videoUrl}
                  className="h-full w-full object-cover"
                  preload="metadata"
                  muted
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-3">
                <div className="min-w-0 flex flex-col gap-2">
                  <h2
                    className="line-clamp-1 cursor-pointer text-sm font-semibold hover:text-gray-600"
                    onClick={() => copyToClipboard(video.title)}
                    title="Copiar título"
                  >
                    {video.title}
                  </h2>

                  <div className="h-px bg-gray-200" />

                  <p
                    className="line-clamp-4 cursor-pointer text-xs text-gray-600 hover:text-gray-800"
                    onClick={() => copyToClipboard(video.description)}
                    title="Copiar descripción"
                  >
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-4 pt-2 text-gray-600">
                  <p className="text-xs text-gray-500">
                    Last used:{' '}
                    {video.lastUsedAt
                      ? new Date(video.lastUsedAt).toLocaleString()
                      : 'Never'}
                  </p>

                  <UploadVideoButton
                    videoTitle={video.title}
                    onConfirm={() => handleVideoUpload(video.id)}
                  />

                  <button
                    type="button"
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideosPageContent />
    </Suspense>
  );
}
