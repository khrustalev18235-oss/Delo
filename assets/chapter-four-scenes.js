/* Chapter IV optional dispatch decision. Original intercept puzzle remains authoritative. */
(()=>{'use strict';
if(typeof chapters==='undefined'||chapters.length<4)return;
const entries=[["23:50 · Фирма с адресом гостиницы","В реестре собственником ООО «Север» указан Григорий Белов. Адрес совпадает с гостиницей, но место обработки бумаги находится в другом районе.","Следователь подчёркивает: владение фирмой объясняет возможность распоряжаться её средствами, но не доказывает, что Белов лично загружал контейнер. Для маршрута нужны документы перевозки."],["23:51 · Ключ с окончанием 9F2","Аудитор показывает цепочку событий: сертификат 9F2 подтвердил пакет 4472, банк исполнил платёж. Заявлений об утрате ключа до операции нет.","«Я могу подтвердить использование сертификата, — говорит аудитор. — Но не могу назвать человека, который находился у клавиатуры». Эта оговорка должна остаться в протоколе."],["23:52 · Заявка без согласования","В заявке 0714 перечислены описи эвакуации, упаковочные листы и переписка о М-17. В графе разрешения музейной комиссии — пустота.","Фраза «копии для комиссии не оставлять» напечатана без подписи рядом. Она опасна не потому, что звучит зловеще, а потому, что исключает возможность повторной проверки уничтоженных материалов."],["23:53 · Второе объяснение","Белов дважды читает раннюю фразу «я проверил груз лично». Теперь он утверждает, что секретарь неверно записала его слова.","«Мне доложили о повреждённой крышке», — повторяет он. На просьбу назвать сотрудника отвечает не сразу. Следователь фиксирует противоречие, но не превращает его в признание."],["23:54 · Две одинаковые цифры","Этикетка C-17 указывает синий контейнер, склад №4 и заказ 0714. Соседний талон C-71 относится к серой таре и складу №2.","Ошибка в одной цифре отправит группу за хозяйственными материалами, а архив останется на маршруте к уничтожению. Цвет тары без номера заявки недостаточен."],["23:56 · Записка Ирины","Ирина признаёт, что скрыла свою роль в организации встречи Ветрова. Она боялась, что после этого перестанут верить остальным её словам.","Внизу записки адрес для дополнительных показаний. Ирина просит не возвращать документы ей лично — только выдать официальную расписку об их сохранении."]];
const reader=document.getElementById('reader'),body=document.getElementById('docBody'),docTitle=document.getElementById('docTitle');
if(!reader||!body||!docTitle)return;
const panel=document.createElement('details');panel.className='chapterFourScene';
const summary=document.createElement('summary');summary.textContent='ОПЕРАТИВНОЕ ДОСЬЕ · ДО ОТПРАВЛЕНИЯ';
const heading=document.createElement('h3'),prose=document.createElement('div');panel.append(summary,heading,prose);body.insertAdjacentElement('afterend',panel);
const dispatch=document.createElement('details');dispatch.className='dispatchDecision';
const ds=document.createElement('summary');ds.textContent='ЧЕРНОВИК РАСПОРЯЖЕНИЯ · ПРОВЕРКА МАРШРУТА';
const contentBox=document.createElement('div');contentBox.className='dispatchBody';
const prompt=document.createElement('p');prompt.textContent='Сверьте сведения, прежде чем передавать распоряжение диспетчеру. Эта тренировка не отправляет команду и не заменяет основную загадку перехвата.';
contentBox.append(prompt);
const fields=[
 {label:'Какой груз задержать?',options:['C-71 · серая тара','C-17 · синяя тара','Все грузы без разбора'],correct:1,doc:4},
 {label:'Какой склад уведомить?',options:['Склад №2','Склад №4','Не уведомлять склад'],correct:1,doc:4},
 {label:'Какой документ связывает груз с архивом М-17?',options:['Газетная заметка 1998 года','Заявка 0714','Личное письмо Соколова'],correct:1,doc:2}
];
const storage='delo308_dispatch_v1';let saved={};try{saved=JSON.parse(localStorage.getItem(storage)||'{}')||{}}catch(e){}
const selects=fields.map((field,i)=>{
 const label=document.createElement('label');label.textContent=field.label;
 const select=document.createElement('select');select.setAttribute('aria-label',field.label);
 select.append(new Option('Выберите ответ',''));
 field.options.forEach((value,j)=>select.append(new Option(value,String(j))));
 if(saved.values?.[i]!==undefined)select.value=String(saved.values[i]);
 label.append(select);contentBox.append(label);return select;
});
const button=document.createElement('button');button.type='button';button.className='btn';button.textContent='ПРОВЕРИТЬ РАСПОРЯЖЕНИЕ';contentBox.append(button);
const result=document.createElement('p');result.className='dispatchResult';result.setAttribute('role','status');result.textContent=saved.feedback||'';contentBox.append(result);
dispatch.append(ds,contentBox);panel.insertAdjacentElement('afterend',dispatch);
button.addEventListener('click',()=>{
 const values=selects.map(select=>select.value===''?-1:Number(select.value));
 let feedback='';
 if(values.includes(-1))feedback='Заполните все три пункта распоряжения.';
 else if(fields.some((field,i)=>!state.seen?.[3]?.includes(field.doc)))feedback='Недостаточно изученных источников: сначала откройте заявку и транспортную этикетку.';
 else if(values.every((value,i)=>value===fields[i].correct))feedback='Черновик обоснован: C-17, склад №4, заявка 0714. Для реального перехвата завершите основную загадку «Перехват груза».';
 else feedback='Распоряжение пока рискованно: можно задержать не тот груз. Перепроверьте индекс заказа, номер контейнера и склад назначения.';
 result.textContent=feedback;saved={values,feedback};try{localStorage.setItem(storage,JSON.stringify(saved))}catch(e){}
});
let lastKey='';
function refresh(){
 if(reader.hidden||typeof state==='undefined')return;
 const i=Number(state.selected),key=state.chapter+':'+i;
 if(state.chapter!==3||!entries[i]){panel.hidden=true;dispatch.hidden=true;lastKey='';return;}
 panel.hidden=false;dispatch.hidden=false;if(lastKey===key)return;lastKey=key;panel.open=false;
 const entry=entries[i];heading.textContent=entry[0];prose.replaceChildren(...entry.slice(1).map(t=>{const p=document.createElement('p');p.textContent=t;return p}));
}
new MutationObserver(refresh).observe(docTitle,{childList:true,subtree:true,characterData:true});
new MutationObserver(refresh).observe(reader,{attributes:true,attributeFilter:['hidden']});
reader.addEventListener('click',()=>setTimeout(refresh,0),true);
document.getElementById('papers')?.addEventListener('click',()=>setTimeout(refresh,0));
const style=document.createElement('style');style.textContent='.chapterFourScene,.dispatchDecision{margin:20px 0;border-top:1px solid #9e896a;border-bottom:1px solid #9e896a;color:#463b2d}.chapterFourScene summary,.dispatchDecision summary{cursor:pointer;padding:16px 4px;font:11px monospace;letter-spacing:1px;color:#64553e}.chapterFourScene h3{font:normal 23px/1.3 Georgia,serif;margin:12px 4px 17px}.chapterFourScene p,.dispatchBody p{font:16px/1.8 Georgia,serif;margin:0 4px 15px}.dispatchBody{padding:0 4px 16px;display:grid;gap:12px}.dispatchBody label{display:grid;gap:6px;font:12px monospace}.dispatchBody select{max-width:100%;padding:9px;background:#e6d7bc;color:#3b3022;border:1px solid #9c886c}.dispatchResult{border-left:2px solid #8c7150;padding-left:10px}';document.head.append(style);
})();