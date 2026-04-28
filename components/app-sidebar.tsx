import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/uploads/new', label: 'New Upload' },
  { href: '/uploads/history', label: 'Upload History' },
  { href: '/settings', label: 'Settings' },
  { href: '/pokemon', label: 'Pokemon' },
  { href: '/videos', label: 'Videos' },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2">
          <h2 className="text-lg font-bold">Video Portal</h2>
          <p className="text-xs text-muted-foreground">
            Google Drive to Facebook
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <nav className="flex flex-col gap-1 px-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
