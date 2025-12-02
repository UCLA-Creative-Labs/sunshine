'use client';

import { Mulish } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mulish = Mulish({ weight: ['400', '700'], subsets: ['latin'] });

interface SidebarLink {
  name: string;
  href: string;
}

const sidebarLinks: SidebarLink[] = [
  { name: 'Overview', href: '/portal' },
  { name: 'My Project', href: '/portal/projects' },
  { name: 'Directory', href: '/portal/directory' },
  { name: 'Profile', href: '/portal/profile' },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className={`sticky top-24 self-start h-[calc(100vh-6rem)] w-64 bg-white border-r border-black p-8 text-black overflow-y-auto ${mulish.className}`}>
      <div className="mb-12">
        <h2 className="text-lg font-bold tracking-wide text-black">Member Portal</h2>
      </div>

      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg transition-colors text-black ${
                isActive
                  ? 'bg-[#85b6ff] font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
