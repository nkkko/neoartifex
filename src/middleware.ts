import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Hide test routes in production
  if (process.env.NODE_ENV === 'production' && 
      (pathname.startsWith('/test-kv') || pathname.startsWith('/test-ratings'))) {
    // Redirect to home page or return 404
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Match all test paths
    '/test-kv/:path*',
    '/test-ratings/:path*',
  ],
};