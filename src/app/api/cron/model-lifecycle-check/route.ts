import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env.mjs';
import { sendSentryEvent } from '~/lib/sentry-raw';
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
    const reason = err instanceof Error ? (err.stack ?? err.message) : String(err);

    await sendSentryEvent({
      message: `Model lifecycle cron crashed: ${reason}`,
      level: 'error',
      tags: { component: 'model-lifecycle' },
    });

    return new NextResponse('Internal Error', { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
