'use client';

import { videoSchema } from '@/lib/shared/video/schema';
import { Video } from '@/lib/shared/video/types';
import CreateVideoDialog from '@/components/video/CreateVideoDialog';
import { useEffect, useState } from 'react';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import VideoFilters from '@/components/video/VideoFilters';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const searchParams = useSearchParams();

  const getVideos = async () => {
    const response = await fetch(`/api/video?${searchParams.toString()}`);
    const data = await response.json();
    const parsedVideos = videoSchema.array().parse(data);
    setVideos(parsedVideos);
  };

  const handleDelete = (id: string) => {
    deleteVideo(id).then((video) => {
      console.log(`Deleted video: ${JSON.stringify(video)}`);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    });
  };

  const deleteVideo = async (id: string): Promise<Video> => {
    const response = await fetch(`/api/video/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Error deleting video');
    }

    const data = await response.json();
    const video = videoSchema.parse(data);
    return video;
  };

  const handleEdit = (id: string) => {
    console.log(`Handle edit id ${id}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    getVideos();
  }, [searchParams]);

  const updateLastUsedAtDate = async (id: string) => {
    const response = await fetch(`/api/video/${id}/last-used`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to update lastUsedAt');
    }
    await getVideos();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Facebook Videos Page</h1>
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
                    className="line-clamp-1 text-sm font-semibold cursor-pointer hover:text-gray-600"
                    onClick={() => copyToClipboard(video.title)}
                    title="Copiar título"
                  >
                    {video.title}
                  </h2>

                  <div className="h-px bg-gray-200" />

                  <p
                    className="line-clamp-4 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
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
                  <a
                    href={video.videoUrl}
                    download
                    className="hover:text-black"
                    title="Descargar"
                    onClick={async () => {
                      await updateLastUsedAtDate(video.id);
                    }}
                  >
                    <Download size={18} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleEdit(video.id)}
                    className="hover:text-black"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>

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
