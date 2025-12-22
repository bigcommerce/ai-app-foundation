import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '~/env.mjs';
import * as db from '~/lib/db';

const queryParamSchema = z.object({
  signed_payload_jwt: z.string(),
});

const jwtSchema = z.object({
  aud: z.string(),
  iss: z.string(),
  iat: z.number(),
  nbf: z.number(),
  exp: z.number(),
  jti: z.string(),
  sub: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    locale: z.string(),
  }),
  owner: z.object({
    id: z.number(),
    email: z.string().email(),
  }),
  url: z.string(),
  channel_id: z.number().nullable(),
});

/**
 * BigCommerce can provide a URL where `product_name` contains a raw `#` (e.g. "Widget #2").
 * A raw `#` is interpreted as a fragment delimiter in URLs, truncating the query param value.
 * We pre-encode `#` inside `product_name` so Next can receive the full value.
 */
function encodeUnsafeHashInQueryParam(path: string, paramName: string): string {
  const key = `${paramName}=`;
  const keyIdx = path.indexOf(key);
  if (keyIdx === -1) return path;

  const valueStart = keyIdx + key.length;
  const valueEnd = path.indexOf('&', valueStart);
  const endIdx = valueEnd === -1 ? path.length : valueEnd;

  const before = path.slice(0, valueStart);
  const value = path.slice(valueStart, endIdx);
  const after = path.slice(endIdx);

  // Only encode raw '#'. Leave existing '%23' alone.
  const safeValue = value.includes('#') ? value.replaceAll('#', '%23') : value;
  return `${before}${safeValue}${after}`;
}

export async function GET(request: NextRequest) {
  const parsedParams = queryParamSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  if (!parsedParams.success) {
    return new NextResponse('Invalid query parameters', { status: 400 });
  }

  const decoded = jwt.verify(
    parsedParams.data.signed_payload_jwt,
    env.CLIENT_SECRET
  );

  const parsedJwt = jwtSchema.safeParse(decoded);

  if (!parsedJwt.success) {
    return new NextResponse('JWT properties invalid', { status: 500 });
  }

  const { sub, url: path, user } = parsedJwt.data;

  const storeHash = sub.split('/')[1];

  const clientToken = jwt.sign({ storeHash, storeUser: user.id }, env.JWT_KEY, {
    expiresIn: 3600,
  });

  const exchangeToken = await db.saveClientToken(clientToken);
  const safePath = encodeUnsafeHashInQueryParam(
    encodeUnsafeHashInQueryParam(path, 'product_name'),
    'productName'
  );
  const redirectUrl = new URL(safePath, env.APP_ORIGIN);
  redirectUrl.searchParams.set('exchangeToken', exchangeToken);

  return NextResponse.redirect(redirectUrl, {
    status: 302,
    statusText: 'Found',
  });
}
