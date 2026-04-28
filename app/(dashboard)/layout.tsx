import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-gray-900">
      <div className="flex min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
