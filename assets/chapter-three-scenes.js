/* Optional chapter-three narrative and timeline, isolated from original timeline puzzle. */
(()=>{'use strict';
if(typeof chapters==='undefined'||chapters.length<3)return;
const entries=[["Ноябрь 1998 · Вода поднимается","Газетная полоса пожелтела неравномерно. Слова «эвакуация коллекции» напечатаны крупнее фамилий. Внизу заметки обещана публикация выводов комиссии, но продолжение вырезано.","Газета устанавливает причину переезда музейных фондов, но не может назвать виновного в пропаже. Публикация вышла после событий и пересказывает официальные сообщения.","Карандашная пометка о повторной проверке пломб становится важной только рядом с фотографией рампы и описью. Сама по себе она не доказывает подмену."],["18:50 · Последний целый кадр","На фотографии рампы видно мокрые доски и ящик М-17. На свинцовой пломбе читается 406. Вторая тара обрезана краем кадра — её невозможно ни сосчитать, ни опознать.","Фотограф не помнит, кто стоял справа от него. Время снимка он взял из журнала приёма и подписал на конверте с негативом. Эта цепочка происхождения важнее красивой легенды о точности камеры.","Снимок подтверждает прибытие закрытого ящика. Что лежало под крышкой, по фотографии не установить."],["18:55 · Маршрут хранителя","Водитель Котов говорит, что Соколов сел в машину сразу после разгрузки. Сначала они заехали на заправку, затем отвезли пострадавших сотрудников в приёмное отделение.","Заправочный чек и медицинская отметка не зависят от гостиничного журнала. В совокупности они делают версию о личной выдаче ящика Соколовым в 19:40 маловероятной.","Но отсутствие человека в гостинице не отвечает на вопрос, мог ли он заранее дать распоряжение. Для этого нужен документ, а не предположение."],["19:40 · Чужая рука в журнале","Электрик записывал выдачу фонарей. Строка о ящике 17 появилась сбоку, другим нажимом пера. Подпись «Г. Б.» может обозначать распоряжение, но не того, кто поднял груз.","В 19:35 связку и фонарь выдали Белову. Через пять минут грузчик отметил выдачу музейного места. Совпадение времени делает связь проверяемой, однако физический исполнитель остаётся неизвестным.","Вопрос расследования меняется: не «кто унёс ящик?», а «кто разрешил его выдать после отъезда хранителя?»."],["20:20 · Исправленная опись","На листе описи цифры выглядят спокойнее, чем события вокруг них. В верхней строке М-71. Вдавленные следы прежней записи заметны только при исследовании бумаги.","Исправление оформлено в 20:20 — через сорок минут после выдачи. Это время работы с документом, не обязательно время перемещения ящика.","Если нижний оттиск действительно М-17, запись об исправлении связывает два номера. Но пока не найдено объяснение, кто разрешил перенумерацию."],["2001 · Письмо без оправдания","Лев Соколов писал дочери через три года после наводнения. Он не просил верить ему на слово и не перечислял врагов. Он сохранил квитанции, которые все считали ненужными.","«Не обещай доказать мою правоту, — писал он. — Обещай дочитать лист до конца». Последняя строка надорвана по сгибу, будто письмо много раз открывали в одном месте.","Личное письмо не оправдывает и не обвиняет. Оно напоминает, что человек, чью репутацию уничтожили, тоже мог ошибаться — а документы всё равно нужно проверить."]];
const reader=document.getElementById('reader'),body=document.getElementById('docBody'),docTitle=document.getElementById('docTitle');
if(!reader||!body||!docTitle)return;
const panel=document.createElement('details');panel.className='chapterThreeScene';
const summary=document.createElement('summary');summary.textContent='АРХИВ 1998 · ДОПОЛНИТЕЛЬНОЕ ДОСЬЕ';
const heading=document.createElement('h3'),prose=document.createElement('div');panel.append(summary,heading,prose);body.insertAdjacentElement('afterend',panel);

/* Optional source-backed reconstruction. Does not modify the original timeline puzzle. */
const reconstruction=document.createElement('details');reconstruction.className='reconstruction';
reconstruction.innerHTML='<summary>РЕКОНСТРУКЦИЯ · ЧЕТЫРЕ СОБЫТИЯ</summary><div class="reconstructionBody"><p>Расположите события по времени и укажите документ, который подтверждает каждое. Дата составления описи — не время перемещения ящика.</p><div class="reconstructionRows"></div><button type="button" class="btn reconstructionCheck">ПРОВЕРИТЬ ХРОНОЛОГИЮ</button><p class="reconstructionResult" role="status"></p></div>';
panel.insertAdjacentElement('afterend',reconstruction);
const events=[
 {label:'Ящик М-17 прибыл на рампу',source:1,time:'18:50'},
 {label:'Соколов покинул гостиницу',source:2,time:'18:55'},
 {label:'Ящик выдан по распоряжению',source:3,time:'19:40'},
 {label:'В описи исправлен номер',source:4,time:'20:20'}
];
const storage='delo308_reconstruction_v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(storage)||'{}')||{}}catch(e){}
const rows=reconstruction.querySelector('.reconstructionRows');
const controls=[];
for(let i=0;i<4;i++){
 const line=document.createElement('div');line.className='reconstructionLine';
 const label=document.createElement('label');label.textContent='Позиция '+(i+1);
 const eventSelect=document.createElement('select');eventSelect.setAttribute('aria-label','Событие '+(i+1));
 eventSelect.append(new Option('Выберите событие',''));
 events.forEach((event,j)=>eventSelect.append(new Option(event.label,String(j))));
 const sourceSelect=document.createElement('select');sourceSelect.setAttribute('aria-label','Источник '+(i+1));
 sourceSelect.append(new Option('Документ-источник',''));
 chapters[2].docs.forEach((doc,j)=>sourceSelect.append(new Option(doc[0],String(j))));
 if(saved.events?.[i]!==undefined)eventSelect.value=String(saved.events[i]);
 if(saved.sources?.[i]!==undefined)sourceSelect.value=String(saved.sources[i]);
 label.append(eventSelect);line.append(label,sourceSelect);rows.append(line);
 controls.push([eventSelect,sourceSelect]);
}
const feedback=reconstruction.querySelector('.reconstructionResult');feedback.textContent=saved.feedback||'';
reconstruction.querySelector('.reconstructionCheck').addEventListener('click',()=>{
 const selected=controls.map(([e,d])=>[e.value===''?-1:Number(e.value),d.value===''?-1:Number(d.value)]);
 const sequence=selected.map(x=>x[0]),sources=selected.map(x=>x[1]);
 let message;
 if(sequence.includes(-1)||sources.includes(-1))message='Заполните все четыре события и их источники.';
 else if(new Set(sequence).size!==4)message='Каждое событие можно использовать только один раз.';
 else if(sequence.some((x,i)=>x!==i))message='Последовательность противоречит времени в документах. Проверьте фотографию, путевой лист и журнал электрика.';
 else if(selected.some(([e,d])=>events[e].source!==d))message='Порядок верный, но не все события подтверждены подходящими документами.';
 else message='Реконструкция подтверждена: 18:50 → 18:55 → 19:40 → 20:20. Отъезд хранителя предшествовал выдаче; исправление описи произошло позже. Это не устанавливает, кто физически унёс ящик.';
 feedback.textContent=message;
 saved={events:sequence,sources,feedback:message};try{localStorage.setItem(storage,JSON.stringify(saved))}catch(e){}
});

let lastKey='';
function refresh(){
 if(reader.hidden||typeof state==='undefined')return;
 const i=Number(state.selected),key=state.chapter+':'+i;
 if(state.chapter!==2||!entries[i]){panel.hidden=true;reconstruction.hidden=true;lastKey='';return;}
 panel.hidden=false;reconstruction.hidden=false;if(lastKey===key)return;lastKey=key;panel.open=false;
 const entry=entries[i];heading.textContent=entry[0];prose.replaceChildren(...entry.slice(1).map(t=>{const p=document.createElement('p');p.textContent=t;return p}));
}
new MutationObserver(refresh).observe(docTitle,{childList:true,subtree:true,characterData:true});
new MutationObserver(refresh).observe(reader,{attributes:true,attributeFilter:['hidden']});
reader.addEventListener('click',()=>setTimeout(refresh,0),true);
document.getElementById('papers')?.addEventListener('click',()=>setTimeout(refresh,0));
const style=document.createElement('style');style.textContent='.chapterThreeScene{margin:20px 0;border-top:1px solid #9e896a;border-bottom:1px solid #9e896a;color:#463b2d}.chapterThreeScene summary{cursor:pointer;padding:16px 4px;font:11px monospace;letter-spacing:1px;color:#64553e}.chapterThreeScene h3{font:normal 23px/1.3 Georgia,serif;margin:12px 4px 17px}.chapterThreeScene p{font:16px/1.8 Georgia,serif;margin:0 4px 15px}';style.textContent+='.reconstruction{margin:20px 0;border-top:1px solid #9e896a;border-bottom:1px solid #9e896a}.reconstruction summary{cursor:pointer;padding:16px 4px;font:11px monospace;letter-spacing:1px;color:#64553e}.reconstructionBody{padding:0 4px 16px}.reconstructionBody p{font:15px/1.6 Georgia,serif}.reconstructionRows{display:grid;gap:12px;margin:15px 0}.reconstructionLine{display:grid;gap:6px}.reconstructionLine label{display:grid;gap:5px;font:12px monospace}.reconstructionLine select{max-width:100%;padding:9px;background:#e6d7bc;color:#3b3022;border:1px solid #9c886c}.reconstructionResult{border-left:2px solid #8c7150;padding-left:10px}';document.head.append(style);
})();