import schedule from 'node-schedule';
import task from './pullGlobus';

var j = schedule.scheduleJob('*/30 * * * * *', task);
task();
