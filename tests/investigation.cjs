const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs'),assert=require('node:assert/strict');
function load(kind,saved){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
 let html=fs.readFileSync(kind+'/index.html','utf8').replace(/<script type="module">[\s\S]*?<\/script>/g,'').replace('<script src="../assets/investigation.js"></script>','<script>'+fs.readFileSync('assets/investigation.js','utf8')+'</script>');
 const dom=new JSDOM(html,{url:'https://example.test/'+kind+'/',runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.confirm=()=>true;if(saved)w.localStorage.setItem(kind==='complete'?'delo308_complete_v1':'delo308_demo_v1',JSON.stringify(saved));}});
 assert.deepEqual(errors.map(e=>e.message),[]);dom.errors=errors;return dom;
}
for(const kind of ['complete','demo']){
 const dom=load(kind),w=dom.window,d=w.document,click=id=>d.getElementById(id).click(),s=w.delo308.getState();
 assert.equal(d.querySelectorAll('.investigationActions>button').length,3);
 assert.equal(d.querySelectorAll('.archiveHeader #readerSettings').length,1);
 assert.equal(d.querySelector('#settings #audioButton')!==null,true);
 w.delo308.openDoc(1);click('flip');click('backlight');assert(s.discoveries['0:1']);
 assert.equal(d.querySelector('#transmittedInk').hidden,false);
 w.delo308.openDoc(5);assert.equal(d.querySelector('#transmittedInk').hidden,true);click('flip');click('backlight');assert(s.discoveries['0:5']);
 s.seen[0]=[0,1,2,3,4,5];click('puzzleButton');d.querySelector('#puzzleCode').value='0000';click('puzzleTry');assert(!s.puzzles[0]);d.querySelector('#puzzleCode').value='1746';click('puzzleTry');assert(s.puzzles[0]);
 for(let ch=0;ch<(kind==='complete'?4:1);ch++){
 s.chapter=ch;s.seen[ch]=[0,1,2,3,4,5];w.eval('render()');
 assert(d.querySelectorAll('#interviewOptions button').length>=3);
 if(ch===2){w.delo308.openDoc(4);click('flip');click('backlight');assert(s.discoveries['2:4']);}
 click('puzzleButton');
 if(ch===1){d.querySelector('#puzzleCode').value='0714';click('puzzleTry');}
 if(ch===2){for(let i=0;i<4;i++)d.querySelector('[data-time="'+i+'"]').click();}
 if(ch===3)d.querySelector('[data-container="1"]').click();
 assert(s.puzzles[ch],`chapter ${ch} puzzle`);
 click('solve');for(const e of d.querySelectorAll('#checklist input'))e.checked=true;d.querySelectorAll('#answers input')[w.delo308.getChapters()[ch].correct].checked=true;click('verify');assert(!s.completed[ch]);
 const link=w.eval('validLinks['+ch+'][0]');click('boardButton');d.querySelector('#boardA').value=link[0];d.querySelector('#boardB').value=link[1];d.querySelector('#boardType').value=link[2];click('boardLink');
 const need=w.delo308.getChapters()[ch].need;for(const e of d.querySelectorAll('#checklist input'))e.checked=need.includes(+e.value);click('verify');assert(s.completed[ch],`chapter ${ch} deduction`);
 }
 if(kind==='complete'){click('nextChapter');assert.equal(d.querySelector('#ending').hidden,false);assert(d.querySelector('#finalReport').textContent.includes('17'));}
 assert.deepEqual(dom.errors.map(e=>e.message),[]);
 w.delo308.persist();const exported=JSON.parse(w.localStorage.getItem(w.eval('KEY')));assert(exported.discoveries['0:1']);
 if(kind==='complete'){const resumed=load(kind,exported);assert.equal(resumed.window.document.querySelector('#speaker').textContent.includes('Белов'),true);resumed.window.close();}
 dom.window.close();console.log(kind+': complete walkthrough, wrong answers, saved light evidence, reader actions OK');
}
