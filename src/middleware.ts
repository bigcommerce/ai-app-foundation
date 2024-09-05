import csrf from 'edge-csrf';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const csrfProtect = csrf({
    cookie: {
        sameSite: 'none',
    }
});

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const csrfError = await csrfProtect(request, response);

    if (csrfError) {
        return new NextResponse('invalid csrf token', { status: 403 });
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        frame-ancestors: 'https://store-*.mybigcommerce.com' 'https://store-*.my-integration.zone' 'https://store-*.my-staging.zone';
    `;
    const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
   
    requestHeaders.set(
      'Content-Security-Policy',
      contentSecurityPolicyHeaderValue
    )
   
    const newResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    newResponse.headers.set(
      'Content-Security-Policy',
      contentSecurityPolicyHeaderValue
    )
   
    return newResponse
}

export const config = {
    matcher: ['/productDescription/:productId*', '/api/generateDescription'],
}
