'use client';

import { videoSchema } from '@/lib/shared/video/schema';
import { VideoInput } from '@/lib/shared/video/types';
import { useState } from 'react';

type VideoFormProps = {
  onSuccess?: () => void;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

export default function VideoForm({ onSuccess }: VideoFormProps) {
  const initialForm: VideoInput = { title: '', description: '' };

  const [form, setForm] = useState<VideoInput>(initialForm);
  const [file, setFile] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createVideo = async () => {
    try {
      setErrorMessage(null);

      if (!file) {
        throw new Error('File is required');
      }

      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        throw new Error('Only MP4 and MOV files are allowed');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File must be 50 MB or smaller');
      }

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('file', file);

      const response = await fetch('/api/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Couldn't get response from server");
      }

      const data = await response.json();
      const parsedVideo = videoSchema.parse(data);

      setForm(initialForm);
      setFile(null);
      onSuccess?.();

      return parsedVideo;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';

      console.error('Create video failed:', error);
      setErrorMessage(message);
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded-md">
      <h1 className="text-lg font-semibold mb-4 text-black">Create Video</h1>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="video-title" className="text-sm mb-1 text-gray-700">
            Titulo
          </label>
          <input
            id="video-title"
            value={form.title}
            onChange={(e) =>
              setForm((prev: VideoInput) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="bg-white text-black border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="video-description"
            className="text-sm mb-1 text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="video-description"
            value={form.description}
            onChange={(e) =>
              setForm((prev: VideoInput) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            className="bg-white text-black border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="video-file" className="text-sm mb-1 text-gray-700">
            Video File
          </label>
          <input
            id="video-file"
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />

          {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="button"
          onClick={createVideo}
          disabled={!form.title || !form.description || !file}
          className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Create
        </button>
      </div>
    </div>
  );
}
