import { type JWTInput } from 'google-auth-library';
import { env } from '~/env.mjs';

export function getGoogleAuthCredentials(): JWTInput {
  const credentialsBuffer = Buffer.from(
    env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64,
    'base64'
  );

  return JSON.parse(credentialsBuffer.toString('utf-8')) as JWTInput;
}
