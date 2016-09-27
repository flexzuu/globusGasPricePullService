import { CronJob } from 'cron';
import task from './pullGlobus';
const job = new CronJob({
  cronTime: '0 0 * * * *',
  onTick: task,
  start: true,
});
task();
