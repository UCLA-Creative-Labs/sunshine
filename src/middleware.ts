// Middleware for route protection
// This runs before requests are completed

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect /portal to /login
    if (pathname === '/portal') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Protect all /portal routes
    if (pathname.startsWith('/portal')) {
        const token = request.cookies.get('sb-access-token')?.value ||
                     request.cookies.get('supabase-auth-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/portal/:path*',
    ],
};