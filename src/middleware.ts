import csrf from 'edge-csrf';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const csrfProtect = csrf({
    cookie: {
        sameSite: 'none',
    }
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

    const csrfError = await csrfProtect(request, response);

    if (csrfError) {
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
