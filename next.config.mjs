await import('./src/env.mjs');
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(
  config,
  {
    silent: true,
    org: 'bigcommerce',
    project: 'ai-app-foundation',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
);
