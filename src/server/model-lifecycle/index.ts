import * as Sentry from '@sentry/nextjs';
import { checkReleaseNotes } from './releaseNotesCheck';
import { checkLaunchStage } from './launchStageCheck';

export async function runModelLifecycleChecks(): Promise<void> {
  const results = await Promise.allSettled([checkReleaseNotes(), checkLaunchStage()]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[model-lifecycle] check rejected:', result.reason);
      Sentry.captureException(result.reason);
    }
  }

  console.log('[model-lifecycle] runModelLifecycleChecks finished');
}
