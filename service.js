import { CronJob } from 'cron';
import task from './pullGlobus';
const job = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: task,
});
job.start();
task();
