import { initializeApp } from 'firebase/app';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { env } from '~/env.mjs';

export interface UserData {
  email: string;
  username?: string;
}
export interface User {
  email: string;
  id: number;
  username?: string;
}

export interface AuthProps {
  access_token?: string;
  context: string;
  scope?: string;
  user: User;
}

const { FIRE_API_KEY, FIRE_DOMAIN, FIRE_PROJECT_ID } = env;

const firebaseConfig = {
  apiKey: FIRE_API_KEY,
  authDomain: FIRE_DOMAIN,
  projectId: FIRE_PROJECT_ID,
};

export interface ClientTokenData {
  token: string;
  expiresAt: Timestamp;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore data management functions

// Use setUser for storing global user data (persists between installs)
export async function setUser(user: User) {
  if (!user) return Promise.resolve();

  const { email, id, username } = user;
  const ref = doc(db, 'users', String(id));
  const data: UserData = { email };

  if (username) {
    data.username = username;
  }

  await setDoc(ref, data, { merge: true });
}

export async function setStore(props: AuthProps) {
  const {
    access_token: accessToken,
    context,
    scope,
    user: { id },
  } = props;
  // Only set on app install or update
  if (!accessToken || !scope) return null;

  const storeHash = context?.split('/')[1] || '';
  const ref = doc(db, 'store', storeHash);
  const data = { accessToken, adminId: id, scope };

  await setDoc(ref, data);
}

// User management for multi-user apps
// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: AuthProps) {
  const {
    context,
    user: { id: userId },
  } = session;

  if (!userId) return null;

  const storeHash = context.split('/')[1];
  const documentId = `${userId}_${storeHash}`;
  const ref = doc(db, 'storeUsers', documentId);

  await setDoc(ref, { storeHash });
}

export async function deleteUser(storeHash: string, user: User) {
  const docId = `${user.id}_${storeHash}`;
  const ref = doc(db, 'storeUsers', docId);

  await deleteDoc(ref);
}

export async function getStoreToken(storeHash: string): Promise<string | null> {
  if (!storeHash) return null;
  const storeDoc = await getDoc(doc(db, 'store', storeHash));

  return storeDoc.data()?.accessToken;
}

export async function deleteStore(storeHash: string) {
  const ref = doc(db, 'store', storeHash);
  await deleteDoc(ref);
}

export async function saveClientToken(clientToken: string): Promise<string> {
  if (!clientToken) {
    throw new Error('A clientToken is required to create an exchange token.');
  }

  const exchangeToken = crypto.randomUUID();
  const expiresAt = Timestamp.fromMillis(Date.now() + 120 * 1000); // 2 minutes from now

  const ref = doc(db, 'exchangeTokens', exchangeToken);
  const data: Omit<ClientTokenData, 'expiresAt'> & { expiresAt: Timestamp } = {
    token: clientToken,
    expiresAt
  };

  await setDoc(ref, data);

  return exchangeToken;
}

export async function getClientTokenMaybeAndDelete(exchangeToken: string): Promise<string | false> {
  const ref = doc(db, 'exchangeTokens', exchangeToken);
  const docSnap = await getDoc(ref);

  await deleteDoc(ref);

  if (!docSnap.exists()) {
    return false;
  }

  const data = docSnap.data() as ClientTokenData;
  const now = Timestamp.now();

  if (now > data.expiresAt) {
    console.warn('Exchange token expired:', exchangeToken);
    return false;
  }

  return data.token;
}
