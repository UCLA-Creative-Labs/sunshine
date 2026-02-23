// Middleware for route protection
// This runs before requests are completed

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /portal routes
    if (pathname.startsWith('/portal')) {
        // TODO: Check authentication
        // const session = await getServerSession()
        // if (!session) {
        //   return NextResponse.redirect(new URL('/login', request.url))
        // }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/portal/:path*',
        // Add other protected routes here
    ],
};
