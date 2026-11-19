/* Delo 308: non-invasive Yandex Metrika game event tracking. */
(()=>{'use strict';
const ID=114372079;
const send=(name,params)=>{try{if(typeof window.ym==='function')window.ym(ID,'reachGoal',name,params||{})}catch(_){}};
const sessionKey='d308_analytics_v1';
let tracked={};
try{tracked=JSON.parse(sessionStorage.getItem(sessionKey)||'{}')||{}}catch(_){}
const once=(key,goal,params)=>{if(tracked[key])return;tracked[key]=true;try{sessionStorage.setItem(sessionKey,JSON.stringify(tracked))}catch(_){}send(goal,params)};
let lastChapter=-1;
function check(){
 try{
  if(typeof state==='undefined'||!state||!Array.isArray(state.completed))return;
  const chapter=Number(state.chapter);
  if(Number.isInteger(chapter)&&chapter>=0&&chapter<4&&chapter!==lastChapter){
   lastChapter=chapter;
   if(chapter>0)once('chapter_'+(chapter+1),'chapter_start',{chapter:chapter+1});
  }
  if(state.completed[3])once('complete','game_complete');
 }catch(_){}
}
document.addEventListener('click',event=>{
 const target=event.target;
 if(!(target instanceof Element))return;
 if(target.closest('button[data-doc],#papers button,#startButton,#nextButton,#tabs button')){
  once('start','game_start');
 }
},{passive:true});
check();
setInterval(check,1200);
})();