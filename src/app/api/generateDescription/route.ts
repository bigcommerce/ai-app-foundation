import { type NextRequest, NextResponse } from 'next/server';
import generateDescription from '~/server/google-ai';
import { aiSchema } from './schema';
import { authorize } from '~/lib/authorize';

export async function POST(req: NextRequest) {
  const authToken = req.headers.get('X-Auth-Token') || 'missing';

  if (!authorize(authToken)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data: unknown = await req.json();
  const parsedParams = aiSchema.safeParse(data);

  if (!parsedParams.success) {
    return new NextResponse('Invalid query parameters', { status: 400 });
  }

  const description = await generateDescription(parsedParams.data);

  return NextResponse.json({ description });
}
