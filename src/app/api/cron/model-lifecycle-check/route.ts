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

  try {
    await runModelLifecycleChecks();
  } catch (err) {
    Sentry.captureException(err);
    await Sentry.flush(2000);
    return new NextResponse('Internal Error', { status: 500 });
  }

  await Sentry.flush(2000);

  return NextResponse.json({ ok: true });
}
