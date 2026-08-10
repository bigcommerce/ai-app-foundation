
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createCsrfMiddleware } from '@csrf-armor/nextjs';
import { env } from '~/env.mjs';

const csrfProtect = createCsrfMiddleware({
  strategy: 'signed-double-submit',
  secret: env.CSRF_SECRET,
  cookie: {
    // SameSite=None is required for the control panel iframe, and browsers only
    // honor it alongside Secure. Keep both hardcoded: flipping Secure per
    // environment silently drops the cookies in every browser.
    secure: true,
    sameSite: 'none',
  },
});

export async function middleware(request: NextRequest) {
    const cspHeader = `
        frame-ancestors https://*.mybigcommerce.com
        https://*.my-integration.zone
        https://*.my-staging.zone
    `;
    const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();
  
    const requestHeaders = new Headers(request.headers);
 
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    );
    
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    const result = await csrfProtect(request, response);

    if (!result.success) {
      return new NextResponse('invalid csrf token', { status: 403 });
    }

    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    );
    
    return response
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
        '/api/generateDescription',
    ],
}
