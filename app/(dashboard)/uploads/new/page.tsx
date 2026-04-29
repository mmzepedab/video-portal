'use client';

import { useState } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', selectedFile);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setStatus('success');
      setMessage('Upload completed successfully');

      // reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  return (
    <main className="max-w-2xl">
      <h1 className="text-2xl font-bold">New Upload</h1>
      <p className="mt-1 text-sm text-gray-600">
        Upload a local video and prepare it for Facebook
      </p>

      <div className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-md border p-2"
            placeholder="Enter title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-md border p-2"
            rows={4}
            placeholder="Enter description"
          />
        </div>

        {/* File */}
        <div>
          <label className="block text-sm font-medium">Video File</label>
          <input
            key={selectedFile ? selectedFile.name : 'empty'}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm"
          />

          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Button */}
        <div>
          <button
            onClick={handleUpload}
            disabled={
              !title || !description || !selectedFile || status === 'uploading'
            }
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {status === 'uploading' ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>

        {/* Status */}
        {status === 'uploading' && (
          <p className="text-sm text-gray-600">Uploading...</p>
        )}

        {status === 'success' && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-600">{message}</p>
        )}
      </div>
    </main>
  );
}
