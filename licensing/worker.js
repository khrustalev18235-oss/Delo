/**
 * Delo #308 manual-payment licensing gateway (Cloudflare Workers + D1 + private R2).
 * Never put ADMIN_SECRET or paid game files in public GitHub.
 * Secrets: wrangler secret put ADMIN_SECRET
 * Serve paid build only from private R2 via /play and /assets/*.
 */
const activationPage = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Дело №308 — Активация</title><style>body{background:#111712;color:#e8dcc6;font:18px/1.5 Georgia,serif;max-width:560px;margin:10vh auto;padding:24px}h1{font-size:38px;font-weight:normal}input,button{padding:14px;font:16px monospace}input{background:#222b25;color:#fff;border:1px solid #9e896a;width:100%;box-sizing:border-box}button{margin-top:12px;background:#d3b58a;border:0;cursor:pointer}p{color:#c4b89e}a{color:#d3b58a}</style></head><body><h1>Дело №308</h1><p>Полная версия · Активация лицензии</p><form id="form"><label for="code">Код, полученный после подтверждения перевода</label><input id="code" autocomplete="off" required placeholder="D308-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"><button>Открыть дело</button></form><p id="status" role="status"></p><script>document.getElementById('form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button'),out=document.getElementById('status');b.disabled=true;out.textContent='Проверяем код…';try{const response=await fetch('/api/redeem',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:document.getElementById('code').value})});const data=await response.json();if(!response.ok)throw Error(data.error||'Не удалось активировать код');out.textContent='Лицензия активирована. Открываем игру…';location.assign(data.play_url)}catch(error){out.textContent=error.message}finally{b.disabled=false}});</script></body></html>`;
const enc = new TextEncoder();
const hex = bytes => [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
async function sha(value){return hex(await crypto.subtle.digest('SHA-256',enc.encode(value)))}
function randomCode(){const b=crypto.getRandomValues(new Uint8Array(20));return 'D308-'+[...b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase().match(/.{1,8}/g).join('-')}
function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}})}
function originHeaders(request,env){const origin=request.headers.get('Origin');return origin===env.ALLOWED_ORIGIN?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'}:{}}
function admin(request,env){const expected=env.ADMIN_SECRET;const received=request.headers.get('Authorization')||'';return !!expected&&received==='Bearer '+expected}
function cookie(request){const raw=request.headers.get('Cookie')||'';return raw.split(';').map(s=>s.trim()).find(s=>s.startsWith('delo308_session='))?.slice(16)||''}
function cookieHeader(token,maxAge){return 'delo308_session='+token+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+maxAge}
async function activeSession(request,env){const token=cookie(request);if(!/^[a-f0-9]{64}$/.test(token))return false;const hash=await sha(token);const row=await env.DB.prepare("SELECT s.token_hash FROM sessions s JOIN licenses l ON l.code_hash=s.code_hash WHERE s.token_hash=? AND s.revoked=0 AND s.expires_at>datetime('now') AND l.status='redeemed' AND (l.expires_at IS NULL OR l.expires_at>datetime('now'))").bind(hash).first();return !!row}
function safePath(path){if(path==='/play'||path==='/play/')return 'index.html';if(path.startsWith('/assets/')){const part=path.slice(8);if(!part||part.includes('..')||part.includes('\\')||! /^[a-zA-Z0-9_./-]+$/.test(part))return null;return 'assets/'+part}return null}
const types={html:'text/html; charset=utf-8',js:'application/javascript; charset=utf-8',css:'text/css; charset=utf-8',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',svg:'image/svg+xml',woff2:'font/woff2'};
export default {async fetch(request,env){
 const url=new URL(request.url),path=url.pathname,headers=originHeaders(request,env);
 if(path==='/activate'&&request.method==='GET')return new Response(activationPage,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"}});
 if(request.method==='OPTIONS'&&path==='/api/redeem')return new Response(null,{status:204,headers});
 if(path==='/api/admin/issue'&&request.method==='POST'){
  if(!admin(request,env))return json({error:'Unauthorized'},401);
  const data=await request.json().catch(()=>({}));const note=typeof data.note==='string'?data.note.slice(0,120):'';
  const code=randomCode(),hash=await sha(code);
  await env.DB.prepare("INSERT INTO licenses(code_hash,note) VALUES (?,?)").bind(hash,note).run();
  return json({code,note,warning:'This code is shown once; store it securely.'},201);
 }
 if(path==='/api/admin/revoke'&&request.method==='POST'){
  if(!admin(request,env))return json({error:'Unauthorized'},401);
  const data=await request.json().catch(()=>({}));const code=String(data.code||'').trim().toUpperCase();
  if(!/^D308-([A-F0-9]{8}-){4}[A-F0-9]{8}$/.test(code))return json({error:'Invalid code'},400);
  const hash=await sha(code);
  const result=await env.DB.prepare("UPDATE licenses SET status='revoked' WHERE code_hash=?").bind(hash).run();
  await env.DB.prepare('UPDATE sessions SET revoked=1 WHERE code_hash=?').bind(hash).run();
  return json({revoked:result.meta.changes>0});
 }
 if(path==='/api/redeem'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return json({error:'Origin not allowed'},403,headers);
  const data=await request.json().catch(()=>({}));const code=String(data.code||'').trim().toUpperCase();
  if(!/^D308-([A-F0-9]{8}-){4}[A-F0-9]{8}$/.test(code))return json({error:'Неверный формат кода'},400,headers);
  const hash=await sha(code),token=hex(crypto.getRandomValues(new Uint8Array(32))),tokenHash=await sha(token);
  const changed=await env.DB.prepare("UPDATE licenses SET status='redeemed',redeemed_at=datetime('now') WHERE code_hash=? AND status='issued' AND (expires_at IS NULL OR expires_at>datetime('now'))").bind(hash).run();
  if(changed.meta.changes!==1)return json({error:'Код недействителен или уже активирован'},403,headers);
  await env.DB.prepare("INSERT INTO sessions(token_hash,code_hash,expires_at) VALUES (?,?,datetime('now','+365 days'))").bind(tokenHash,hash).run();
  return json({ok:true,play_url:url.origin+'/play'},200,{...headers,'Set-Cookie':cookieHeader(token,31536000)});
 }
 if(path==='/api/session'&&request.method==='GET')return json({active:await activeSession(request,env)});
 if(path==='/api/logout'&&request.method==='POST')return json({ok:true},200,{'Set-Cookie':cookieHeader('',0)});
 if(request.method==='GET'){
  const key=safePath(path);if(key!==null){
   if(!await activeSession(request,env))return new Response('Требуется активация лицензии',{status:401,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});
   const file=await env.GAME.get(key);if(!file)return new Response('Файл не найден',{status:404});
   const extension=key.split('.').pop().toLowerCase();
   return new Response(file.body,{headers:{'content-type':types[extension]||'application/octet-stream','cache-control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"frame-ancestors 'none'"}});
  }
 }
 return json({error:'Not found'},404);
}};
