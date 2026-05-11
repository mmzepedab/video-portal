'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Upload } from 'lucide-react';

type UploadVideoButtonProps = {
  videoTitle: string;
  onConfirm: () => void | Promise<void>;
};

export default function UploadVideoButton({
  videoTitle,
  onConfirm,
}: UploadVideoButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="hover:text-black" title="Subir">
          <Upload size={18} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload this video?</AlertDialogTitle>

          <AlertDialogDescription>
            {`This will upload "${videoTitle}" to Instagram.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            Confirm upload
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
