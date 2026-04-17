'use client';

import { videoSchema } from '@/lib/shared/video/schema';
import { VideoInput } from '@/lib/shared/video/types';
import { useState } from 'react';

type VideoFormProps = {
  onSuccess?: () => void;
};

export default function VideoForm({ onSuccess }: VideoFormProps) {
  const initialForm: VideoInput = { title: '', description: '' };

  const [form, setForm] = useState<VideoInput>(initialForm);

  const createVideo = async () => {
    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'applicaiton/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Couldn't get response from server");
      }

      const data = await response.json();
      const parsedVideo = videoSchema.parse(data);

      setForm(initialForm);
      return parsedVideo;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  };

  return (
    <div>
      <h1>Video Form</h1>
      <label htmlFor="video-title">Titulo</label>
      <input
        id="video-title"
        value={form.title}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, title: e.target.value }));
        }}
      />

      <label htmlFor="video-description">Descripción</label>
      <input
        id="video-description"
        value={form.description}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, description: e.target.value }));
        }}
      />
      <button
        type="button"
        onClick={() => createVideo()}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Create
      </button>
    </div>
  );
}
