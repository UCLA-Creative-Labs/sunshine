import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    // Protect all /portal routes
    if (pathname.startsWith('/portal')) {
        try {
            const supabase = createMiddlewareClient(request, response);
            
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch (error) {
            console.error('Middleware auth error:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/portal/:path*',
    ],
};