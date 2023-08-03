import jwt from 'jsonwebtoken';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '~/env.mjs';
import * as db from 'lib/db';

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

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
    const parsedParams = queryParamSchema.safeParse(Object.fromEntries(searchParams));

    if (!parsedParams.success) {
        return new NextResponse('Invalid query parameters', { status: 400 });
    }

    const decoded = jwt.verify(parsedParams.data.signed_payload_jwt, env.BC_CLIENT_SECRET);

    const parsedJwt = jwtSchema.safeParse(decoded);

    if (!parsedJwt.success) {
        return new NextResponse('Invalid JWT', { status: 500 });
    }

    const storeHash = parsedJwt.data.sub.split('/')[1];

    await db.deleteStore(storeHash);
    await db.deleteUser(storeHash, parsedJwt.data.user);

    return new NextResponse(null, { status: 200 });
}
