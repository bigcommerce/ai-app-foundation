import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '~/env.mjs';

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

export function GET(request: NextRequest) {
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

  return NextResponse.redirect(new URL(`${path}&authToken=${clientToken}`, env.APP_ORIGIN), {
    status: 302,
    statusText: 'Found',
  });
}
