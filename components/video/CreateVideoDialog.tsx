'use client';

import { useState } from 'react';
import VideoForm from '@/components/video/VideoForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type CreateVideoDialogProps = {
  onCreated: () => void | Promise<void>;
};

export default function CreateVideoDialog({
  onCreated,
}: CreateVideoDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Create Video
        </button>
      </DialogTrigger>

      <DialogContent className="bg-background text-foreground p-6">
        <DialogHeader>
          <DialogTitle>Create Video</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new video.
          </DialogDescription>
        </DialogHeader>

        <VideoForm
          onSuccess={async () => {
            await onCreated();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
