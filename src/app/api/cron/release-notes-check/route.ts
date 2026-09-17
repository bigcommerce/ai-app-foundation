import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env.mjs';
import { sendSentryEvent } from '~/lib/sentry-raw';
import { checkReleaseNotes } from '~/server/model-lifecycle/releaseNotesCheck';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await checkReleaseNotes();
  } catch (err) {
    const reason = err instanceof Error ? (err.stack ?? err.message) : String(err);

    await sendSentryEvent({
      title: 'Release notes check failed',
      message: reason,
      level: 'error',
      tags: { component: 'model-lifecycle', check: 'release-notes' },
    });

    return new NextResponse('Internal Error', { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
