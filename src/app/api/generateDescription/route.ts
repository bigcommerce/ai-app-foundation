import { type NextRequest, NextResponse } from 'next/server';
import generateDescription from '~/server/google-ai';
import { aiSchema } from './schema';
import { authorize } from '~/lib/authorize';
import { enforceRateLimit } from '~/lib/rate-limit';

const RATE_LIMIT_KEY = 'generateDescription';
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  const authToken = req.headers.get('X-Auth-Token') || 'missing';

  if (!authorize(authToken)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const clientIdentifier =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
  const rateLimit = await enforceRateLimit(
    `${RATE_LIMIT_KEY}:${clientIdentifier}`,
    { windowMs: RATE_LIMIT_WINDOW_MS, maxRequests: RATE_LIMIT_MAX_REQUESTS }
  );

  if (!rateLimit.allowed) {
    const retryAfter = Math.max(0, Math.ceil((rateLimit.reset - Date.now()) / 1000));

    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.reset.toString(),
      },
    });
  }

  const data: unknown = await req.json();
  const parsedParams = aiSchema.safeParse(data);

  if (!parsedParams.success) {
    return new NextResponse('Invalid query parameters', { status: 400 });
  }

  const description = await generateDescription(parsedParams.data);

  const response = NextResponse.json({ description });

  response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.reset.toString());

  return response;
}
