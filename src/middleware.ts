import { createCsrfMiddleware, type CsrfProtectResult } from '@csrf-armor/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type CsrfMiddleware = ReturnType<typeof createCsrfMiddleware>;

let csrfProtect: CsrfMiddleware | undefined;

function getCsrfProtect(): CsrfMiddleware {
  if (csrfProtect) {
    return csrfProtect;
  }

  const secret = process.env.CSRF_SECRET;

  if (!secret) {
    throw new Error('CSRF_SECRET environment variable is required');
  }

  csrfProtect = createCsrfMiddleware({
    strategy: 'signed-token',
    secret,
    token: {
      headerName: 'X-CSRF-Token',
    },
    cookie: {
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    },
  });

  return csrfProtect;
}

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

  let result: CsrfProtectResult;

  try {
    result = await getCsrfProtect()(request, response);
  } catch (error) {
    console.error('CSRF middleware configuration error:', error);

    return new NextResponse('csrf middleware misconfigured', { status: 500 });
  }

  if (!result.success) {
    console.warn('CSRF validation failed:', result.reason, request.nextUrl.pathname);

    return new NextResponse('invalid csrf token', { status: 403 });
  }

  if (result.token) {
    requestHeaders.set('X-CSRF-Token', result.token);
    response.headers.set('X-CSRF-Token', result.token);
  }

  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  for (const cookie of response.cookies.getAll()) {
    finalResponse.cookies.set(cookie);
  }

  response.headers.forEach((value, key) => {
    finalResponse.headers.set(key, value);
  });

  finalResponse.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return finalResponse;
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
};
