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
 * BigCommerce can provide a URL where `product_name` contains raw reserved characters
 * (e.g. "Widget #2", "AT&T", "plus+sign"). These can be interpreted as URL delimiters
 * (`#` fragment, `&` query separator, `+` becomes space in x-www-form-urlencoded parsing),
 * truncating or mutating the query param value.
 *
 * We sanitize the value in-place so Next can receive the full name.
 */
function sanitizeQueryParamValue(value: string): string {
  // Preserve valid percent-escapes, but encode stray '%' to avoid confusing URL parsing.
  const withSafePercents = value.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');

  // Encode characters that commonly break query parsing or semantics.
  return withSafePercents
    .replaceAll('+', '%2B') // URLSearchParams treats '+' as space
    .replaceAll('#', '%23') // fragment delimiter
    .replaceAll('&', '%26') // query separator
    .replaceAll(' ', '%20'); // avoid raw spaces
}

function sanitizeQueryParamValueInPath(path: string, paramName: string): string {
  const key = `${paramName}=`;
  const keyIdx = path.indexOf(key);
  if (keyIdx === -1) return path;

  const valueStart = keyIdx + key.length;
  // Find the next *likely* query param delimiter: `&<key>=`.
  // This lets us keep unencoded `&` inside values like "AT&T".
  const remainder = path.slice(valueStart);
  const delimiterMatch = remainder.match(/&[A-Za-z0-9_.~-]+=/);
  const endIdx =
    delimiterMatch && typeof delimiterMatch.index === 'number'
      ? valueStart + delimiterMatch.index
      : path.length;

  const before = path.slice(0, valueStart);
  const value = path.slice(valueStart, endIdx);
  const after = path.slice(endIdx);

  return `${before}${sanitizeQueryParamValue(value)}${after}`;
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
  const safePath = sanitizeQueryParamValueInPath(
    sanitizeQueryParamValueInPath(path, 'product_name'),
    'productName'
  );
  const redirectUrl = new URL(safePath, env.APP_ORIGIN);
  redirectUrl.searchParams.set('exchangeToken', exchangeToken);

  return NextResponse.redirect(redirectUrl, {
    status: 302,
    statusText: 'Found',
  });
}
