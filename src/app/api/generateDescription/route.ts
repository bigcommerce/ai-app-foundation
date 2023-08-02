import { type NextRequest, NextResponse } from 'next/server';
import generateDescription from '~/server/google-ai';
import { aiSchema } from './schema';

export async function POST(req: NextRequest) {
    const data: unknown = await req.json();
    const parsedParams = aiSchema.safeParse(data);

    if (!parsedParams.success) {
        return new NextResponse('Invalid query parameters', { status: 400 });
    }

    const description = await generateDescription(parsedParams.data);

    return NextResponse.json({ description });
}
