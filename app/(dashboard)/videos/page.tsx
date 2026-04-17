'use client';

import { videoSchema } from '@/lib/shared/video/schema';
import { Video } from '@/lib/shared/video/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import z from 'zod';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  const handleDelete = (id: string) => {
    deleteVideo(id).then((video) => {
      console.log(`Deleted video: ${JSON.stringify(video)}`);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    });
  };

  async function deleteVideoFromServer(id: string) {}

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

  useEffect(() => {
    async function getVideos() {
      const response = await fetch('/api/video');
      const data = await response.json();
      setVideos(data);
    }

    getVideos();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Facebook Videos Page</h1>
        <Link
          href="/video/"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Video
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex h-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative h-full w-32 shrink-0">
              <Image
                src="/plane.png"
                alt="plane"
                fill
                className="object-cover"
                loading="eager"
                sizes="128px"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-3">
              <div className="min-w-0">
                <h2 className="mb-1 line-clamp-1 text-sm font-semibold">
                  {video.title}
                </h2>
                <p className="line-clamp-2 text-xs text-gray-600">
                  {video.description}
                </p>
              </div>

              <div className="flex gap-4 pt-3 text-sm">
                <button
                  type="button"
                  onClick={() => handleEdit(video.id)}
                  className="text-gray-600 hover:text-black"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(video.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
