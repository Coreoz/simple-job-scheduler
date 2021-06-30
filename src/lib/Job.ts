import { Logger } from 'simple-logging-system';

const logger = new Logger('Job');

export class Job {
  private executionsCount: number;

  private isCancelledState: boolean;

  constructor(
    readonly name: string,
    readonly runnable: (job?: Job) => void,
    readonly intervalInMillis: number,
    private readonly cancelHandle: () => boolean,
  ) {
    this.executionsCount = 0;
    this.isCancelledState = false;
  }

  execute() {
    try {
      this.runnable(this);
      this.executionsCount += 1;
    } catch (e) {
      logger.error(`An error occurred while executing the job "${this.name}"`, e);
    }
  }

  getExecutionsCount() {
    return this.executionsCount;
  }

  isCancelled() {
    return this.isCancelledState;
  }

  cancel(): boolean {
    if (this.isCancelledState) {
      logger.warn(`Trying to cancel an already cancelled job named "${this.name}"`);
      return false;
    }
    logger.info(`Cancelling job "${this.name}" after ${this.executionsCount} executions.`);
    this.isCancelledState = true;
    return this.cancelHandle();
  }
}
