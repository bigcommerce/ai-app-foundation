import {
  collection,
  doc,
  getDocsFromServer,
  increment,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './db';

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

interface RateLimitDocument {
  count: number;
  windowStart: number;
  expiresAt?: Timestamp;
}

export interface RateLimitState {
  allowed: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 30;
const SHARD_COUNT = 20;
// Documents are cleaned up via Firestore TTL configured on the `expiresAt` field.
// Keeping a modest retention allows slow TTL sweeps without impacting active windows.
const RETENTION_WINDOWS = 24; // number of windows to keep for TTL cleanup

export async function enforceRateLimit(
  key: string,
  { windowMs = DEFAULT_WINDOW_MS, maxRequests = DEFAULT_MAX_REQUESTS }: RateLimitOptions = {}
): Promise<RateLimitState> {
  const db = getDb();
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const windowRef = collection(db, 'rateLimits', `${key}:${windowStart}`, 'shards');
  const shardId = Math.floor(Math.random() * SHARD_COUNT).toString();
  const shardRef = doc(windowRef, shardId);
  const expiresAt = Timestamp.fromMillis(windowStart + windowMs * RETENTION_WINDOWS);

  await setDoc(
    shardRef,
    { count: increment(1), windowStart, expiresAt },
    { merge: true },
  );

  const shardsSnapshot = await getDocsFromServer(windowRef);
  const count = shardsSnapshot.docs.reduce((sum, snapshot) => {
    const data = snapshot.data() as RateLimitDocument | undefined;

    return sum + (data?.count ?? 0);
  }, 0);
  const remaining = Math.max(0, maxRequests - count);
  const reset = windowStart + windowMs;

  return {
    allowed: count <= maxRequests,
    remaining,
    reset,
    limit: maxRequests,
  };
}
