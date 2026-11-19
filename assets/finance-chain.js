/* Optional finance chain: only augments chapter II document reader. */
(()=>{'use strict';
const reader=document.getElementById('reader'),body=document.getElementById('docBody'),docTitle=document.getElementById('docTitle');
if(!reader||!body||!docTitle||typeof chapters==='undefined')return;
const panel=document.createElement('details');panel.className='financeChain';
panel.innerHTML='<summary>ДОСЬЕ · ПРОВЕРКА ФИНАНСОВОЙ ЦЕПОЧКИ</summary><div class="financeBody"><h3>Куда ведёт платёж 4472?</h3><p>Сопоставьте три независимые записи. Выберите документы, подтверждающие сумму, заказ и маршрут. Это дополнительная проверка, а не замена кодового конверта.</p><div class="financeInputs"></div><button type="button" class="btn financeCheck">СВЕРИТЬ ЦЕПОЧКУ</button><p class="financeResult" role="status"></p></div>';
body.insertAdjacentElement('afterend',panel);
const fields=[['Платёж 70 000 ₽',1],['Основание заказа 07/14',4],['Маршрут контейнера C-17',5]];
const inputArea=panel.querySelector('.financeInputs'),result=panel.querySelector('.financeResult');
const storage='delo308_finance_v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(storage)||'{}')||{}}catch(e){}
const selects=fields.map(([label,correct],i)=>{
 const wrapper=document.createElement('label');wrapper.textContent=label;
 const select=document.createElement('select');select.setAttribute('aria-label',label);
 wrapper.append(select);inputArea.append(wrapper);return select;
});
function refresh(){
 if(reader.hidden||typeof state==='undefined')return;
 panel.hidden=state.chapter!==1;
 if(panel.hidden)return;
 selects.forEach((select,i)=>{
  const current=select.value||String(saved[i]??'');
  select.replaceChildren();
  const blank=document.createElement('option');blank.value='';blank.textContent='Выберите изученный документ';select.append(blank);
  chapters[1].docs.forEach((doc,index)=>{if(!state.seen?.[1]?.includes(index))return;const opt=document.createElement('option');opt.value=String(index);opt.textContent=doc[0];select.append(opt)});
  select.value=current;
 });
 result.textContent=saved.feedback||'';
}
panel.querySelector('.financeCheck').addEventListener('click',()=>{
 const values=selects.map(x=>x.value===''?-1:Number(x.value));
 let feedback='';
 if(values.includes(-1))feedback='Сначала изучите и выберите три документа.';
 else if(new Set(values).size!==3)feedback='Для проверки нужны три разных источника.';
 else if(values.every((x,i)=>x===fields[i][1]))feedback='Цепочка подтверждена: платёж 4472 → заказ 07/14 → контейнер C-17 → склад №4. Счёт не доказывает личность отправителя. Проверьте остальные материалы.';
 else feedback='В цепочке есть разрыв. Отделите платёж от музейной цены и проверьте маршрут именно синего контейнера.';
 saved={0:values[0],1:values[1],2:values[2],feedback};result.textContent=feedback;
 try{localStorage.setItem(storage,JSON.stringify(saved))}catch(e){}
});
new MutationObserver(refresh).observe(docTitle,{childList:true,subtree:true,characterData:true});
new MutationObserver(refresh).observe(reader,{attributes:true,attributeFilter:['hidden']});
reader.addEventListener('click',()=>setTimeout(refresh,0),true);
const style=document.createElement('style');style.textContent='.financeChain{margin:20px 0;border-top:1px solid #9e896a;border-bottom:1px solid #9e896a}.financeChain summary{cursor:pointer;padding:16px 4px;font:11px monospace;letter-spacing:1px;color:#64553e}.financeBody{padding:0 4px 16px}.financeBody h3{font:normal 21px Georgia,serif}.financeBody p{font:15px/1.6 Georgia,serif}.financeInputs{display:grid;gap:12px;margin:15px 0}.financeInputs label{display:grid;gap:5px;font:12px monospace}.financeInputs select{max-width:100%;padding:9px;background:#e6d7bc;color:#3b3022;border:1px solid #9c886c}.financeResult{border-left:2px solid #8c7150;padding-left:10px}';document.head.append(style);
})();