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

  if (req.nextUrl.searchParams.get('rawSentryTest') === '1') {
    const dsn = new URL(env.NEXT_PUBLIC_SENTRY_DSN);
    const publicKey = dsn.username;
    const projectId = dsn.pathname.replace('/', '');
    const ingestUrl = `https://${dsn.host}/api/${projectId}/envelope/`;

    const envelope = [
      JSON.stringify({}),
      JSON.stringify({ type: 'event' }),
      JSON.stringify({ message: 'DEBUG raw fetch test to Sentry ingest', level: 'info', platform: 'node' }),
    ].join('\n');

    const res = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=raw-test/1.0, sentry_key=${publicKey}`,
      },
      body: envelope,
    });

    const bodyText = await res.text();
    console.log('[model-lifecycle] raw Sentry fetch status:', res.status, bodyText);

    return NextResponse.json({ rawSentryStatus: res.status, rawSentryBody: bodyText });
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
