import os
import time
import requests
import urllib.parse
from pyrogram import Client, filters
from pyrogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ChatPermissions
from yt_dlp import YoutubeDL
import google.generativeai as genai

# ==================== CONFIGURATION ====================
API_ID = 1234567          # my.telegram.org se lein
API_HASH = "your_hash"    # my.telegram.org se lein
BOT_TOKEN = "your_token"  # @BotFather se lein
GEMINI_KEY = "your_key"   # Google AI Studio se lein
SUDO_USERS = [123456789]  # Owner/Admin User ID

# AI Config
genai.configure(api_key=GEMINI_KEY)
ai_model = genai.GenerativeModel('gemini-pro')

app = Client("PhoenixUltraBot", api_id=API_ID, api_hash=API_HASH, bot_token=BOT_TOKEN)

# ==================== PREMIUM UI MENUS ====================

# Home Menu Buttons
HOME_MARKUP = InlineKeyboardMarkup([
    [InlineKeyboardButton("🧠 AI Hub", callback_data="ui_ai"),
     InlineKeyboardButton("📥 Fast DL", callback_data="ui_dl")],
    [InlineKeyboardButton("🛡️ Shield Admin", callback_data="ui_admin"),
     InlineKeyboardButton("⚙️ Core Tools", callback_data="ui_tools")],
    [InlineKeyboardButton("✨ Developer Info", callback_data="ui_dev")]
])

# Back to Home Button
BACK_BUTTON = [InlineKeyboardButton("🔙 Back to Main Menu", callback_data="ui_home")]

# ==================== COMMANDS & CALLBACKS ====================

@app.on_message(filters.command("start"))
async def start_cmd(client, message):
    welcome_text = (
        f"🔥 **PHOENIX ULTRA V2.0 ONLINE** 🔥\n\n"
        f"Welcome, **{message.from_user.first_name}**.\n"
        f"🤖 System status: `OPTIMIZED [HIGH PERFORMANCE]`\n\n"
        f"Tap the buttons below to interact with the system database."
    )
    await message.reply_text(text=welcome_text, reply_markup=HOME_MARKUP)

@app.on_callback_query()
async def ui_engine(client, callback_query):
    data = callback_query.data
    
    if data == "ui_home":
        await callback_query.message.edit_text(
            "🔥 **PHOENIX ULTRA V2.0 ONLINE** 🔥\n\nSystem is idle. Select a core module below:",
            reply_markup=HOME_MARKUP
        )
        
    elif data == "ui_ai":
        text = (
            "🧠 **⚡ PHOENIX AI CORE INTERFACE**\n\n"
            "• `/ai [query]` - Chat with advanced Gemini AI.\n"
            "• `/imagine [prompt]` - Generate photorealistic digital art.\n\n"
            "⚡ *Processing Speed: ~0.8s*"
        )
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
        
    elif data == "ui_dl":
        text = (
            "📥 **⚡ HYPER-SPEED DOWNLOADER**\n\n"
            "• `/dl [link]` - Download High-Res Instagram Reels, YouTube, Shorts, TikTok.\n"
            "• `/song [name/link]` - Extract 320kbps Studio Master Audio.\n\n"
            "⚡ *Cloud Server: Active*"
        )
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
        
    elif data == "ui_admin":
        text = (
            "🛡️ **⚡ SYSTEM SECURITY & MODERATION**\n\n"
            "Run these commands by replying to a user's message in groups:\n"
            "• `/ban` - Purge user from database & group.\n"
            "• `/mute` - Restrict user from sending text/media.\n\n"
            "⚡ *Status: Guarding Group*"
        )
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
        
    elif data == "ui_tools":
        text = (
            "⚙️ **⚡ CORE METRICS & UTILITIES**\n\n"
            "• `/weather [city]` - Scrap satellite weather logs.\n"
            "• `/crypto` - Live global crypto ticker updates.\n\n"
            "⚡ *No External API Key Required.*"
        )
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
        
    elif data == "ui_dev":
        text = (
            "👑 **⚡ PHOENIX DEV MATRIX**\n\n"
            "• **Framework:** Pyrogram Async Architecture\n"
            "• **Engine:** Python 3.11+\n"
            "• **Platform:** Termux / Linux Terminal Optimized\n\n"
            "Developed with ❤️ for extreme automation."
        )
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))

# ==================== CORE LOGIC CORE ====================

@app.on_message(filters.command("ai"))
async def ai_chat(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/ai [your query]`")
    msg = await message.reply_text("🧠 **Phoenix AI is processing matrix...**")
    try:
        response = ai_model.generate_content(args[1])
        await msg.edit_text(f"🤖 **Phoenix AI Engine:**\n\n{response.text}")
    except Exception as e:
        await msg.edit_text(f"❌ **AI Connection Failure:** `{e}`")

@app.on_message(filters.command("imagine"))
async def imagine_art(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/imagine [art concept]`")
    msg = await message.reply_text("🎨 **Rendering high-res digital art...**")
    try:
        encoded = urllib.parse.quote(args[1])
        url = f"https://image.pollinations.ai/p/{encoded}?width=1080&height=1080&nologo=true"
        await message.reply_photo(photo=url, caption=f"✨ **Masterpiece:** `{args[1]}`\nRendered by Phoenix Ultra UI")
        await msg.delete()
    except Exception as e:
        await msg.edit_text(f"❌ **Render Timeout:** `{e}`")

@app.on_message(filters.command("dl"))
async def media_dl(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/dl [URL]`")
    msg = await message.reply_text("⚡ **HyperDL Engine Initializing...**")
    file_name = f"video_{int(time.time())}.mp4"
    ydl_opts = {'outtmpl': file_name, 'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', 'quiet': True}
    try:
        await msg.edit_text("📥 **Streaming media from server...**")
        with YoutubeDL(ydl_opts) as ydl: ydl.download([args[1]])
        await msg.edit_text("🚀 **Injecting video file into Telegram Cloud...**")
        await message.reply_video(video=file_name, caption="✅ **Downloaded via Phoenix HyperDL**")
        os.remove(file_name)
        await msg.delete()
    except Exception as e:
        if os.path.exists(file_name): os.remove(file_name)
        await msg.edit_text(f"❌ **HyperDL Blocked:** `{str(e)[:100]}`")

@app.on_message(filters.command("song"))
async def music_dl(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/song [audio title]`")
    msg = await message.reply_text("🔍 **Searching global audio logs...**")
    file_name = f"music_{int(time.time())}"
    ydl_opts = {'format': 'bestaudio/best', 'outtmpl': file_name, 'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '320'}], 'quiet': True}
    try:
        await msg.edit_text("📥 **Extracting 320kbps Studio Master...**")
        with YoutubeDL(ydl_opts) as ydl: ydl.download([f"ytsearch:{args[1]}"])
        real_file = f"{file_name}.mp3"
        await message.reply_audio(audio=real_file, title=args[1], performer="Phoenix Audio Core")
        os.remove(real_file)
        await msg.delete()
    except Exception as e:
        if os.path.exists(f"{file_name}.mp3"): os.remove(f"{file_name}.mp3")
        await msg.edit_text(f"❌ **Audio Extraction Failed:** `{str(e)[:100]}`")

@app.on_message(filters.command("ban") & filters.group)
async def ban_user(client, message):
    if not message.reply_to_message: return await message.reply_text("❗ Reply to a user's message to execute ban.")
    await client.ban_chat_member(message.chat.id, message.reply_to_message.from_user.id)
    await message.reply_text(f"🚫 **User Purged:** {message.reply_to_message.from_user.mention} has been banned.")

@app.on_message(filters.command("mute") & filters.group)
async def mute_user(client, message):
    if not message.reply_to_message: return await message.reply_text("❗ Reply to a user's message to execute mute.")
    await client.restrict_chat_member(message.chat.id, message.reply_to_message.from_user.id, ChatPermissions(can_send_messages=False))
    await message.reply_text(f"🔇 **User Silenced:** {message.reply_to_message.from_user.mention} is now muted.")

@app.on_message(filters.command("weather"))
async def weather_tool(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ Enter City Name.")
    res = requests.get(f"https://wttr.in/{args[1]}?format=%C+|++🌡️+%t++|++💧+%h")
    await message.reply_text(f"🌍 **Phoenix Weather Sat-Log ({args[1].capitalize()}):**\n\n`{res.text.strip()}`" if res.status_code == 200 else "❌ Location unknown.")

@app.on_message(filters.command("crypto"))
async def crypto_tool(client, message):
    try:
        data = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd").json()
        ticker = (
            "📈 **PHOENIX ULTRA LIVE TICKER**\n\n"
            f"🪙 **BTC:** `${data['bitcoin']['usd']:,}`\n"
            f"🪙 **ETH:** `${data['ethereum']['usd']:,}`\n"
            f"🪙 **SOL:** `${data['solana']['usd']:,}`"
        )
        await message.reply_text(ticker)
    except:
        await message.reply_text("❌ Ticker server offline.")

if __name__ == "__main__":
    app.run()
