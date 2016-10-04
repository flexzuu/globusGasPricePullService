import task from './pullGlobus';
//Initial run ...
task();
//Run every time milliseconds ...
const time = 1000* 60;
let timer = 30;
setInterval(()=>{
  console.log(new Date().toString(), "Running...");
  if(timer == 0){
    task();
    timer = 30;
  }else {
    timer--;
  }
}, time);
