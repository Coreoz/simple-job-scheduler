Simple Job Scheduler
====================
This is a simple JavaScript scheduling system written in TypeScript.
It is a small wrapper around the `setInterval` JavaScript function.

Installation
------------
Using NPM:
```
npm install simple-job-scheduler
```

Using Yarn:
```
yarn add simple-job-scheduler
```

Usage
-----
```typescript
// you should keep only one scheduler instance in your project
// (using either a static reference or using a dependency injection system)
const scheduler = new Scheduler();
// the job will be executed every second
const job = scheduler.schedule('job name', () => console.log('Hello World!'), 1000);
// after some time...
job.cancel();
```

Why create a library instead of using `setInterval`?
----------------------------------------------------
Have you ever inadvertently launched multiple times the same job? Do you ever wonder if your jobs has successfully been cancelled?
Simple Job Scheduler tries to address these issues:
- If the same running job is scheduled twice or more, only the first scheduling time will be taken into account (a job is identified by its name)
- The method `scheduler.runningJobs()` returns all the running jobs

Release process
---------------
1. run `npm login`
2. run `npm run release` <= yarn **must not** be used
