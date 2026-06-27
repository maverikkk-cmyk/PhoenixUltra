import os
import time
import requests
import urllib.parse
from pyrogram import Client, filters
from pyrogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ChatPermissions
from yt_dlp import YoutubeDL
import google.generativeai as genai
from gtts import gTTS

# ==================== CONFIGURATION ====================
API_ID = 1234567          # my.telegram.org se lein
API_HASH = "your_hash"    # my.telegram.org se lein
BOT_TOKEN = "your_token"  # @BotFather se lein
GEMINI_KEY = "your_key"   # Google AI Studio se lein
SUDO_USERS = [123456789]  # Owner User ID

# AI Config
genai.configure(api_key=GEMINI_KEY)
ai_model = genai.GenerativeModel('gemini-pro')

app = Client("PhoenixUltraBot", api_id=API_ID, api_hash=API_HASH, bot_token=BOT_TOKEN)

# ==================== TAGDA UI MENUS ====================
HOME_MARKUP = InlineKeyboardMarkup([
    [InlineKeyboardButton("🧠 AI Hub", callback_data="ui_ai"),
     InlineKeyboardButton("📥 Fast DL", callback_data="ui_dl")],
    [InlineKeyboardButton("🛡️ Shield Admin", callback_data="ui_admin"),
     InlineKeyboardButton("⚙️ Core Tools", callback_data="ui_tools")],
    [InlineKeyboardButton("🎭 Fun & Media", callback_data="ui_fun")],
    [InlineKeyboardButton("✨ Developer Info", callback_data="ui_dev")]
])

BACK_BUTTON = [InlineKeyboardButton("🔙 Back to Main Menu", callback_data="ui_home")]

# ==================== START & MENU LOGIC ====================
@app.on_message(filters.command("start"))
async def start_cmd(client, message):
    welcome_text = (
        f"🔥 **PHOENIX ULTRA ULTIMATE ONLINE** 🔥\n\n"
        f"Welcome, **{message.from_user.first_name}**.\n"
        f"🤖 System status: `ULTRA PACKET ACTIVE [ALL FEATURES MERGED]`\n\n"
        f"Tap the buttons below to interact with the system database."
    )
    await message.reply_text(text=welcome_text, reply_markup=HOME_MARKUP)

@app.on_callback_query()
async def ui_engine(client, callback_query):
    data = callback_query.data
    
    if data == "ui_home":
        await callback_query.message.edit_text("🔥 **PHOENIX ULTRA ULTIMATE** 🔥\n\nSelect a core module below:", reply_markup=HOME_MARKUP)
    elif data == "ui_ai":
        text = "🧠 **⚡ AI CORE INTERFACE**\n\n• `/ai [query]` - Gemini AI Chat.\n• `/imagine [prompt]` - AI Image Generation."
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
    elif data == "ui_dl":
        text = "📥 **⚡ HYPER-SPEED DOWNLOADER**\n\n• `/dl [link]` - Download Insta Reels, YT Shorts, TikTok.\n• `/song [name]` - Download 320kbps MP3 Audio."
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
    elif data == "ui_admin":
        text = "🛡️ **⚡ SECURITY & AUTOMATION**\n\n• `/ban` (Reply) - Ban User.\n• `/mute` (Reply) - Mute User.\n⚙️ **Auto Feature:** Anti-Link is automatically active for non-admins."
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
    elif data == "ui_tools":
        text = "⚙️ **⚡ UTILITIES & CONVERTERS**\n\n• `/weather [city]` - Satellite weather log.\n• `/crypto` - Live prices.\n• `/tts [text]` - Text to Speech audio note.\n📦 **Reply Tools:** Send Sticker to get Photo, or short video to get GIF."
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
    elif data == "ui_fun":
        text = "🎭 **⚡ ENTERTAINMENT HUB**\n\n• `/meme` - Get fresh trending meme from Reddit.\n• `/joke` - Get a funny joke."
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))
    elif data == "ui_dev":
        text = "👑 **⚡ PHOENIX DEV MATRIX**\n\n• All-In-One Unified Matrix Code.\n• Optimized for Termux & Zero Latency."
        await callback_query.message.edit_text(text, reply_markup=InlineKeyboardMarkup([BACK_BUTTON]))

# ==================== 1. SECURITY (ANTI-LINK) ====================
@app.on_message(filters.group & ~filters.service)
async def anti_link_handler(client, message):
    if not message.text: return
    # Check if user is admin
    user_status = (await message.chat.get_member(message.from_user.id)).status.value
    if user_status in ["administrator", "owner"] or message.from_user.id in SUDO_USERS:
        return
        
    # Check for links
    if "t.me/" in message.text or "http://" in message.text or "https://" in message.text:
        try:
            await message.delete()
            warn_msg = await message.reply_text(f"⚠️ {message.from_user.mention}, Links allow nahi hain is group me!")
            time.sleep(3)
            await warn_msg.delete()
        except: pass

# ==================== 2. AI MODULE ====================
@app.on_message(filters.command("ai"))
async def ai_chat(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/ai [query]`")
    msg = await message.reply_text("🧠 **Phoenix AI is processing matrix...**")
    try:
        response = ai_model.generate_content(args[1])
        await msg.edit_text(f"🤖 **Phoenix AI:**\n\n{response.text}")
    except Exception as e: await msg.edit_text(f"❌ **AI Failure:** `{e}`")

@app.on_message(filters.command("imagine"))
async def imagine_art(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/imagine [art concept]`")
    msg = await message.reply_text("🎨 **Rendering high-res digital art...**")
    try:
        encoded = urllib.parse.quote(args[1])
        url = f"https://image.pollinations.ai/p/{encoded}?width=1080&height=1080&nologo=true"
        await message.reply_photo(photo=url, caption=f"✨ **Masterpiece:** `{args[1]}`")
        await msg.delete()
    except Exception as e: await msg.edit_text(f"❌ **Render Timeout:** `{e}`")

# ==================== 3. DOWNLOADER MODULE ====================
@app.on_message(filters.command("dl"))
async def media_dl(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/dl [URL]`")
    msg = await message.reply_text("⚡ **HyperDL Engine Initializing...**")
    file_name = f"video_{int(time.time())}.mp4"
    ydl_opts = {'outtmpl': file_name, 'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', 'quiet': True}
    try:
        with YoutubeDL(ydl_opts) as ydl: ydl.download([args[1]])
        await msg.edit_text("🚀 **Uploading to Telegram Cloud...**")
        await message.reply_video(video=file_name, caption="✅ **Downloaded via Phoenix HyperDL**")
        os.remove(file_name)
        await msg.delete()
    except Exception as e:
        if os.path.exists(file_name): os.remove(file_name)
        await msg.edit_text(f"❌ **HyperDL Blocked:** `{str(e)[:50]}`")

@app.on_message(filters.command("song"))
async def music_dl(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/song [title]`")
    msg = await message.reply_text("🔍 **Searching global audio logs...**")
    file_name = f"music_{int(time.time())}"
    ydl_opts = {'format': 'bestaudio/best', 'outtmpl': file_name, 'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '320'}], 'quiet': True}
    try:
        with YoutubeDL(ydl_opts) as ydl: ydl.download([f"ytsearch:{args[1]}"])
        real_file = f"{file_name}.mp3"
        await message.reply_audio(audio=real_file, title=args[1], performer="Phoenix Audio Core")
        os.remove(real_file)
        await msg.delete()
    except Exception as e:
        if os.path.exists(f"{file_name}.mp3"): os.remove(f"{file_name}.mp3")
        await msg.edit_text(f"❌ **Failed:** `{str(e)[:50]}`")

# ==================== 4. CONVERTERS & TOOLS ====================
@app.on_message(filters.command("tts"))
async def text_to_speech(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ **Syntax Error:** `/tts [text]`")
    msg = await message.reply_text("🗣️ **Generating voice note...**")
    file_name = f"tts_{int(time.time())}.ogg"
    try:
        tts = gTTS(text=args[1], lang='hi') # Hindi/Indian accented accent
        tts.save(file_name)
        await message.reply_voice(voice=file_name, caption="🗣️ **Phoenix TTS Engine**")
        os.remove(file_name)
        await msg.delete()
    except Exception as e: await msg.edit_text(f"❌ **TTS Error:** `{e}`")

@app.on_message(filters.sticker)
async def sticker_to_img(client, message):
    if not message.chat.type.value == "private": return
    msg = await message.reply_text("🔄 **Sticker Detected: Converting to Photo...**")
    try:
        file_path = await message.download(file_name="sticker.png")
        await message.reply_photo(photo=file_path, caption="✅ Converted WebP Sticker to PNG Image.")
        os.remove(file_path)
        await msg.delete()
    except Exception as e: await msg.edit_text(f"❌ Conversion Failed: `{e}`")

@app.on_message(filters.animation)
async def video_to_gif(client, message):
    if not message.chat.type.value == "private": return
    msg = await message.reply_text("🔄 **GIF/Animation Detected: Processing...**")
    try:
        file_path = await message.download(file_name="animation.mp4")
        await message.reply_video(video=file_path, caption="✅ Processed into Video/GIF format.")
        os.remove(file_path)
        await msg.delete()
    except Exception as e: await msg.edit_text(f"❌ Conversion Failed: `{e}`")

# ==================== 5. ADMIN, WEATHER, CRYPTO & FUN ====================
@app.on_message(filters.command("ban") & filters.group)
async def ban_user(client, message):
    if not message.reply_to_message: return await message.reply_text("❗ Reply to a user's message.")
    await client.ban_chat_member(message.chat.id, message.reply_to_message.from_user.id)
    await message.reply_text(f"🚫 **User Banned:** {message.reply_to_message.from_user.mention}")

@app.on_message(filters.command("mute") & filters.group)
async def mute_user(client, message):
    if not message.reply_to_message: return await message.reply_text("❗ Reply to a user's message.")
    await client.restrict_chat_member(message.chat.id, message.reply_to_message.from_user.id, ChatPermissions(can_send_messages=False))
    await message.reply_text(f"🔇 **User Muted:** {message.reply_to_message.from_user.mention}")

@app.on_message(filters.command("weather"))
async def weather_tool(client, message):
    args = message.text.split(" ", 1)
    if len(args) < 2: return await message.reply_text("❗ Enter City Name.")
    res = requests.get(f"https://wttr.in/{args[1]}?format=%C+|++🌡️+%t++|++💧+%h")
    await message.reply_text(f"🌍 **Weather Log:**\n\n`{res.text.strip()}`" if res.status_code == 200 else "❌ Location unknown.")

@app.on_message(filters.command("crypto"))
async def crypto_tool(client, message):
    try:
        data = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd").json()
        await message.reply_text(f"📈 **Crypto:**\n\n🪙 BTC: `${data['bitcoin']['usd']:,}`\n🪙 ETH: `${data['ethereum']['usd']:,}`\n🪙 SOL: `${data['solana']['usd']:,}`")
    except: await message.reply_text("❌ Server busy.")

@app.on_message(filters.command("meme"))
async def meme_scraper(client, message):
    try:
        res = requests.get("https://meme-api.com/gimme").json()
        await message.reply_photo(photo=res['url'], caption=f"😂 **{res['title']}**")
    except: await message.reply_text("❌ Failed to fetch meme.")

@app.on_message(filters.command("joke"))
async def joke_tool(client, message):
    try:
        res = requests.get("https://official-joke-api.appspot.com/random_joke").json()
        await message.reply_text(f"😂 **Joke:**\n\n➡️ {res['setup']}\n\n🟢 __{res['punchline']}__")
    except: await message.reply_text("❌ Server offline.")

if __name__ == "__main__":
    app.run()
