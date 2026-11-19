/* Optional first-chapter prose. No changes to puzzles, saves or light mechanics. */
(()=>{
'use strict';
const scenes=[["22:07 · За дверью","Коридор третьего этажа пахнет мокрой шерстью и полиролью. Горничная держит в руке запасную наволочку, хотя уборка давно закончена. Она говорит, что свет под дверью не гас с девяти часов. Сначала ей показалось, что постоялец разговаривает по телефону. Потом она услышала короткий удар — не крик, скорее звук упавшего предмета.","Дежурный пересказывает её слова увереннее, чем она сама. В его протоколе нет ни удара, ни сомнений. Есть только сухое «постоялец отсутствовал». На вопрос, кто первым произнёс слово «уехал», дежурный долго ищет глазами нужную строку.","В комнате всё стоит слишком аккуратно: паспорт лежит на столе открытым, пальто висит на стуле, а у ножки кровати сохранилась полоска влажной пыли. Никто не может объяснить, откуда она появилась."],["21:17 · Ключ без владельца","В технической комнате пахнет нагретым пластиком. Старый принтер выталкивает ленту журнала рывками, будто не хочет расставаться с последними событиями. Электрик просит не трогать лист пальцами: краска ещё мажется.","«S-2 — не человек, — объясняет он. — Это кусок пластика. Сегодня он у одного, завтра у другого. Вы можете установить маршрут ключа, но не лицо того, кто держал его в руке». Он отводит глаза, когда речь заходит о двери B2.","На стене рядом с контроллером висят часы. Секундная стрелка замирает на каждом четвёртом делении. Вы записываете это отдельно: расхождение во времени не обязательно означает ложь, но оно способно превратить правильную последовательность в неправильную."],["21:39 · Человек в отражении","Охранник показывает не исходную запись, а распечатанный кадр. По его словам, цифровой архив автоматически очищается раз в сутки. Вы просите сохранить файл и получаете ответ: «Заявку нужно согласовать с управляющей».","На снимке виден край стойки, тусклый экран терминала и отражение человека. Лица нет. Зато в стекле различается второй источник света — лампа за спиной оператора. Он меняет очертания рукава, из-за чего светлая полоска кажется то бинтом, то манжетой.","«Я написал фамилию карандашом, — говорит охранник. — Чтобы не забыть, кого мне напомнил силуэт. Это не опознание». В протоколе его осторожная пометка уже успела превратиться в утверждение."],["21:40 · Письмо, которого никто не видел","В комнате администратора слышен тихий шум системного блока. Терминал общий, пароль написан на бумажке под клавиатурой. Любой сотрудник мог открыть почту, но отправленное письмо подписано именем исчезнувшего гостя.","В тексте всего две фразы. Они звучат как сообщение человека, который заранее знает, что его будут искать. Ветров, по словам коллег, обычно писал длинно и аккуратно указывал адресата. Но привычка — не доказательство: человек в страхе способен изменить собственный стиль.","На столе лежит лист с отпечатком угла конверта. Вы замечаете, что принтер использовали уже после отправки сообщения. Что именно распечатали, никто не помнит."],["22:04 · Слова управляющей","Орлова говорит негромко и без запинок. Она не отрицает, что могла подходить к терминалу, но каждый раз меняет причину: сначала бронь, затем письмо гостя, потом проверка отчёта. Эти объяснения могут быть правдой одновременно — или не быть ею вовсе.","Когда вы спрашиваете о пальто, она отвечает прежде, чем вопрос закончен. Когда упоминаете подвал, выдерживает паузу. На запястье виден светлый след, но делать вывод по одному жесту было бы слишком просто.","В её объяснении отсутствует вторая страница. «Скорее всего, её не было», — говорит Орлова. Затем просит вернуть ей первую, чтобы проверить подпись. Вы отказываетесь: документ уже включён в материалы дела."],["Под лестницей · Архив B2","На плане подвала слой за слоем видны чужие решения: старую лестницу закрыли, проход расширили, дверь перенесли. Каждое исправление подписано другой рукой. Внизу осталась дата, почти стёртая влагой.","Сторож вспоминает, что неделю назад за дверью B2 слышали металлический скрежет. Вызвали электрика, но ремонт перенесли: гостиница готовилась к приезду комиссии. «Там никто не живёт», — сказал тогда управляющий. Сторож не уточнил, почему дверь иногда закрывают снаружи.","План обещает второй выход, которого уже нет. Если Ветров действительно оказался внизу, рассчитывать на старую схему опасно."]];
const reader=document.getElementById('reader'),body=document.getElementById('docBody');
if(!reader||!body)return;
const panel=document.createElement('details');panel.className='archiveScene';
const heading=document.createElement('summary');heading.textContent='ФРАГМЕНТ РАССЛЕДОВАНИЯ · ПОЛЕВЫЕ ЗАМЕТКИ';
const title=document.createElement('h3'),prose=document.createElement('div');
const question=document.createElement('div');question.className='archiveQuestion';
panel.append(heading,title,prose,question);body.insertAdjacentElement('afterend',panel);
// Open questions, not solutions: the player still needs to verify claims with documents.
const hypotheses=[
 ['Добровольный отъезд','Почему паспорт и пальто остались в комнате?','Насильственное исчезновение','Кто видел Ветрова после закрытия двери?'],
 ['Служебный ключ использовали по назначению','Можно ли доказать владельца ключа по журналу?','Ключом воспользовался посторонний','Кто имел доступ к S-2 и когда?'],
 ['На кадре управляющая','Можно ли опознать человека по отражению?','Кадр намеренно вводит в заблуждение','Где исходный файл и кто подписал распечатку?'],
 ['Ветров отправил письмо сам','Есть ли независимое подтверждение отправителя?','Сообщение отправил другой человек','Кому был доступен общий терминал?'],
 ['Управляющая скрывает важное','Что подтверждено помимо её пауз и оговорок?','Её слова искажены протоколом','Сохранился ли полный текст объяснения?'],
 ['Подвал использовали для хранения','Совпадает ли план с реальным проходом?','Ветрова удерживали за дверью B2','Кто мог запереть дверь снаружи?']
];

const theoryStorage='delo308_theories_v1';
const evidencePairs=[[[0,3],[0,5]],[[1,5],[1,4]],[[2,3],[1,2]],[[0,3],[2,3]],[[3,4],[3,4]],[[0,5],[1,5]]];
let theoryRecord={};try{theoryRecord=JSON.parse(localStorage.getItem(theoryStorage)||'{}')||{}}catch(e){}
function theoryForm(index){
 const root=document.createElement('section');root.className='theoryWorkbench';
 const h=document.createElement('h4');h.textContent='ПРОВЕРКА ВЕРСИИ';root.append(h);
 const p=document.createElement('p');p.textContent='Выберите версию и два изученных документа. Ошибки не блокируют расследование.';root.append(p);
 const saved=theoryRecord[index]||{};
 const choices=document.createElement('div');choices.className='theoryChoices';
 for(let i=0;i<2;i++){const l=document.createElement('label'),r=document.createElement('input');r.type='radio';r.name='theory'+index;r.value=String(i);r.checked=Number(saved.choice||0)===i;l.append(r,document.createTextNode(' '+hypotheses[index][i*2]));choices.append(l);}
 root.append(choices);
 const sources=document.createElement('div');sources.className='theorySources';
 for(let k=0;k<2;k++){
  const l=document.createElement('label'),select=document.createElement('select');l.textContent='Документ '+(k+1);
  const blank=document.createElement('option');blank.value='';blank.textContent='Выберите материал';select.append(blank);
  chapters[0].docs.forEach((doc,i)=>{if(!state.seen?.[0]?.includes(i))return;const o=document.createElement('option');o.value=String(i);o.textContent=doc[0];select.append(o);});
  const selected=saved.evidence?.[k];if(selected!==undefined&&selected!==-1)select.value=String(selected);
  l.append(select);sources.append(l);
 }
 root.append(sources);
 const button=document.createElement('button');button.type='button';button.className='btn';button.textContent='СВЕРИТЬ УЛИКИ';root.append(button);
 const result=document.createElement('p');result.className='theoryResult';result.setAttribute('role','status');result.textContent=saved.feedback||'';root.append(result);
 button.addEventListener('click',()=>{
  const choice=Number(choices.querySelector('input:checked').value);
  const evidence=[...sources.querySelectorAll('select')].map(x=>x.value===''?-1:Number(x.value));
  const needed=evidencePairs[index][choice];
  const valid=evidence.every(x=>x>=0)&&new Set(evidence).size===2&&needed.every(x=>evidence.includes(x));
  const feedback=evidence.some(x=>x<0)?'Выберите два источника для проверки.':new Set(evidence).size!==2?'Нужны два разных источника.':valid?'Версия получила документальную опору. Это не окончательный вывод: проверьте её против других материалов.':'Эти материалы пока не подтверждают выбранную версию. Проверьте происхождение документов и попробуйте другую пару.';
  result.textContent=feedback;theoryRecord[index]={choice,evidence,feedback};try{localStorage.setItem(theoryStorage,JSON.stringify(theoryRecord))}catch(e){}
 });
 return root;
}

let renderedKey=null;
function refresh(){
 if(reader.hidden||typeof state==='undefined')return;
 const index=Number(state.selected),key=state.chapter+':'+index;
 if(state.chapter!==0||!scenes[index]){panel.hidden=true;renderedKey=null;return;}
 panel.hidden=false;
 if(renderedKey===key)return;
 renderedKey=key;panel.open=false;
 const scene=scenes[index],options=hypotheses[index];
 title.textContent=scene[0];
 prose.replaceChildren(...scene.slice(1).map(t=>{const p=document.createElement('p');p.textContent=t;return p;}));
 question.replaceChildren();
 const prompt=document.createElement('p');prompt.className='archiveQuestionHeading';prompt.textContent='ДВЕ ВЕРСИИ · НЕ ВЫВОД СЛЕДСТВИЯ';
 question.append(prompt);
 for(let i=0;i<options.length;i+=2){
  const article=document.createElement('article'),h=document.createElement('strong'),p=document.createElement('p');
  h.textContent=options[i];p.textContent=options[i+1];article.append(h,p);question.append(article);
 }
 question.append(theoryForm(index));
}
const docTitle=document.getElementById('docTitle');
if(docTitle)new MutationObserver(refresh).observe(docTitle,{childList:true,characterData:true,subtree:true});
new MutationObserver(refresh).observe(reader,{attributes:true,attributeFilter:['hidden']});
document.getElementById('papers')?.addEventListener('click',()=>setTimeout(refresh,0));
document.getElementById('startCase')?.addEventListener('click',()=>setTimeout(refresh,250));
const style=document.createElement('style');style.textContent='.archiveScene{margin:22px 0 8px;border-top:1px solid #9e896a;border-bottom:1px solid #9e896a;color:#463b2d}.archiveScene summary{cursor:pointer;padding:16px 4px;font:11px/1.5 monospace;letter-spacing:1.1px;color:#64553e}.archiveScene summary:focus-visible{outline:2px solid #8d6b3c}.archiveScene h3{font:normal 23px/1.3 Georgia,serif;margin:10px 0 17px;color:#443425}.archiveScene p{font:16px/1.8 Georgia,serif;margin:0 0 15px;color:#4c4032}';style.textContent+='.archiveQuestion{border-top:1px dashed #a28c6e;padding-top:12px;margin-top:20px}.archiveQuestionHeading{font:11px/1.5 monospace!important;letter-spacing:1px;color:#66583e!important}.archiveQuestion article{padding:10px 0;border-bottom:1px solid #b5a58b}.archiveQuestion article strong{font:600 14px Georgia,serif;color:#483724}.archiveQuestion article p{font:14px/1.6 Georgia,serif;margin:6px 0!important;color:#64523f}';style.textContent+='.theoryWorkbench{padding:15px 0}.theoryWorkbench h4{font:11px monospace;letter-spacing:1px}.theoryChoices,.theorySources{display:grid;gap:9px;margin:12px 0}.theoryChoices label,.theorySources label{display:grid;gap:5px;font:14px Georgia,serif}.theorySources select{max-width:100%;padding:8px;background:#e6d7bc;color:#3b3022;border:1px solid #9c886c}.theoryResult{border-left:2px solid #8c7150;padding-left:12px;min-height:22px}';document.head.append(style);
})();
