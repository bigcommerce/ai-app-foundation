import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env.mjs';
import { runModelLifecycleChecks } from '~/server/model-lifecycle';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await runModelLifecycleChecks();

  return NextResponse.json({ ok: true });
}
