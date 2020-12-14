import { expect } from 'chai';
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
    // eslint-disable-next-line no-return-assign
    scheduler.schedule('test', () => executionCount += 1, 5);
    await waitTimeout(80);
    expect(executionCount).to.be.greaterThan(0);
  });

  it('verify that once the job is stopped, the runnable function is not called anymore', async () => {
    // eslint-disable-next-line no-return-assign
    const job = scheduler.schedule('test', () => executionCount += 1, 5);
    await waitTimeout(50);
    job.cancel();
    const executedCount = executionCount;
    await waitTimeout(50);
    expect(executionCount).to.be.equals(executedCount);
  });

  it('verify that started multiple time the same job name has no effect', async () => {
    // eslint-disable-next-line no-return-assign
    scheduler.schedule('test', () => executionCount += 1, 5);
    // eslint-disable-next-line no-return-assign
    scheduler.schedule('test', () => executionCount += 1000, 5);
    // eslint-disable-next-line no-return-assign
    scheduler.schedule('test', () => executionCount += 1000, 5);
    await waitTimeout(80);
    expect(executionCount).to.be.below(20);
  });
});
