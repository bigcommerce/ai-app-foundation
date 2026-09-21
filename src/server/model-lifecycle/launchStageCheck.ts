import { GoogleAuth } from 'google-auth-library';
import { env } from '~/env.mjs';
import { getGoogleAuthCredentials } from '~/lib/google-auth';
import { sendSentryEvent } from '~/lib/sentry-raw';
import { MODEL_NAME } from '~/server/google-ai';

interface PublisherModel {
  launchStage?: string;
}

interface PublisherModelCheck {
  status: number;
  body: PublisherModel | null;
}

async function fetchPublisherModel(modelName: string): Promise<PublisherModelCheck> {
  const auth = new GoogleAuth({
    credentials: getGoogleAuthCredentials(),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();

  if (!token) {
    throw new Error('Failed to obtain an access token for the Google AI lifecycle check.');
  }

  const response = await fetch(
    `https://aiplatform.googleapis.com/v1/publishers/google/models/${modelName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-goog-user-project': env.FIRE_PROJECT_ID,
      },
    }
  );

  const body = response.ok ? ((await response.json()) as PublisherModel) : null;

  return { status: response.status, body };
}

const MODEL_VERSIONS_DOCS_URL = 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions';
const UPGRADE_INSTRUCTIONS =
  'There might be needed to upgrade the model. You can do it by changing MODEL_NAME env var in Vercel and redeploying.';

export async function checkLaunchStage(): Promise<void> {
  const current = await fetchPublisherModel(MODEL_NAME);

  if (current.status !== 200) {
    await sendSentryEvent({
      title: `Model "${MODEL_NAME}" may have been retired`,
      message:
        `Google AI model "${MODEL_NAME}" is no longer reachable (HTTP ${current.status}). It may have been retired.` +
        `\n\nMore information: ${MODEL_VERSIONS_DOCS_URL}` +
        `\n\n${UPGRADE_INSTRUCTIONS}`,
      level: 'error',
      tags: { component: 'model-lifecycle', check: 'launch-stage', model: MODEL_NAME },
    });
  } else if (current.body?.launchStage !== 'GA') {
    await sendSentryEvent({
      title: `Model "${MODEL_NAME}" launch stage changed`,
      message:
        `Google AI model "${MODEL_NAME}" launchStage changed to "${current.body?.launchStage ?? 'unknown'}".` +
        `\n\nMore information: ${MODEL_VERSIONS_DOCS_URL}` +
        `\n\n${UPGRADE_INSTRUCTIONS}`,
      level: 'warning',
      tags: { component: 'model-lifecycle', check: 'launch-stage', model: MODEL_NAME },
    });
  }
}
