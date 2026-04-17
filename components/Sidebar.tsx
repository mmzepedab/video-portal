import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/uploads/new', label: 'New Upload' },
  { href: '/uploads/history', label: 'Upload History' },
  { href: '/settings', label: 'Settings' },
  { href: '/pokemon', label: 'Pokemon' },
  { href: '/videos', label: 'Videos' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Video Portal</h2>
        <p className="text-sm text-gray-500">Google Drive to Facebook</p>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
