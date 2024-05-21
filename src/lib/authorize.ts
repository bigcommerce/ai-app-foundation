import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from 'src/env.mjs';

const jwtPayloadSchema = z.object({
  storeUser: z.number(),
  storeHash: z.string(),
});

export function authorize(authToken: string) {
  try {
    const payload = jwt.verify(authToken, env.JWT_KEY);

    const parsed = jwtPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      return null;
    }

    return parsed.data;
  } catch (err) {
    return null;
  }
}
