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
        frame-ancestors: 'https://store-*.mybigcommerce.com' 
        'https://store-*.my-integration.zone' 
        'https://store-*.my-staging.zone';
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