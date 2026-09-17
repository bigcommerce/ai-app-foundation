import { env } from '~/env.mjs';

interface SentryEventInput {
  message: string;
  level: 'info' | 'warning' | 'error';
  tags?: Record<string, string>;
}

export async function sendSentryEvent({ message, level, tags }: SentryEventInput): Promise<void> {
  const dsn = new URL(env.NEXT_PUBLIC_SENTRY_DSN);
  const publicKey = dsn.username;
  const projectId = dsn.pathname.replace('/', '');
  const ingestUrl = `https://${dsn.host}/api/${projectId}/envelope/`;

  const envelope = [
    JSON.stringify({}),
    JSON.stringify({ type: 'event' }),
    JSON.stringify({ message, level, tags, platform: 'node' }),
  ].join('\n');

  await fetch(ingestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-sentry-envelope',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=ai-app-foundation/1.0, sentry_key=${publicKey}`,
    },
    body: envelope,
  });
}
