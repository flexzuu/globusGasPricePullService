import Later from 'later';
import task from './pullGlobus';
//Initial run ...
task();
//Run every X ...
const schedule = Later.parse.recur().every(30).minute(),
Later.setInterval(task, schedule),
