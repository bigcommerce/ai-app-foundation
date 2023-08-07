import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { env } from 'src/env.mjs';

const jwtPayloadSchema = z.object({
  storeUser: z.number(),
  storeHash: z.string(),
});

export function authorize() {
  const token = cookies().get('ai-app-foundation-token');

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token.value, env.JWT_KEY);

    const parsed = jwtPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      return null;
    }

    return parsed.data;
  } catch (err) {
    return null;
  }
}
