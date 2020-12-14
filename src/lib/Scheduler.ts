import { Logger } from 'simple-logging-system';
import { Job } from './Job';

const logger = new Logger('Scheduler');

type JobContainer = {
  job: Job,
  intervalId: ReturnType<typeof setInterval>,
};

export class Scheduler {
  private readonly indexedJobsByName: Map<string, JobContainer>;

  constructor() {
    this.indexedJobsByName = new Map<string, JobContainer>();
  }

  schedule(jobName: string, runnable: (job?: Job) => void, intervalInMillis: number): Job {
    const existingJob = this.indexedJobsByName.get(jobName);
    if (existingJob !== undefined) {
      logger.warn(`There is already a job named ${jobName} running, the new job will not be scheduled.`);
      return existingJob.job;
    }
    const newJob = new Job(jobName, runnable, intervalInMillis, () => this.cancelInternal(jobName));
    const intervalId = setInterval(() => newJob.execute(), intervalInMillis);
    this.indexedJobsByName.set(jobName, { job: newJob, intervalId });
    return newJob;
  }

  cancel(jobName: string): boolean {
    const existingJob = this.indexedJobsByName.get(jobName);
    if (existingJob === undefined) {
      logger.warn(`Trying to cancel job ${jobName}, but it does not exist.`);
      return false;
    }

    return existingJob.job.cancel();
  }

  cancelAll() {
    this.indexedJobsByName.forEach((jobContainer) => jobContainer.job.cancel());
  }

  runningJobs() {
    return Array.from(this.indexedJobsByName.values()).map((jobContainer) => jobContainer.job);
  }

  private cancelInternal(jobName: string): boolean {
    const existingJob = this.indexedJobsByName.get(jobName);
    if (existingJob === undefined) {
      logger.warn(`Trying to cancel job ${jobName}, but it does not exist.`);
      return false;
    }

    clearInterval(existingJob.intervalId);
    this.indexedJobsByName.delete(jobName);
    return true;
  }
}
