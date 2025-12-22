import type { Config } from 'jest'
import nextJest from 'next/jest.js'

// Allow unit tests to run without requiring full runtime env vars.
process.env.NODE_ENV ??= 'test';
process.env.SKIP_ENV_VALIDATION ??= '1';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  setupFiles: ['./jest.setup.ts']
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
