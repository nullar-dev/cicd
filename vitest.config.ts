import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  // Get configuration from environment or use defaults
  const env = process.env;

  // Validate test environment
  const validTestEnvs = ['jsdom', 'node', 'happy-dom', 'edge-runtime'];
  const testEnv = env.VITEST_ENV || 'jsdom';
  if (!validTestEnvs.includes(testEnv)) {
    throw new Error(`Invalid VITEST_ENV: ${testEnv}. Must be one of: ${validTestEnvs.join(', ')}`);
  }

  // Validate coverage threshold
  const rawThreshold = env.COVERAGE_THRESHOLD || '80';
  const coverageThreshold = parseInt(rawThreshold, 10);
  if (isNaN(coverageThreshold) || coverageThreshold < 0 || coverageThreshold > 100) {
    throw new Error(
      `Invalid COVERAGE_THRESHOLD: ${rawThreshold}. Must be a number between 0 and 100.`
    );
  }

  // Validate coverage provider
  const validProviders = ['v8', 'istanbul'];
  const coverageProvider = env.COVERAGE_PROVIDER || 'v8';
  if (!validProviders.includes(coverageProvider)) {
    throw new Error(`Invalid COVERAGE_PROVIDER: ${coverageProvider}. Must be one of: ${validProviders.join(', ')}`);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: testEnv,
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: [
        (env.TEST_UNIT_DIR || 'src/__tests__/unit') + '/**/*.{ts,tsx}',
        (env.TEST_COMPONENT_DIR || 'src/__tests__/components') + '/**/*.{ts,tsx}',
        (env.TEST_API_DIR || 'src/__tests__/api') + '/**/*.{ts,tsx}',
      ].filter(Boolean),
      exclude: ['**/e2e/**', '**/node_modules/**'],
      coverage: {
        provider: coverageProvider as 'v8' | 'istanbul',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: coverageThreshold,
          branches: coverageThreshold,
          functions: coverageThreshold,
          statements: coverageThreshold,
        },
        include: (env.COVERAGE_INCLUDE || 'src/**/*')
          .split(',')
          .map(p => p.trim())
          .filter(Boolean),
        exclude: (
          env.COVERAGE_EXCLUDE ||
          '**/*.test.ts,**/*.spec.ts,**/e2e/**,**/node_modules/**,src/app/layout.tsx,src/app/**/metadata.ts'
        )
          .split(',')
          .map(p => p.trim())
          .filter(Boolean),
      },
    },
  };
});
