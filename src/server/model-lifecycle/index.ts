import { sendSentryEvent } from '~/lib/sentry-raw';
import { checkReleaseNotes } from './releaseNotesCheck';
import { checkLaunchStage } from './launchStageCheck';

export async function runModelLifecycleChecks(): Promise<void> {
  const results = await Promise.allSettled([checkReleaseNotes(), checkLaunchStage()]);

  for (const result of results) {
    if (result.status === 'rejected') {
      const reason = result.reason instanceof Error ? (result.reason.stack ?? result.reason.message) : String(result.reason);

      await sendSentryEvent({
        title: 'Model lifecycle check failed',
        message: reason,
        level: 'error',
        tags: { component: 'model-lifecycle' },
      });
    }
  }
}
