import {
  expect, afterEach, beforeEach, describe, it,
} from 'vitest';
import { Scheduler } from '../lib/Scheduler';

const waitTimeout = (durationInMillis: number) => new Promise((resolve) => setTimeout(resolve, durationInMillis));

describe('Scheduler tests', () => {
  let executionCount: number;
  const scheduler = new Scheduler();

  beforeEach(() => {
    executionCount = 0;
  });

  afterEach(() => {
    scheduler.cancelAll();
  });

  it('checking that once started the scheduled runnable is executed', async () => {
    scheduler.schedule('test', () => {
      executionCount += 1;
    }, 5);
    await waitTimeout(80);
    expect(executionCount).toBeGreaterThan(0);
  });

  it('verify that once the job is stopped, the runnable function is not called anymore', async () => {
    const job = scheduler.schedule('test', () => {
      executionCount += 1;
    }, 5);
    await waitTimeout(50);
    job.cancel();
    const executedCount = executionCount;
    await waitTimeout(50);
    expect(executionCount).toBe(executedCount);
  });

  it('verify that started multiple time the same job name has no effect', async () => {
    scheduler.schedule('test', () => {
      executionCount += 1;
    }, 5);
    scheduler.schedule('test', () => {
      executionCount += 1000;
    }, 5);
    scheduler.schedule('test', () => {
      executionCount += 1000;
    }, 5);
    await waitTimeout(80);
    expect(executionCount).toBeLessThan(20);
  });
});
