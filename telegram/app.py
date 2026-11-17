"""Архив №308: Telegram Stars bot + authenticated Mini App server."""
import asyncio
import hashlib
import hmac
import json
import logging
import os
import secrets
import sqlite3
import time
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import parse_qsl

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import (
    InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice, Message, WebAppInfo,
)
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel, Field

load_dotenv()
TOKEN = os.environ.get("BOT_TOKEN", "")
if not TOKEN or TOKEN == "REPLACE_ON_SERVER_ONLY":
    raise RuntimeError("Set BOT_TOKEN in the server environment")
USERNAME = os.getenv("BOT_USERNAME", "delo308_game_bot").lstrip("@")
BASE = os.getenv("PUBLIC_BASE_URL", "").rstrip("/")
if not BASE.startswith("https://"):
    raise RuntimeError("PUBLIC_BASE_URL must be an https:// URL")
PRICE = int(os.getenv("TELEGRAM_STARS_PRICE", "100"))
if PRICE < 1:
    raise RuntimeError("TELEGRAM_STARS_PRICE must be >= 1")
DEMO = os.getenv("DEMO_URL", "https://khrustalev18235-oss.github.io/Delo/demo/")
FULL = Path(os.getenv("FULL_GAME_DIR", "/private/delo308/complete")).resolve()
DB = Path(os.getenv("DATABASE_PATH", "./data/players.sqlite3"))
DB.parent.mkdir(parents=True, exist_ok=True)
SECRET = hmac.new(TOKEN.encode(), b"miniapp-session-v1", hashlib.sha256).digest()
SESSION_AGE = 60 * 60 * 12
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("archive308")
bot = Bot(TOKEN)
dp = Dispatcher()


def connect():
    conn = sqlite3.connect(DB, timeout=15)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("CREATE TABLE IF NOT EXISTS purchases (user_id INTEGER PRIMARY KEY, charge_id TEXT NOT NULL UNIQUE, purchased_at INTEGER NOT NULL, refunded INTEGER NOT NULL DEFAULT 0)")
    conn.execute("CREATE TABLE IF NOT EXISTS progress (user_id INTEGER PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)")
    conn.commit()
    return conn


def owns(user_id: int) -> bool:
    with connect() as db:
        return db.execute("SELECT 1 FROM purchases WHERE user_id=? AND refunded=0", (user_id,)).fetchone() is not None


def menu(user_id: int):
    rows = [
        [InlineKeyboardButton(text="🔎 Играть в демоверсию", web_app=WebAppInfo(url=DEMO))],
        [InlineKeyboardButton(text="📂 Полная игра" if owns(user_id) else "🔒 Полная игра — купить", web_app=WebAppInfo(url=BASE + "/app"))],
    ]
    if not owns(user_id):
        rows.append([InlineKeyboardButton(text=f"⭐ Купить за {PRICE} Stars", callback_data="buy")])
    rows.append([InlineKeyboardButton(text="ℹ️ О деле", callback_data="about")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


@dp.message(CommandStart())
async def start(message: Message):
    await message.answer(
        "АРХИВ №308\n\n17 ноября 2026 года. Гостиница «Берег». "
        "Реставратор исчез из номера 308, оставив документы.\n\n"
        "Исследуйте первую главу бесплатно. Полная версия открывается после покупки.",
        reply_markup=menu(message.from_user.id),
    )


@dp.callback_query(F.data == "about")
async def about(query):
    await query.answer()
    await query.message.answer(
        "«Дело №308: Последний гость» — интерактивный детектив: "
        "4 главы, 24 документа, допросы, расследование на столе в 2D/3D.\n"
        "Демоверсия — первая глава.",
        reply_markup=menu(query.from_user.id),
    )


@dp.callback_query(F.data == "buy")
async def buy(query):
    await query.answer()
    if owns(query.from_user.id):
        await query.message.answer("Полная версия уже доступна.", reply_markup=menu(query.from_user.id))
        return
    await bot.send_invoice(
        chat_id=query.from_user.id,
        title="Дело №308 — полная версия",
        description="Доступ ко всем четырём главам интерактивного детектива.",
        payload="delo308_full_v1",
        currency="XTR",
        prices=[LabeledPrice(label="Полная версия", amount=PRICE)],
        start_parameter="delo308-full",
    )


@dp.pre_checkout_query()
async def checkout(query):
    valid = query.invoice_payload == "delo308_full_v1" and query.currency == "XTR" and query.total_amount == PRICE
    await query.answer(ok=valid, error_message=None if valid else "Некорректный счёт. Откройте покупку заново.")


@dp.message(F.successful_payment)
async def paid(message: Message):
    payment = message.successful_payment
    if payment.invoice_payload != "delo308_full_v1" or payment.currency != "XTR" or payment.total_amount != PRICE:
        log.error("Unexpected payment details for user %s", message.from_user.id)
        return
    with connect() as db:
        db.execute(
            "INSERT INTO purchases(user_id,charge_id,purchased_at,refunded) VALUES(?,?,?,0) "
            "ON CONFLICT(user_id) DO UPDATE SET charge_id=excluded.charge_id,purchased_at=excluded.purchased_at,refunded=0",
            (message.from_user.id, payment.telegram_payment_charge_id, int(time.time())),
        )
        db.commit()
    await message.answer("Оплата подтверждена. Полная версия открыта.", reply_markup=menu(message.from_user.id))


def telegram_user(init_data: str) -> int:
    pairs = dict(parse_qsl(init_data, keep_blank_values=True, strict_parsing=True))
    signature = pairs.pop("hash", "")
    if not signature or "auth_date" not in pairs or "user" not in pairs:
        raise HTTPException(401, "Telegram authentication required")
    try:
        issued = int(pairs["auth_date"])
        user_id = int(json.loads(pairs["user"])["id"])
    except (ValueError, TypeError, KeyError, json.JSONDecodeError):
        raise HTTPException(401, "Invalid Telegram authentication")
    if issued > time.time() + 60 or time.time() - issued > 3600:
        raise HTTPException(401, "Telegram authentication expired")
    data = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
    key = hmac.new(b"WebAppData", TOKEN.encode(), hashlib.sha256).digest()
    expected = hmac.new(key, data.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(401, "Invalid Telegram signature")
    return user_id


def signed_session(user_id: int):
    expires = int(time.time()) + SESSION_AGE
    value = f"{user_id}.{expires}"
    sig = hmac.new(SECRET, value.encode(), hashlib.sha256).hexdigest()
    return f"{value}.{sig}"


def authenticated(request: Request):
    cookie = request.cookies.get("archive308", "")
    try:
        uid, exp, sig = cookie.split(".")
        value = f"{uid}.{exp}"
        good = hmac.new(SECRET, value.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, good) or int(exp) < time.time():
            raise ValueError("Expired session")
        return int(uid)
    except (ValueError, TypeError):
        raise HTTPException(401, "Open the game from Telegram")


def purchased(request: Request):
    uid = authenticated(request)
    if not owns(uid):
        raise HTTPException(403, "Purchase required")
    return uid


class Login(BaseModel):
    init_data: str = Field(min_length=20, max_length=8192)


class Progress(BaseModel):
    data: dict


@asynccontextmanager
async def lifespan(app):
    with connect():
        pass
    polling = asyncio.create_task(dp.start_polling(bot, handle_signals=False))
    try:
        yield
    finally:
        await dp.stop_polling()
        polling.cancel()
        await bot.session.close()


app = FastAPI(title="Archive 308", lifespan=lifespan)


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/app", response_class=HTMLResponse)
def miniapp():
    return """<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://telegram.org/js/telegram-web-app.js"></script><style>
body{margin:0;padding:36px 22px;background:#111b16;color:#eadcc2;font:17px/1.7 Georgia,serif}
main{max-width:520px;margin:5vh auto}h1{font-size:39px;font-weight:normal}
button,a{display:inline-block;padding:13px 20px;background:#c8ab7d;color:#152019;border:0;text-decoration:none;font:14px monospace;cursor:pointer}
#msg{margin:20px 0;color:#cfc5af}</style></head><body><main><small>ЗАКРЫТЫЙ АРХИВ / ДЕЛО №308</small>
<h1>Последний гость</h1><p id="msg">Проверяем доступ к материалам…</p><div id="actions"></div></main>
<script>
const tg=window.Telegram?.WebApp;tg?.ready();tg?.expand();
(async()=>{const msg=document.querySelector('#msg'),actions=document.querySelector('#actions');
if(!tg?.initData){msg.textContent='Откройте игру через @delo308_game_bot в Telegram.';return}
try{const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({init_data:tg.initData})});
if(!r.ok)throw Error('Не удалось подтвердить вход через Telegram.');
const data=await r.json();
if(data.purchased){msg.textContent='Доступ подтверждён. Материалы дела готовы.';actions.innerHTML='<a href="/full">ОТКРЫТЬ ПОЛНУЮ ИГРУ →</a>'}
else{msg.textContent='Полная версия пока закрыта. Оплата доступна в меню бота.';actions.innerHTML='<a href="https://khrustalev18235-oss.github.io/Delo/demo/">ИГРАТЬ В ДЕМО →</a>'}
}catch(e){msg.textContent=e.message}
})();
</script></body></html>"""


@app.post("/api/auth")
def auth(login: Login, response: Response):
    uid = telegram_user(login.init_data)
    response.set_cookie("archive308", signed_session(uid), max_age=SESSION_AGE,
                        secure=True, httponly=True, samesite="lax", path="/")
    return {"purchased": owns(uid)}


@app.get("/api/me")
def me(request: Request):
    return {"purchased": owns(authenticated(request))}


@app.get("/full")
def full(request: Request):
    purchased(request)
    index = FULL / "index.html"
    if not index.is_file():
        raise HTTPException(503, "Full game is not deployed")
    return FileResponse(index, media_type="text/html", headers={"Cache-Control": "no-store"})


@app.get("/api/progress")
def get_progress(request: Request):
    uid = purchased(request)
    with connect() as db:
        row = db.execute("SELECT payload FROM progress WHERE user_id=?", (uid,)).fetchone()
    return {"data": json.loads(row[0]) if row else None}


@app.put("/api/progress")
def put_progress(request: Request, progress: Progress):
    uid = purchased(request)
    raw = json.dumps(progress.data, ensure_ascii=False, separators=(",", ":"))
    if len(raw.encode()) > 100_000:
        raise HTTPException(413, "Progress too large")
    with connect() as db:
        db.execute("INSERT INTO progress(user_id,payload,updated_at) VALUES(?,?,?) "
                   "ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at",
                   (uid, raw, int(time.time())))
        db.commit()
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
