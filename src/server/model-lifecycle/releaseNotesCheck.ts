import { BigQuery } from '@google-cloud/bigquery';
import * as Sentry from '@sentry/nextjs';
import { Timestamp } from 'firebase/firestore';
import { env } from '~/env.mjs';
import { getGoogleAuthCredentials } from '~/lib/google-auth';
import { getModelLifecycleWatermark, setModelLifecycleWatermark } from '~/lib/db';
import { MODEL_NAME } from '~/server/google-ai';

interface ReleaseNoteRow {
  product_name: string;
  description: string;
  published_at: { value: string };
}

// Google's release notes write the model name in prose (e.g. "Gemini 2.5 Flash-Lite"),
// not the API slug (e.g. "gemini-2.5-flash-lite"), so hyphens must also match spaces.
function toModelNamePattern(modelName: string): string {
  return modelName
    .split('-')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[- ]');
}

export async function checkReleaseNotes(): Promise<void> {
  console.log('[model-lifecycle] checkReleaseNotes: start');

  const watermark = await getModelLifecycleWatermark();
  console.log('[model-lifecycle] watermark read:', watermark ? watermark.toDate().toISOString() : null);

  // First run establishes a baseline instead of alerting on years of historical notes.
  if (!watermark) {
    await setModelLifecycleWatermark(Timestamp.now());
    console.log('[model-lifecycle] no prior watermark, baseline set, returning');
    return;
  }

  const bigquery = new BigQuery({
    projectId: env.FIRE_PROJECT_ID,
    credentials: getGoogleAuthCredentials(),
  });

  const watermarkDate = watermark.toDate().toISOString().slice(0, 10);
  const modelPattern = toModelNamePattern(MODEL_NAME);
  console.log('[model-lifecycle] querying BigQuery with', { watermarkDate, modelPattern, projectId: env.FIRE_PROJECT_ID });

  let rows: ReleaseNoteRow[];

  try {
    [rows] = (await bigquery.query({
      query: `
        SELECT product_name, description, published_at
        FROM \`bigquery-public-data.google_cloud_release_notes.release_notes\`
        WHERE published_at > @watermark
          AND LOWER(product_name) LIKE '%vertex%'
          AND REGEXP_CONTAINS(LOWER(description), @modelPattern)
        ORDER BY published_at ASC
      `,
      params: {
        watermark: watermarkDate,
        modelPattern,
      },
      types: {
        watermark: 'DATE',
        modelPattern: 'STRING',
      },
    })) as unknown as [ReleaseNoteRow[], unknown];
  } catch (err) {
    console.error('[model-lifecycle] BigQuery query threw:', err);
    throw err;
  }

  console.log('[model-lifecycle] query returned rows:', rows.length);

  if (rows.length === 0) {
    return;
  }

  for (const row of rows) {
    const plainTextDescription = row.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    Sentry.captureMessage(
      `Google Cloud release note mentions a monitored model: ${plainTextDescription}`,
      {
        level: 'warning',
        tags: { component: 'model-lifecycle', check: 'release-notes' },
      }
    );
  }

  const latestRow = rows[rows.length - 1];

  if (!latestRow) {
    return;
  }

  await setModelLifecycleWatermark(Timestamp.fromDate(new Date(latestRow.published_at.value)));
}
