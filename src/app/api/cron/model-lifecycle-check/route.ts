import { type NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { env } from '~/env.mjs';
import { runModelLifecycleChecks } from '~/server/model-lifecycle';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await runModelLifecycleChecks();

  // Serverless functions can freeze right after the response is sent, before
  // Sentry's queued events reach the network. Flush explicitly to guarantee delivery.
  await Sentry.flush(2000);

  return NextResponse.json({ ok: true });
}
