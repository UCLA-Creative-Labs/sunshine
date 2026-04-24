'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const SCROLLY_POINT = 150;

export default function PortalNavbar() {
    const [pastScrollPoint, setPastScrollPoint] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                setPastScrollPoint(window.scrollY > SCROLLY_POINT);
            }
        };

        // Set initial state after mount
        handleScroll();

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const portalPages = [
        { name: 'DASHBOARD', href: '/portal' },
        { name: 'MY PROJECT', href: '/portal/projects' },
        { name: 'PROFILE', href: '/portal/profile' },
        { name: 'DIRECTORY', href: '/portal/directory' },
    ];

    return (
        <div
            id="navbar"
            className={`transition z-50 ease-in-out delay-100 flex justify-between w-full p-8 lg:px-20 dark:bg-[#000000] fixed top-0 left-0 ${
                pastScrollPoint ? 'bg-[#000000] text-white' : 'bg-[#85b6ff]'
            }`}
            style={{}}
        >
            <div
                id="title"
                className="flex justify-center md:justify-between items-center min-w-full md:min-w-0"
            >
                <Link
                    href="/portal"
                    className="text-xl tracking-widest font-black font-[family-name:var(--font-lato)]"
                >
                    PORTAL
                </Link>
            </div>
            <nav
                id="navigation"
                className="hidden md:flex divide-x-2 divide-black dark:divide-white items-center [&>div]:pl-6 space-x-6"
            >
                <div id="links" className="flex space-x-6 lg:text-xl">
                    {portalPages.map((page) => {
                        const isActive = pathname === page.href;
                        return (
                            <Link
                                key={page.href}
                                href={page.href}
                                className={
                                    isActive
                                        ? 'font-bold underline'
                                        : 'hover:underline'
                                }
                            >
                                {page.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
