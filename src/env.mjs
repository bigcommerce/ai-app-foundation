import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    FIRE_API_KEY: z.string().min(3),
    FIRE_DOMAIN: z.string().min(3),
    FIRE_PROJECT_ID: z.string().min(3),
    APP_ORIGIN: z.string().min(3),
    AUTH_CALLBACK: z.string().min(3),
    CLIENT_ID: z.string().min(3),
    CLIENT_SECRET: z.string().min(3),
    JWT_KEY: z.string().min(3),
    GOOGLE_API_KEY: z.string().min(3)
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    FIRE_API_KEY: process.env.FIRE_API_KEY,
    FIRE_DOMAIN: process.env.FIRE_DOMAIN,
    FIRE_PROJECT_ID: process.env.FIRE_PROJECT_ID,
    APP_ORIGIN: process.env.APP_ORIGIN,
    AUTH_CALLBACK: process.env.AUTH_CALLBACK,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    JWT_KEY: process.env.JWT_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
