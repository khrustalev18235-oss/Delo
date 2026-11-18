/* Shared investigation revision. Keep legacy save keys and document indexes. */
(() => {
const byId = id => document.getElementById(id);
const full = chapters.length === 4;
// Restore missing chapter mechanics before the initial render (including resumed saves).
if (full) {
  puzzleInfo.splice(1, 3,
    {title:'Архивный пакет',intro:'На клапане пакета четыре окошка. В журнале заявки разделены по месяцу и порядковому номеру. Восстановите архивный индекс, затем проверьте, куда направлен пакет.',kind:'code',answer:'0714',need:[3,5],success:'За клапаном — распоряжение на вывоз описей М-17. Теперь можно отличить архивный заказ от покупки самой печати.'},
    {title:'Ночь большой воды',intro:'Восстановите порядок событий по независимым источникам. Подпись на фотографии и время составления документа — разные вещи.',kind:'timeline',need:[1,2,3,4],success:'Выдача груза произошла после отъезда хранителя; исправленный лист появился ещё позднее. Это основание пересмотреть обвинение, а не готовый приговор другому человеку.'},
    {title:'Перехват груза',intro:'Диспетчер предлагает три машины. Сверьте индекс заявки, цвет тары и конечный склад. Неверное распоряжение можно исправить.',kind:'choice',need:[2,4],success:'Диспетчер снял C-17 с маршрута. На складе №4 запрошено сохранение груза до осмотра. Оригиналы описей больше не отправятся в измельчитель.'}
  );
  interviews.splice(1, 3,
    {speaker:'Антон Ветров · реставратор',line:'Ветров держит стакан обеими руками. На вопрос о самочувствии отвечает про бумагу: «Она пахла сыростью, но края были сухие. Старый архив не бывает таким аккуратным». Медик оставил на столе чистую повязку; Ветров её пока не заметил.',questions:[
      ['Что произошло за дверью?','«Орлова сказала: только без фотографий. Я вошёл, услышал щелчок. Сначала думал — сквозняк. Потом она попросила подождать звонка. Я стучал, а она всё повторяла: скоро. В какой-то момент ответов не стало». Ветров не видел, кто оставался снаружи после этого.',[]],
      ['Почему вы приехали раньше комиссии?','«Ирина прислала снимок. На старой печати скол пересекает букву; на предложенной музею вещи скол обходит её. Копировщик повторил дефект как орнамент. Но фотография не заменяет экспертизу. Я хотел увидеть опись, прежде чем обвинять кого-либо».',[0,2]],
      ['За что платят перевозчику?','«Вы спрашиваете меня как специалиста по металлу? Здесь я такой же читатель, как вы. У сделки и перевозки разные получатели. Сравните номер заказа. Не складывайте суммы только потому, что они попали в одну папку».',[1,4]],
      ['Почему Ирина скрыла знакомство?','«Её отец всю жизнь отвечал на один вопрос. После смерти его продолжили задавать дочери. Она хотела, чтобы я приехал от музея, а не от неё. Это объясняет скрытность. Не оправдывает всё остальное».',[0,3]]]},
    {speaker:'Ирина Соколова · фотограф',line:'Ирина разворачивает газету сгибом к себе. «Здесь ещё прогноз погоды на завтра. Для них завтра было обычным днём». На полях выцветший телефон редакции; она проводит по нему пальцем, словно собирается позвонить.',questions:[
      ['Что вы помните о той ночи?','«Мне было девять. Я помню мокрый рукав отца и как он просил маму не включать радио. Про рампу узнала позже. Если скажу, что видела ящик сама, вам станет удобнее. Но это будет неправда».',[]],
      ['Откуда взялось время на снимке?','«Негатив сохранил фотограф. Время он переписал из журнала приёма. Поэтому снимок и журнал не два независимых свидетеля времени. Зато пломбу видно на самом негативе. Посмотрите на её номер».',[1,4]],
      ['Кто подтвердит отъезд отца?','«Водитель расписался не ради него — закрывал свой путевой лист. На следующей странице есть заправка. Именно такие скучные бумаги пережили людей, которые тогда выступали по телевизору».',[2,3]],
      ['Почему он не защищался?','«Защищался. Просто в газете осталось обвинение, а ответы лежат здесь. Я хочу, чтобы в новом протоколе было написано только то, что вы можете проверить. Даже если это меньше, чем мне хочется».',[4,5]]]},
    {speaker:'Григорий Белов · владелец гостиницы',line:'Белов снимает мокрое пальто и аккуратно вешает его на спинку. «Вы держите здесь людей из-за старых накладных». Он смотрит на часы только после этих слов. Телефон на столе перевёрнут экраном вниз.',questions:[
      ['Почему вы торопите вывоз?','«Ночью дешевле. Утром кухня принимает продукты, грузовики мешают друг другу. У любой хозяйственной операции есть расписание. Вы превращаете расписание в мотив».',[]],
      ['Кому принадлежит банковский ключ?','«Мне. Бухгалтер подготовила документ, я подтвердил пакет. Сумму помню, каждый лист — нет. Вы ведь тоже подписываете документы, которые составляли не вы». Он просит приложить к протоколу весь пакет, а не одну страницу.',[0,1]],
      ['Что именно находится в контейнере?','«Архив. Уже сказал. Влажная бумага, старые ведомости». Вы кладёте заявку рядом с этикеткой. Он поправляет очки: «Я не говорил, что там нет музейных материалов».',[2,4]],
      ['Зачем менять номер ящика?','«Была перепаковка». — «Где акт?» — «Должен быть в архиве». — «Который отправлен на уничтожение?» Белов долго разглаживает край рукава. «Запишите мой ответ дословно: местонахождение акта мне неизвестно».',[3,4]]]}
  );
  secondaryPuzzles.splice(1,3,
    {title:'Две разные сделки',intro:'Какие источники позволяют проверить назначение перевода без предположений о музейной покупке?',choices:['Платёжное поручение','Счёт с тем же индексом заказа','Цена музейного договора','Слова реставратора о копии'],correct:[0,1],explain:'Индекс связывает платёж со счётом перевозчика. Стоимость печати относится к другой операции.'},
    {title:'Номер меняется, пломба остаётся',intro:'Что позволяет проследить один груз через исправление номера?',choices:['Газетный заголовок','Пломба на негативе','Проступившая строка описи с той же пломбой','Личное письмо'],correct:[1,2],explain:'Совпадение пломбы связывает фотографию и исходную строку. Одна перестановка цифр этого не доказывает.'},
    {title:'Пределы обвинения',intro:'Какая пара подтверждает распоряжение о платеже именно Беловым?',choices:['Слух о краже','Владельцы фирмы в реестре','Аудит личного ключа','Время погрузки'],correct:[1,2],explain:'Реестр и аудит устанавливают связь с платежом. Для вывода о содержимом нужны отдельные транспортные документы.'}
  );
}
// Physical discoveries belong to the save, not to unrelated browser-wide flags.
state.discoveries = state.discoveries || {};
const secrets = {
 '0:1':'S-2 / 21:17 / OK\nS-2 / 21:23 / DENIED\nS-2 / 21:46 / OK\nКонтрольный оттиск. Время устройства, без поправки.',
 '0:5':'Сервис B2. Последовательность: минуты первого успешного прохода S-2, затем минуты последнего. Использовать время контроллера. Отказ не является проходом.',
 '0:4':'…не открывать до звонка…\nНиже две буквы: Л. О. Остальная часть листа отсутствует.',
 '2:4':'Исходная строка: М-17 / пломба 406. Поверх неё: М-71. Нижняя запись продавлена до исправления. На поле — 20:20.',
 '3:2':'Копировальный оттиск: заказ 0714 / тара C-17 / партия М-17. Отметка оператора: МК — приложений 0.'
};
updateTransmitted = function(){
 const lit=byId('reader').querySelector('.sheet').classList.contains('lit');
 const text=state.side===1?secrets[docKey()]:null;
 byId('transmittedInk').hidden=!(lit&&text);
 if(lit&&text){byId('transmittedText').textContent=text;state.discoveries[docKey()]=true;save();}
 byId('backlight').textContent=lit?'☼ Обычный свет':'☼ Просветить';
 byId('backlight').setAttribute('aria-pressed',String(lit));
 byId('lightStatus').textContent=lit?(text?'Обнаружен след записи. Сопоставьте его с другими материалами.':'На этой стороне дополнительных следов не видно. Проверьте оборот.'):'Обычный свет · осмотрите обе стороны листа';
};
const oldPuzzle=byId('puzzleButton').onclick;
byId('puzzleButton').onclick=()=>{
 if(state.chapter===2&&!state.discoveries['2:4']){
  byId('puzzleTitle').textContent='Ночь большой воды';byId('puzzleIntro').textContent='В описи есть исправление. Прежде чем восстанавливать события, исследуйте оборот листа на просвет.';
  byId('puzzleControls').replaceChildren();byId('secondaryPuzzle').replaceChildren();byId('puzzleResult').textContent='Нужна исходная запись, а не только её поздняя копия.';byId('puzzle').hidden=false;return;
 }
 oldPuzzle();
};
// Do not reveal chronology answers on the ordering buttons themselves.
timelineEvents.forEach(e=>e[0]='Событие');
const originalVerify=byId('verify').onclick;
byId('verify').onclick=()=>{
 const ch=state.chapter,chosen=[...byId('checklist').querySelectorAll('input:checked')].map(e=>+e.value);
 if(chosen.length!==chapters[ch].need.length){byId('result').textContent='Отберите '+chapters[ch].need.length+' ключевых документа. Отметить всю папку — не значит обосновать версию.';return;}
 if(!getLinks().length){byId('result').textContent='Сначала зафиксируйте хотя бы одну проверенную связь на доске сопоставления.';return;}
 originalVerify();
};
// A frame is a document workspace; all preferences live in a separate dialog.
const reader=byId('reader'), sheet=reader.querySelector('.sheet');
const frame=document.createElement('section');frame.className='archiveFrame';frame.setAttribute('aria-label','Материалы дела');reader.append(frame);
frame.innerHTML='<header class="archiveHeader"><span>АРХИВ №308 / МАТЕРИАЛЫ ДЕЛА</span><div><button class="btn" id="readerSettings" aria-label="Настройки">⚙</button></div></header><div class="documentStage"></div><div class="investigationActions"></div><p id="lightStatus" role="status"></p><p id="practice" role="status"></p>';
frame.querySelector('.documentStage').append(sheet);
frame.querySelector('.archiveHeader div').append(byId('closeReader'));
const actions=frame.querySelector('.investigationActions');actions.append(byId('backlight'),byId('flip'));
const compare=document.createElement('button');compare.className='btn';compare.id='compareDocument';compare.textContent='▱ Сопоставить';actions.append(compare);
const details=document.createElement('details');details.className='readerNotes';details.innerHTML='<summary>Пометки на полях</summary>';sheet.append(details);details.append(sheet.querySelector('.docAnnotations'));sheet.querySelector('.docAnnotations').style.display='block';
byId('readerSettings').onclick=()=>byId('settingsButton').click();
compare.onclick=()=>{byId('boardButton').click();byId('boardA').value=String(state.selected);previewComparison();};
byId('settings').style.zIndex=60;byId('caseboard').style.zIndex=50;
const settings=byId('settings').querySelector('.settingsPanel');
for(const id of ['audioButton','viewMode','export','restart'])settings.append(byId(id));
settings.append(byId('import').parentElement);
byId('zoom').remove();
const gear=byId('settingsButton');gear.textContent='⚙';gear.setAttribute('aria-label','Настройки');byId('game').querySelector('.top').append(gear);
// Keep the existing desk, with infrequently used tools collapsed.
const interview=byId('speaker').closest('.interview');const conversation=document.createElement('details');conversation.className='conversation';conversation.innerHTML='<summary>Разговор со свидетелем</summary>';interview.before(conversation);conversation.append(interview);
const utility=byId('boardButton').parentElement;const extra=document.createElement('details');extra.innerHTML='<summary>Записи и хронология</summary>';utility.before(extra);extra.append(utility);
const help=document.createElement('button');help.className='btn';help.textContent='Повторить обучение';settings.append(help);
help.onclick=()=>{state.practice={};save();byId('settings').hidden=true;openDoc(1);practice();};
state.practice=state.practice||{};
function practice(){
 const p=state.practice;
 byId('practice').hidden=!!p.compare;
 byId('practice').textContent=!p.flip?'ОСМОТР 1/3 · Нажмите «Повернуть»: у каждого листа есть оборот.':!p.light?'ОСМОТР 2/3 · Нажмите «Просветить» на обороте журнала или плана.':'ОСМОТР 3/3 · Откройте второй лист, затем «Сопоставить». Сравнивайте источник, время и противоречия.';
}
byId('flip').addEventListener('click',()=>{state.practice.flip=true;save();practice();});
byId('backlight').addEventListener('click',()=>{if(state.side===1&&secrets[docKey()])state.practice.light=true;save();practice();});
compare.addEventListener('click',()=>{if(state.practice.light&&state.seen[state.chapter].length>1)state.practice.compare=true;save();practice();});
const oldDraw=drawDoc;drawDoc=function(){oldDraw();byId('flip').textContent=state.side?'↻ На лицевую':'↻ Повернуть';practice();};
const board=byId('caseboard');const previews=document.createElement('div');previews.className='comparisonPages';byId('boardLog').before(previews);
function previewComparison(){previews.replaceChildren();for(const id of ['boardA','boardB']){const value=byId(id).value;if(value==='')continue;const i=+value,d=chapters[state.chapter].docs[i],article=document.createElement('article');const title=document.createElement('h3');title.textContent=d[0];article.append(title);for(const t of [d[2],'ОБОРОТ\n'+d[3],state.discoveries[state.chapter+':'+i]?secrets[state.chapter+':'+i]:'']){if(!t)continue;const p=document.createElement('p');p.textContent=t;article.append(p);}previews.append(article);}}
byId('boardA').addEventListener('change',previewComparison);byId('boardB').addEventListener('change',previewComparison);
byId('boardButton').addEventListener('click',previewComparison);
// Accessible modal focus and Escape: close only the top surface.
document.addEventListener('keydown',e=>{
 const top=[byId('v02Tour'),byId('settings'),board,byId('puzzle'),byId('deduction'),reader].find(el=>el&&!el.hidden);
 if(!top)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();top.hidden=true;if(top===byId('settings'))byId('readerSettings').focus();else if(top===board&&!reader.hidden)compare.focus();return;}
 if(e.key==='Tab'){const buttons=[...top.querySelectorAll('button,input,select,textarea,summary')].filter(el=>!el.disabled&&el.getClientRects().length);if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&(document.activeElement===first||!top.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!top.contains(document.activeElement))){e.preventDefault();first.focus();}}
},true);
for(const el of [reader,board,byId('settings')]){el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');}
// Skip the old six-page lecture; practice is shown inside the actual document.
byId('startCase').addEventListener('click',()=>{setTimeout(()=>{byId('v02Tour').hidden=true;byId('chapterTransition').hidden=true;openDoc(1);byId('flip').focus();},180);});
practice();
})();
