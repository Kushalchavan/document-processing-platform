import { beforeAll } from 'vitest';
import { execSync } from 'node:child_process';

beforeAll(() => {
  execSync('pnpm migrate', {
    stdio: 'inherit',
  });
});