'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [tokenExpirationDaysLeft, setTokenExpirationDaysLeft] = useState<
    number | null
  >(null);

  const [cloudfareSpaceUsed, setCloudfareSpaceUsed] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getInstagramTokenExpirationDate = async () => {
      try {
        const response = await fetch('/api/instagram/token');

        if (!response.ok) {
          throw new Error('Error fetching instagram token');
        }

        const data = await response.json();

        const tokenDate = new Date(data.expiration_date).getTime();
        const today = Date.now();

        const diffTime = tokenDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setTokenExpirationDaysLeft(diffDays);
      } catch (error) {
        console.error('Error fetching token expiration: ', error);
      }
    };

    const getCloudfareR2UsedSpace = async () => {
      try {
        const response = await fetch('/api/r2/usage');

        if (!response.ok) {
          throw new Error('Error fetching R2 usage endpoint');
        }

        const data = await response.json();

        setCloudfareSpaceUsed(data.usedGb);
      } catch (error) {
        console.error('Error fetching cloudfare data', error);
      }
    };

    Promise.all([getInstagramTokenExpirationDate(), getCloudfareR2UsedSpace()])
      .then((values) => {
        console.log(values);
      })
      .catch((error) => console.error('Failed to get dashboard data', error));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your video uploads from Google Drive to Facebook
          </p>
        </div>

        <Link
          href="/uploads/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New Upload
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Instagram Token Expiration</p>
          <p className="mt-2 text-lg font-semibold">
            {tokenExpirationDaysLeft} days left
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Cloudfare space used</p>
          <p className="mt-2 text-lg font-semibold">{cloudfareSpaceUsed}gb</p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Successful Uploads</p>
          <p className="mt-2 text-lg font-semibold">100 uploads</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Recent Activity</h2>

        <div className="mt-4 rounded-lg border bg-white">
          <div className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">airport-video.mp4</p>
                <p className="text-xs text-gray-500">Uploaded successfully</p>
              </div>
              <span className="text-xs text-green-600">Success</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">promo-video.mp4</p>
                <p className="text-xs text-gray-500">Upload failed</p>
              </div>
              <span className="text-xs text-red-600">Failed</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">travel-reel.mp4</p>
                <p className="text-xs text-gray-500">Processing</p>
              </div>
              <span className="text-xs text-yellow-600">Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
