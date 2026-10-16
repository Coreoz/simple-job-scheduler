import { defineConfig } from 'vitest/config';

// Dedicated configuration to test the *built* package (after `yarn build`).
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/package/**/*.test.ts'],
  },
});
