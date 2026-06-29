import { useState, useEffect, useRef, useCallback } from "react";

// ============ SAMBANOVA FREE API ============
const SAMBANOVA_API_KEY = "YOUR_SAMBANOVA_API_KEY_HERE";
const SAMBANOVA_MODEL = "Meta-Llama-3.1-8B-Instruct";

const callAI = async (prompt, system = "") => {
  try {
    const res = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SAMBANOVA_API_KEY}` },
      body: JSON.stringify({
        model: SAMBANOVA_MODEL,
        messages: [
          { role: "system", content: system || "Tu ek desi AI bhai hai Shadow_X. Hinglish mein baat kar, helpful aur funny reh! 😂🔥" },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000, temperature: 0.7,
      }),
    });
    const d = await res.json();
    return d.choices?.[0]?.message?.content || "Kuch gadbad ho gaya bhai! 😅";
  } catch { return "⚠️ Network error! Internet check karo bhai."; }
};

const PERSONALITY_PROMPTS = {
  serious: "You are a professional, precise assistant. Answer formally and accurately.",
  funny: "Tu ek hilarious, witty AI hai. Jokes maar, emojis use kar, fun rakh! 😂",
  roast: "Tu ek savage roast master hai. Playfully roast karo but helpful bhi raho!",
  bakchodi: "Tu ek desi bhai hai jo bakchodi karta hai. Hinglish mein baat kar, masti karo! 😂🔥",
  dost: "Tu ek pakka dost hai. Seedha baat kar, sach bol, help bhi kar. Pure desi style!",
  philosopher: "You are a deep philosopher. Answer with profound wisdom and metaphors.",
  savage: "Tu ultra savage aur brutally honest hai. No sugarcoating, straight facts only!",
};

const C = {
  bg: "#080B14", card: "#0D1120", border: "#1A2040",
  cyan: "#00F5FF", violet: "#BF00FF", ember: "#FF4500",
  green: "#00FF88", yellow: "#FFD700", text: "#E0E8FF", muted: "#4A5580",
  pink: "#FF69B4", orange: "#FF8C00",
};

const useStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem("shx_" + key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  const save = useCallback((v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem("shx_" + key, JSON.stringify(next)); } catch {}
  }, [key, val]);
  return [val, save];
};

const FEATURES = [
  // AI
  { id: "chat", icon: "💬", label: "AI Chat", category: "ai" },
  { id: "image_gen", icon: "🎨", label: "Image Gen", category: "ai" },
  { id: "translator", icon: "🌐", label: "Translator", category: "ai" },
  { id: "summarizer", icon: "📝", label: "Summarizer", category: "ai" },
  { id: "math", icon: "🧮", label: "Math Solver", category: "ai" },
  { id: "code_gen", icon: "💻", label: "Code Generator", category: "ai" },
  { id: "code_explain", icon: "🐛", label: "Bug Fixer", category: "ai" },
  { id: "resume", icon: "📄", label: "Resume Builder", category: "ai" },
  { id: "cover_letter", icon: "💼", label: "Cover Letter", category: "ai" },
  { id: "essay", icon: "✍️", label: "Essay Writer", category: "ai" },
  { id: "email_draft", icon: "💌", label: "Email Draft", category: "ai" },
  { id: "whatsapp_gen", icon: "📱", label: "WhatsApp Msg", category: "ai" },
  { id: "reply_suggest", icon: "💬", label: "Reply Suggester", category: "ai" },
  { id: "story_gen", icon: "📖", label: "Story Generator", category: "ai" },
  { id: "script_writer", icon: "🎬", label: "Script Writer", category: "ai" },
  { id: "poetry_gen", icon: "🌸", label: "Poetry Generator", category: "ai" },
  { id: "lyrics_writer", icon: "🎵", label: "Lyrics Writer", category: "ai" },
  { id: "shayari", icon: "🎤", label: "Rap/Shayari", category: "ai" },
  { id: "roast_gen", icon: "🔥", label: "Roast Me!", category: "ai" },
  { id: "fortune", icon: "🔮", label: "Fortune Teller", category: "ai" },
  { id: "pickup", icon: "💘", label: "Pickup Lines", category: "ai" },
  { id: "excuse", icon: "🤥", label: "Excuse Generator", category: "ai" },
  { id: "debate", icon: "⚔️", label: "Debate Mode", category: "ai" },
  { id: "interview", icon: "🎙️", label: "Interview Prep", category: "ai" },
  { id: "business_idea", icon: "💡", label: "Business Ideas", category: "ai" },
  { id: "startup_name", icon: "🚀", label: "Startup Names", category: "ai" },
  { id: "recipe_gen", icon: "🍽️", label: "Recipe Generator", category: "ai" },
  { id: "gift_idea", icon: "🎁", label: "Gift Ideas", category: "ai" },
  { id: "trip_planner", icon: "✈️", label: "Trip Planner", category: "ai" },
  { id: "caption_gen", icon: "📸", label: "Caption Generator", category: "ai" },
  { id: "horoscope", icon: "🌙", label: "Daily Horoscope", category: "ai" },
  { id: "logo_idea", icon: "🎨", label: "Logo Ideas", category: "ai" },
  { id: "joke_gen", icon: "🤣", label: "Joke Generator", category: "ai" },
  { id: "riddle", icon: "🧩", label: "Riddles", category: "ai" },
  { id: "truth_dare", icon: "🎯", label: "Truth or Dare", category: "ai" },
  { id: "roleplay", icon: "🎭", label: "Character Roleplay", category: "ai" },
  { id: "would_you", icon: "🤔", label: "Would You Rather", category: "ai" },
  { id: "meditation", icon: "🧘", label: "Meditation Guide", category: "ai" },
  { id: "first_aid", icon: "🩺", label: "First Aid Guide", category: "ai" },
  { id: "symptom", icon: "🌡️", label: "Symptom Checker", category: "ai" },
  // Life
  { id: "todo", icon: "✅", label: "Todo List", category: "life" },
  { id: "notes", icon: "📓", label: "Notes & Diary", category: "life" },
  { id: "habit", icon: "💪", label: "Habit Tracker", category: "life" },
  { id: "budget", icon: "💰", label: "Budget", category: "life" },
  { id: "shopping", icon: "🛒", label: "Shopping List", category: "life" },
  { id: "mood", icon: "😊", label: "Mood Tracker", category: "life" },
  { id: "water", icon: "💧", label: "Water Tracker", category: "life" },
  { id: "sleep", icon: "😴", label: "Sleep Tracker", category: "life" },
  { id: "workout", icon: "🏋️", label: "Workout Log", category: "life" },
  { id: "gratitude", icon: "🙏", label: "Gratitude Log", category: "life" },
  { id: "journal", icon: "📔", label: "AI Journal", category: "life" },
  { id: "reading", icon: "📚", label: "Reading List", category: "life" },
  { id: "goals", icon: "🎯", label: "Goal Tracker", category: "life" },
  { id: "vocab", icon: "🔤", label: "Vocabulary Builder", category: "life" },
  { id: "flashcard", icon: "🃏", label: "Flashcards", category: "life" },
  { id: "quiz_gen", icon: "🧠", label: "Quiz Generator", category: "life" },
  { id: "trivia", icon: "🎮", label: "Trivia Game", category: "life" },
  { id: "running_log", icon: "🏃", label: "Running Log", category: "life" },
  { id: "diet_plan", icon: "🥦", label: "Diet Planner", category: "life" },
  { id: "workout_gen", icon: "💪", label: "Workout Generator", category: "life" },
  { id: "period", icon: "📅", label: "Period Tracker", category: "life" },
  { id: "medicine", icon: "💊", label: "Medicine Log", category: "life" },
  { id: "links", icon: "🔗", label: "Link Saver", category: "life" },
  { id: "countdown", icon: "📆", label: "Event Countdown", category: "life" },
  // Tools
  { id: "timer", icon: "⏱️", label: "Pomodoro", category: "tools" },
  { id: "stopwatch", icon: "🏁", label: "Stopwatch", category: "tools" },
  { id: "password", icon: "🔐", label: "Password Gen", category: "tools" },
  { id: "converter", icon: "🔄", label: "Unit Converter", category: "tools" },
  { id: "bmi", icon: "⚖️", label: "BMI Calculator", category: "tools" },
  { id: "age_calc", icon: "🎂", label: "Age Calculator", category: "tools" },
  { id: "tip_calc", icon: "💵", label: "Tip Calculator", category: "tools" },
  { id: "loan_calc", icon: "🏦", label: "Loan Calculator", category: "tools" },
  { id: "sip_calc", icon: "📈", label: "SIP Calculator", category: "tools" },
  { id: "fuel_calc", icon: "🚗", label: "Fuel Cost Calc", category: "tools" },
  { id: "dice", icon: "🎲", label: "Dice Roller", category: "tools" },
  { id: "coin", icon: "🪙", label: "Coin Flip", category: "tools" },
  { id: "color_palette", icon: "🎨", label: "Color Palette", category: "tools" },
  { id: "invoice_gen", icon: "🧾", label: "Invoice Generator", category: "tools" },
  { id: "mindmap", icon: "🗺️", label: "Mind Map", category: "tools" },
];

// ============ UI COMPONENTS ============
function ParticleBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      color: ["#00F5FF","#BF00FF","#FF4500","#00FF88"][Math.floor(Math.random()*4)],
      alpha: Math.random() * 0.4 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      });
      ctx.globalAlpha = 1; raf = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />;
}

function GlowBtn({ children, onClick, color=C.cyan, small, style={}, active, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: active?`${color}22`:"transparent", border:`1px solid ${active?color:C.border}`,
      color: active?color:C.muted, borderRadius:8, padding:small?"4px 10px":"8px 18px",
      fontSize:small?12:13, cursor:disabled?"not-allowed":"pointer", transition:"all 0.2s",
      fontFamily:"monospace", letterSpacing:0.5, opacity:disabled?0.5:1, ...style,
    }}
      onMouseEnter={e=>{ if(!disabled){e.currentTarget.style.borderColor=color;e.currentTarget.style.color=color;e.currentTarget.style.boxShadow=`0 0 12px ${color}44`;} }}
      onMouseLeave={e=>{ if(!active){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;e.currentTarget.style.boxShadow="none";} }}
    >{children}</button>
  );
}

function Inp({ value, onChange, placeholder, onKeyDown, type="text", style={} }) {
  return <input value={value} onChange={onChange} onKeyDown={onKeyDown} type={type} placeholder={placeholder}
    style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none", fontFamily:"monospace", ...style }} />;
}

// ============ CHAT ============
const ChatPanel = ({ personality }) => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "calc(100vh - 60px)", // Top nav bar ki height minus karke
      position: "relative",
      background: "#0a0a0a" 
    }}>
      
      {/* Messages Area (Scrollable) */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "20px" 
      }}>
        {/* Messages yahan aayenge */}
        <div style={{ color: "#888", textAlign: "center", marginTop: "20px" }}>
          🔥 Shadow_X AI online! Kya scene hai bhai? 😎
        </div>
      </div>

      {/* FIXED TYPE BAR (Bottom Section) */}
      <div style={{ 
        padding: "15px", 
        background: "#121212", 
        borderTop: "1px solid #2a2a2a",
        display: "flex", 
        gap: "10px",
        alignItems: "center"
      }}>
        <input 
          placeholder="Kuch bhi bol..." 
          style={{ 
            flex: 1, 
            padding: "12px 15px", 
            borderRadius: "8px", 
            background: "#0a0a0a", 
            color: "#ececec", 
            border: "1px solid #2a2a2a" 
          }}
        />
        <button style={{ 
          padding: "10px 15px", 
          background: "linear-gradient(45deg, #00d4ff, #8a2be2)", 
          border: "none", 
          borderRadius: "8px", 
          cursor: "pointer" 
        }}>⚡</button>
      </div>
    </div>
  );
};


function ChatPanel({ personality }) {
  const [messages, setMessages] = useStorage("chat_msgs", [{ role:"assistant", content:"🔥 Shadow_X AI online! Sambanova powered! Kya scene hai bhai? 😎", time:"now" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [uploadedImg, setUploadedImg] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  const send = async () => {
    if (!input.trim() && !uploadedImg) return;
    const t = new Date().toLocaleTimeString();
    const userMsg = { role:"user", content:input||"Analyze this image", time:t, image:uploadedImg };
    setMessages(p=>[...p,userMsg]); setInput(""); setUploadedImg(null); setLoading(true);
    try {
      if (imageMode && !uploadedImg) {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(input)}?width=512&height=512&nologo=true&seed=${Date.now()}`;
        setMessages(p=>[...p,{ role:"assistant", content:`🎨 Image ready!`, image:url, time:new Date().toLocaleTimeString() }]);
      } else {
        const sys = `${PERSONALITY_PROMPTS[personality]||PERSONALITY_PROMPTS.bakchodi}\nTu Shadow_X AI hai. Hinglish ya jo bhi language user use kare usme reply kar.`;
        const reply = await callAI(input, sys);
        setMessages(p=>[...p,{ role:"assistant", content:reply, time:new Date().toLocaleTimeString() }]);
      }
    } catch { setMessages(p=>[...p,{ role:"assistant", content:"⚠️ Error! Network check karo bhai.", time:new Date().toLocaleTimeString() }]); }
    setLoading(false);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
        <GlowBtn small active={!imageMode} onClick={()=>setImageMode(false)} color={C.cyan}>💬 Chat</GlowBtn>
        <GlowBtn small active={imageMode} onClick={()=>setImageMode(true)} color={C.violet}>🎨 Image</GlowBtn>
        <GlowBtn small onClick={()=>fileRef.current?.click()} color={C.ember}>📎 Upload</GlowBtn>
        <GlowBtn small onClick={()=>setMessages([{ role:"assistant", content:"🔥 Fresh start!", time:"now" }])} color={C.muted}>🗑️ Clear</GlowBtn>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setUploadedImg(ev.target.result); r.readAsDataURL(f); }} />
      </div>
      <div style={{ flex:1, overflowY:"auto", paddingBottom:8 }}>
        {messages.map((m,i)=><ChatBubble key={i} msg={m} />)}
        {loading && <div style={{ display:"flex", gap:6, padding:8, alignItems:"center" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.violet},${C.cyan})`, display:"flex", alignItems:"center", justifyContent:"center" }}>🔥</div>
          {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.cyan, animation:"bounce 1s infinite", animationDelay:`${i*0.2}s` }} />)}
        </div>}
        <div ref={bottomRef} />
      </div>
      {uploadedImg && <img src={uploadedImg} alt="up" style={{ height:50, borderRadius:6, marginBottom:6, border:`1px solid ${C.cyan}` }} />}
      <div style={{ display:"flex", gap:8 }}>
        <Inp value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={imageMode?"🎨 Image describe karo...":"💬 Kuch bhi bol..."} style={{ flex:1 }} />
        <button onClick={send} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:10, padding:"10px 18px", color:"#000", fontWeight:"bold", cursor:"pointer", fontSize:16 }}>⚡</button>
      </div>
    </div>
  );
}

function AITool({ title, icon, placeholder, systemPrompt, buttonLabel="Generate ✨", multiInput=false, inputs=[] }) {
  const [vals, setVals] = useState(inputs.reduce((a,i)=>({...a,[i.key]:""}),{ main:"" }));
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    setLoading(true);
    try {
      const prompt = multiInput ? inputs.map(i=>`${i.label}: ${vals[i.key]}`).join("\n") : vals.main;
      setResult(await callAI(prompt, systemPrompt));
    } catch { setResult("Error aa gaya bhai! 😅"); }
    setLoading(false);
  };
  return (
    <div>
      <div style={{ color:C.cyan, fontWeight:"bold", fontSize:16, marginBottom:16 }}>{icon} {title}</div>
      {multiInput ? inputs.map(i=>(
        <div key={i.key} style={{ marginBottom:10 }}>
          <div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>{i.label}</div>
          <Inp value={vals[i.key]} onChange={e=>setVals(p=>({...p,[i.key]:e.target.value}))} placeholder={i.placeholder} style={{ width:"100%" }} />
        </div>
      )) : (
        <textarea value={vals.main} onChange={e=>setVals(p=>({...p,main:e.target.value}))} placeholder={placeholder}
          style={{ width:"100%", minHeight:80, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"monospace", marginBottom:10 }} />
      )}
      <button onClick={generate} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:12, color:"#000", fontWeight:"bold", cursor:"pointer", marginBottom:14 }}>
        {loading?"⏳ Generating...":buttonLabel}
      </button>
      {result && <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, color:C.text, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{result}</div>}
    </div>
  );
}

// ============ LIFE PANELS ============
function TodoPanel() {
  const [todos, setTodos] = useStorage("todos", []);
  const [input, setInput] = useState(""); const [priority, setPriority] = useState("normal"); const [filter, setFilter] = useState("all");
  const add = () => { if(!input.trim())return; setTodos(p=>[...p,{ id:Date.now(), text:input, done:false, priority, created:new Date().toLocaleDateString() }]); setInput(""); };
  const filtered = todos.filter(t=>filter==="all"?true:filter==="done"?t.done:!t.done);
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
        {["all","pending","done"].map(f=><GlowBtn key={f} small active={filter===f} onClick={()=>setFilter(f)} color={C.cyan}>{f}</GlowBtn>)}
        <span style={{ marginLeft:"auto", color:C.muted, fontSize:11, alignSelf:"center" }}>{todos.filter(t=>!t.done).length} pending</span>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <Inp value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Naya task..." style={{ flex:1, minWidth:150 }} />
        <select value={priority} onChange={e=>setPriority(e.target.value)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px", color:C.text, fontSize:12 }}>
          <option value="low">🟢 Low</option><option value="normal">🟡 Normal</option><option value="high">🔴 High</option>
        </select>
        <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 16px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
      </div>
      {filtered.map(t=>(
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${t.priority==="high"?C.ember+"44":C.border}`, borderRadius:8, marginBottom:7, opacity:t.done?0.5:1 }}>
          <div onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${t.done?C.green:C.muted}`, background:t.done?C.green+"44":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {t.done&&<span style={{ color:C.green, fontSize:11 }}>✓</span>}
          </div>
          <span style={{ flex:1, color:C.text, fontSize:13, textDecoration:t.done?"line-through":"none" }}>{t.text}</span>
          <span style={{ fontSize:12 }}>{t.priority==="high"?"🔴":t.priority==="low"?"🟢":"🟡"}</span>
          <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer" }}>✕</button>
        </div>
      ))}
      {filtered.length===0&&<div style={{ textAlign:"center", color:C.muted, padding:40 }}>✅ Koi task nahi! Mast zindagi.</div>}
    </div>
  );
}

function NotesPanel() {
  const [notes, setNotes] = useStorage("notes",[]);
  const [active, setActive] = useState(null); const [title, setTitle] = useState(""); const [content, setContent] = useState("");
  const COLS=[C.cyan,C.violet,C.ember,C.green,C.yellow];
  const save=()=>{ if(!title.trim())return; if(active!==null)setNotes(p=>p.map((n,i)=>i===active?{...n,title,content,updated:new Date().toLocaleString()}:n)); else setNotes(p=>[...p,{title,content,created:new Date().toLocaleString(),updated:new Date().toLocaleString(),color:COLS[Math.floor(Math.random()*5)]}]); setTitle("");setContent("");setActive(null); };
  return (
    <div style={{ display:"flex", gap:12, height:"100%" }}>
      <div style={{ width:155, flexShrink:0 }}>
        <button onClick={()=>{setTitle("");setContent("");setActive(null);}} style={{ width:"100%", background:`linear-gradient(135deg,${C.cyan}22,${C.violet}22)`, border:`1px solid ${C.cyan}`, borderRadius:8, padding:8, color:C.cyan, cursor:"pointer", marginBottom:10, fontSize:12 }}>+ Naya Note</button>
        {notes.map((n,i)=>(
          <div key={i} onClick={()=>{setActive(i);setTitle(n.title);setContent(n.content);}} style={{ padding:"8px 10px", background:active===i?C.border:C.card, border:`1px solid ${active===i?n.color:C.border}`, borderLeft:`3px solid ${n.color}`, borderRadius:6, marginBottom:6, cursor:"pointer" }}>
            <div style={{ color:C.text, fontSize:12, fontWeight:"bold", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{n.title}</div>
            <div style={{ color:C.muted, fontSize:10 }}>{n.updated}</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
        <Inp value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title..." style={{ fontWeight:"bold", fontSize:14 }} />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Apni baat likho..." style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", resize:"none", lineHeight:1.7, fontFamily:"monospace" }} />
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={save} style={{ flex:1, background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:10, color:"#000", fontWeight:"bold", cursor:"pointer" }}>💾 Save</button>
          {active!==null&&<button onClick={()=>{setNotes(p=>p.filter((_,i)=>i!==active));setTitle("");setContent("");setActive(null);}} style={{ background:C.ember+"22", border:`1px solid ${C.ember}`, borderRadius:8, padding:"10px 16px", color:C.ember, cursor:"pointer" }}>🗑️</button>}
        </div>
      </div>
    </div>
  );
}

function HabitPanel() {
  const [habits, setHabits] = useStorage("habits",[]);
  const [input, setInput] = useState("");
  const today = new Date().toDateString();
  const EMOJIS=["💪","🧘","📚","🏃","💧","😴","🥗","🎯","✍️","🎸"];
  const add=()=>{if(!input.trim())return;setHabits(p=>[...p,{id:Date.now(),name:input,streak:0,done:{},emoji:EMOJIS[Math.floor(Math.random()*10)]}]);setInput("");};
  const toggle=(id)=>setHabits(p=>p.map(h=>h.id!==id?h:{...h,done:{...h.done,[today]:!h.done[today]},streak:h.done[today]?Math.max(0,h.streak-1):h.streak+1}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:10, padding:12, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11 }}>Today</div>
          <div style={{ color:C.cyan, fontSize:24, fontWeight:"bold" }}>{habits.filter(h=>h.done[today]).length}/{habits.length}</div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.yellow}44`, borderRadius:10, padding:12, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11 }}>Best Streak</div>
          <div style={{ color:C.yellow, fontSize:24, fontWeight:"bold" }}>🔥{Math.max(0,...habits.map(h=>h.streak),0)}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <Inp value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Naya habit..." style={{ flex:1 }} />
        <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 16px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
      </div>
      {habits.map(h=>(
        <div key={h.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.card, border:`1px solid ${h.done[today]?C.green+"44":C.border}`, borderRadius:10, marginBottom:8 }}>
          <span style={{ fontSize:24 }}>{h.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:14, fontWeight:"bold" }}>{h.name}</div>
            <div style={{ color:C.yellow, fontSize:11 }}>🔥{h.streak} day streak</div>
          </div>
          <div onClick={()=>toggle(h.id)} style={{ width:44, height:24, borderRadius:12, background:h.done[today]?C.green:C.border, cursor:"pointer", transition:"all 0.3s", position:"relative" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:h.done[today]?23:3, transition:"all 0.3s" }} />
          </div>
          <button onClick={()=>setHabits(p=>p.filter(x=>x.id!==h.id))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function BudgetPanel() {
  const [txns, setTxns] = useStorage("budget",[]);
  const [amount, setAmount] = useState(""); const [desc, setDesc] = useState(""); const [type, setType] = useState("expense");
  const add=()=>{if(!amount||!desc)return;setTxns(p=>[...p,{id:Date.now(),amount:parseFloat(amount),desc,type,date:new Date().toLocaleDateString()}]);setAmount("");setDesc("");};
  const income=txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense=txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        {[{l:"Income",v:income,c:C.green},{l:"Expense",v:expense,c:C.ember},{l:"Balance",v:income-expense,c:income-expense>=0?C.cyan:C.ember}].map(s=>(
          <div key={s.l} style={{ background:C.card, border:`1px solid ${s.c}44`, borderRadius:10, padding:12, textAlign:"center" }}>
            <div style={{ color:C.muted, fontSize:11 }}>{s.l}</div>
            <div style={{ color:s.c, fontSize:18, fontWeight:"bold" }}>₹{s.v.toFixed(0)}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <Inp value={amount} onChange={e=>setAmount(e.target.value)} placeholder="₹ Amount" type="number" style={{ width:100 }} />
        <Inp value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" style={{ flex:1, minWidth:100 }} />
        <select value={type} onChange={e=>setType(e.target.value)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:8, color:C.text, fontSize:12 }}>
          <option value="income">💚 Income</option><option value="expense">🔴 Expense</option>
        </select>
        <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
      </div>
      {txns.slice().reverse().slice(0,20).map(t=>(
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6 }}>
          <span>{t.type==="income"?"💚":"🔴"}</span>
          <span style={{ flex:1, color:C.text, fontSize:13 }}>{t.desc}</span>
          <span style={{ color:t.type==="income"?C.green:C.ember, fontWeight:"bold" }}>{t.type==="income"?"+":"-"}₹{t.amount}</span>
          <button onClick={()=>setTxns(p=>p.filter(x=>x.id!==t.id))} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function ShoppingPanel() {
  const [items, setItems] = useStorage("shopping",[]);
  const [input, setInput] = useState(""); const [qty, setQty] = useState("1");
  const add=()=>{if(!input.trim())return;setItems(p=>[...p,{id:Date.now(),name:input,qty,done:false}]);setInput("");setQty("1");};
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <Inp value={qty} onChange={e=>setQty(e.target.value)} placeholder="Qty" type="number" style={{ width:60 }} />
        <Inp value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Item naam..." style={{ flex:1 }} />
        <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, color:C.muted, fontSize:12 }}>
        <span>{items.filter(i=>!i.done).length} items remaining</span>
        <button onClick={()=>setItems(p=>p.filter(i=>!i.done))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer", fontSize:12 }}>Clear done</button>
      </div>
      {items.map(item=>(
        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6, opacity:item.done?0.5:1 }}>
          <div onClick={()=>setItems(p=>p.map(x=>x.id===item.id?{...x,done:!x.done}:x))} style={{ width:20, height:20, borderRadius:4, border:`2px solid ${item.done?C.green:C.muted}`, background:item.done?C.green+"44":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {item.done&&<span style={{ color:C.green, fontSize:11 }}>✓</span>}
          </div>
          <span style={{ color:C.cyan, fontSize:12, minWidth:24 }}>×{item.qty}</span>
          <span style={{ flex:1, color:C.text, textDecoration:item.done?"line-through":"none" }}>{item.name}</span>
          <button onClick={()=>setItems(p=>p.filter(x=>x.id!==item.id))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function MoodPanel() {
  const [moods, setMoods] = useStorage("moods",[]);
  const [note, setNote] = useState("");
  const MOOD_LIST=[{emoji:"😄",label:"Mast",color:C.green},{emoji:"😊",label:"Theek",color:C.cyan},{emoji:"😐",label:"Normal",color:C.yellow},{emoji:"😔",label:"Sad",color:C.violet},{emoji:"😡",label:"Gussa",color:C.ember}];
  const log=(m)=>{setMoods(p=>[...p,{id:Date.now(),mood:m.label,emoji:m.emoji,note,date:new Date().toLocaleString()}]);setNote("");};
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ color:C.cyan, fontWeight:"bold", marginBottom:14 }}>Aaj kaisa feel ho raha hai? 🧠</div>
        <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          {MOOD_LIST.map(m=>(
            <button key={m.label} onClick={()=>log(m)} style={{ background:C.card, border:`1px solid ${m.color}44`, borderRadius:12, padding:"12px 16px", cursor:"pointer", textAlign:"center" }}>
              <div style={{ fontSize:28 }}>{m.emoji}</div>
              <div style={{ color:m.color, fontSize:11, marginTop:4 }}>{m.label}</div>
            </button>
          ))}
        </div>
        <Inp value={note} onChange={e=>setNote(e.target.value)} placeholder="Kuch note? (optional)" style={{ width:"100%", marginTop:14 }} />
      </div>
      {moods.slice().reverse().slice(0,10).map(m=>(
        <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6 }}>
          <span style={{ fontSize:22 }}>{m.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:13 }}>{m.mood} {m.note&&`— ${m.note}`}</div>
            <div style={{ color:C.muted, fontSize:10 }}>{m.date}</div>
          </div>
          <button onClick={()=>setMoods(p=>p.filter(x=>x.id!==m.id))} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function WaterPanel() {
  const [log, setLog] = useStorage("water",[]);
  const today=new Date().toDateString();
  const todayTotal=log.filter(e=>e.date===today).reduce((s,e)=>s+e.amount,0);
  const goal=2500; const pct=Math.min(100,Math.round((todayTotal/goal)*100));
  const add=(ml)=>setLog(p=>[...p,{id:Date.now(),amount:ml,date:today,time:new Date().toLocaleTimeString()}]);
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:60 }}>💧</div>
        <div style={{ color:C.cyan, fontSize:36, fontWeight:"bold" }}>{todayTotal}ml</div>
        <div style={{ color:C.muted, fontSize:13 }}>Goal: {goal}ml ({pct}%)</div>
      </div>
      <div style={{ height:12, background:C.border, borderRadius:6, marginBottom:20, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${C.cyan},#0080FF)`, borderRadius:6, transition:"width 0.5s" }} />
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
        {[150,200,250,300,500].map(ml=>(
          <button key={ml} onClick={()=>add(ml)} style={{ background:`${C.cyan}22`, border:`1px solid ${C.cyan}44`, borderRadius:8, padding:"8px 14px", color:C.cyan, cursor:"pointer", fontSize:13 }}>+{ml}ml</button>
        ))}
      </div>
    </div>
  );
}

function SleepPanel() {
  const [logs, setLogs] = useStorage("sleep",[]);
  const [bedtime, setBedtime] = useState(""); const [wakeup, setWakeup] = useState(""); const [quality, setQuality] = useState(3);
  const add=()=>{
    if(!bedtime||!wakeup)return;
    const b=new Date(`2000-01-01 ${bedtime}`); let w=new Date(`2000-01-01 ${wakeup}`);
    if(w<b)w=new Date(`2000-01-02 ${wakeup}`);
    const hrs=((w-b)/3600000).toFixed(1);
    setLogs(p=>[...p,{id:Date.now(),bedtime,wakeup,hrs,quality,date:new Date().toLocaleDateString()}]);
  };
  const avg=logs.length?(logs.reduce((s,l)=>s+parseFloat(l.hrs),0)/logs.length).toFixed(1):0;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.violet}44`, borderRadius:10, padding:12, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11 }}>Avg Sleep</div>
          <div style={{ color:C.violet, fontSize:24, fontWeight:"bold" }}>{avg}h</div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:10, padding:12, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11 }}>Logs</div>
          <div style={{ color:C.cyan, fontSize:24, fontWeight:"bold" }}>{logs.length}</div>
        </div>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:14 }}>
        <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
          <div style={{ flex:1 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>😴 Bedtime</div><Inp value={bedtime} onChange={e=>setBedtime(e.target.value)} type="time" style={{ width:"100%" }} /></div>
          <div style={{ flex:1 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>☀️ Wakeup</div><Inp value={wakeup} onChange={e=>setWakeup(e.target.value)} type="time" style={{ width:"100%" }} /></div>
        </div>
        <div style={{ marginBottom:10 }}>
          <div style={{ color:C.muted, fontSize:11, marginBottom:6 }}>Quality: {"⭐".repeat(quality)}</div>
          <input type="range" min="1" max="5" value={quality} onChange={e=>setQuality(Number(e.target.value))} style={{ width:"100%", accentColor:C.cyan }} />
        </div>
        <button onClick={add} style={{ width:"100%", background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:10, color:"#000", fontWeight:"bold", cursor:"pointer" }}>+ Log Sleep</button>
      </div>
      {logs.slice().reverse().slice(0,7).map(l=>(
        <div key={l.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6 }}>
          <span>😴</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:13 }}>{l.hrs}h • {l.bedtime}→{l.wakeup}</div>
            <div style={{ color:C.muted, fontSize:10 }}>{"⭐".repeat(l.quality)} • {l.date}</div>
          </div>
          <button onClick={()=>setLogs(p=>p.filter(x=>x.id!==l.id))} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function WorkoutPanel() {
  const [logs, setLogs] = useStorage("workout",[]);
  const [exercise, setExercise] = useState(""); const [sets, setSets] = useState(""); const [reps, setReps] = useState(""); const [weight, setWeight] = useState("");
  const add=()=>{ if(!exercise)return; setLogs(p=>[...p,{id:Date.now(),exercise,sets,reps,weight,date:new Date().toLocaleDateString()}]); setExercise("");setSets("");setReps("");setWeight(""); };
  return (
    <div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:14 }}>
        <Inp value={exercise} onChange={e=>setExercise(e.target.value)} placeholder="Exercise naam" style={{ width:"100%", marginBottom:10 }} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Inp value={sets} onChange={e=>setSets(e.target.value)} placeholder="Sets" type="number" style={{ flex:1, minWidth:60 }} />
          <Inp value={reps} onChange={e=>setReps(e.target.value)} placeholder="Reps" type="number" style={{ flex:1, minWidth:60 }} />
          <Inp value={weight} onChange={e=>setWeight(e.target.value)} placeholder="kg" type="number" style={{ flex:1, minWidth:60 }} />
          <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
        </div>
      </div>
      {logs.slice().reverse().slice(0,15).map(l=>(
        <div key={l.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6 }}>
          <span>🏋️</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:13, fontWeight:"bold" }}>{l.exercise}</div>
            <div style={{ color:C.muted, fontSize:11 }}>{l.sets&&`${l.sets} sets`}{l.reps&&` × ${l.reps}`}{l.weight&&` @ ${l.weight}kg`} • {l.date}</div>
          </div>
          <button onClick={()=>setLogs(p=>p.filter(x=>x.id!==l.id))} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function GratitudePanel() {
  const [entries, setEntries] = useStorage("gratitude",[]);
  const [text, setText] = useState("");
  const add=()=>{ if(!text.trim())return; setEntries(p=>[...p,{id:Date.now(),text,date:new Date().toLocaleString()}]); setText(""); };
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:16 }}><div style={{ fontSize:40 }}>🙏</div><div style={{ color:C.cyan, fontSize:14, marginTop:6 }}>Aaj ke liye thankful hoon...</div></div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Aaj kya achha hua?" style={{ width:"100%", minHeight:80, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"monospace", marginBottom:10 }} />
      <button onClick={add} style={{ width:"100%", background:`linear-gradient(135deg,${C.green},${C.cyan})`, border:"none", borderRadius:8, padding:12, color:"#000", fontWeight:"bold", cursor:"pointer", marginBottom:14 }}>🙏 Log</button>
      {entries.slice().reverse().map(e=>(
        <div key={e.id} style={{ padding:"12px 14px", background:C.card, border:`1px solid ${C.green}44`, borderLeft:`3px solid ${C.green}`, borderRadius:8, marginBottom:8 }}>
          <div style={{ color:C.text, fontSize:13 }}>"{e.text}"</div>
          <div style={{ color:C.muted, fontSize:10, marginTop:6 }}>{e.date}</div>
        </div>
      ))}
    </div>
  );
}

function MedicinePanel() {
  const [meds, setMeds] = useStorage("medicine",[]);
  const [name, setName] = useState(""); const [time, setTime] = useState(""); const [dose, setDose] = useState("");
  const today=new Date().toDateString();
  const add=()=>{ if(!name||!time)return; setMeds(p=>[...p,{id:Date.now(),name,time,dose,taken:{}}]); setName("");setTime("");setDose(""); };
  const toggle=(id)=>setMeds(p=>p.map(m=>m.id!==id?m:{...m,taken:{...m.taken,[today]:!m.taken[today]}}));
  return (
    <div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:14 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Inp value={name} onChange={e=>setName(e.target.value)} placeholder="Medicine naam" style={{ flex:2, minWidth:120 }} />
          <Inp value={dose} onChange={e=>setDose(e.target.value)} placeholder="Dose (mg)" style={{ flex:1, minWidth:80 }} />
          <Inp value={time} onChange={e=>setTime(e.target.value)} type="time" style={{ flex:1, minWidth:90 }} />
          <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
        </div>
      </div>
      {meds.map(m=>(
        <div key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.card, border:`1px solid ${m.taken[today]?C.green+"44":C.border}`, borderRadius:10, marginBottom:8 }}>
          <span style={{ fontSize:22 }}>💊</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontWeight:"bold" }}>{m.name} {m.dose&&`(${m.dose}mg)`}</div>
            <div style={{ color:C.muted, fontSize:11 }}>⏰ {m.time}</div>
          </div>
          <div onClick={()=>toggle(m.id)} style={{ padding:"4px 12px", background:m.taken[today]?C.green+"22":"transparent", border:`1px solid ${m.taken[today]?C.green:C.border}`, borderRadius:8, color:m.taken[today]?C.green:C.muted, cursor:"pointer", fontSize:12 }}>{m.taken[today]?"✓ Taken":"Take"}</div>
          <button onClick={()=>setMeds(p=>p.filter(x=>x.id!==m.id))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function PeriodPanel() {
  const [logs, setLogs] = useStorage("period",[]);
  const [startDate, setStartDate] = useState(""); const [endDate, setEndDate] = useState("");
  const add=()=>{ if(!startDate)return; setLogs(p=>[...p,{id:Date.now(),start:startDate,end:endDate,date:new Date().toLocaleDateString()}]); setStartDate("");setEndDate(""); };
  const lastLog=logs.length?logs[logs.length-1]:null;
  const nextPeriod=lastLog?new Date(new Date(lastLog.start).getTime()+28*24*60*60*1000):null;
  const daysLeft=nextPeriod?Math.ceil((nextPeriod-new Date())/86400000):null;
  return (
    <div>
      {nextPeriod && (
        <div style={{ background:C.card, border:`1px solid ${C.pink}44`, borderRadius:12, padding:16, marginBottom:16, textAlign:"center" }}>
          <div style={{ color:C.pink, fontSize:13 }}>Next Period (est.)</div>
          <div style={{ color:C.text, fontSize:22, fontWeight:"bold", marginTop:4 }}>{nextPeriod.toLocaleDateString()}</div>
          <div style={{ color:daysLeft<=3?C.ember:C.muted, fontSize:13, marginTop:4 }}>{daysLeft>0?`${daysLeft} din baki`:"Aaj ya kisi din bhi!"}</div>
        </div>
      )}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:14 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <div style={{ flex:1 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Start Date</div><Inp value={startDate} onChange={e=>setStartDate(e.target.value)} type="date" style={{ width:"100%" }} /></div>
          <div style={{ flex:1 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>End Date</div><Inp value={endDate} onChange={e=>setEndDate(e.target.value)} type="date" style={{ width:"100%" }} /></div>
        </div>
        <button onClick={add} style={{ width:"100%", background:`linear-gradient(135deg,${C.pink},${C.violet})`, border:"none", borderRadius:8, padding:10, color:"#000", fontWeight:"bold", cursor:"pointer", marginTop:10 }}>+ Log Period</button>
      </div>
      {logs.slice().reverse().map(l=>(
        <div key={l.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6 }}>
          <span>🌸</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:13 }}>{l.start} {l.end&&`→ ${l.end}`}</div>
          </div>
          <button onClick={()=>setLogs(p=>p.filter(x=>x.id!==l.id))} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function RunningPanel() {
  const [logs, setLogs] = useStorage("running",[]);
  const [km, setKm] = useState(""); const [mins, setMins] = useState(""); const [note, setNote] = useState("");
  const add=()=>{ if(!km)return; setLogs(p=>[...p,{id:Date.now(),km:parseFloat(km),mins:parseInt(mins)||0,note,date:new Date().toLocaleDateString()}]); setKm("");setMins("");setNote(""); };
  const totalKm=logs.reduce((s,l)=>s+l.km,0);
  const pace=logs.length&&logs[logs.length-1].mins?(logs[logs.length-1].mins/logs[logs.length-1].km).toFixed(1):"—";
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.green}44`, borderRadius:10, padding:12, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11 }}>Total KM</div>
          <div style={{ color:C.green, fontSize:24, fontWeight:"bold" }}>🏃{totalKm.toFixed(1)}</div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:10, padding:12, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:11 }}>Last Pace</div>
          <div style={{ color:C.cyan, fontSize:24, fontWeight:"bold" }}>{pace} min/km</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <Inp value={km} onChange={e=>setKm(e.target.value)} placeholder="KM" type="number" style={{ flex:1, minWidth:70 }} />
        <Inp value={mins} onChange={e=>setMins(e.target.value)} placeholder="Minutes" type="number" style={{ flex:1, minWidth:80 }} />
        <Inp value={note} onChange={e=>setNote(e.target.value)} placeholder="Note (opt)" style={{ flex:2, minWidth:100 }} />
        <button onClick={add} style={{ background:`linear-gradient(135deg,${C.green},${C.cyan})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
      </div>
      {logs.slice().reverse().slice(0,10).map(l=>(
        <div key={l.id} style={{ display:"flex", gap:10, padding:"10px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6 }}>
          <span>🏃</span>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:13 }}>{l.km}km {l.mins&&`in ${l.mins} mins`}</div>
            <div style={{ color:C.muted, fontSize:11 }}>{l.note} • {l.date}</div>
          </div>
          <button onClick={()=>setLogs(p=>p.filter(x=>x.id!==l.id))} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function CountdownPanel() {
  const [events, setEvents] = useStorage("countdowns",[]);
  const [name, setName] = useState(""); const [date, setDate] = useState("");
  const add=()=>{ if(!name||!date)return; setEvents(p=>[...p,{id:Date.now(),name,date}]); setName("");setDate(""); };
  const getDays=(d)=>Math.ceil((new Date(d)-new Date())/86400000);
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <Inp value={name} onChange={e=>setName(e.target.value)} placeholder="Event naam..." style={{ flex:2, minWidth:120 }} />
        <Inp value={date} onChange={e=>setDate(e.target.value)} type="date" style={{ flex:1, minWidth:120 }} />
        <button onClick={add} style={{ background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#000", fontWeight:"bold", cursor:"pointer" }}>+</button>
      </div>
      {events.map(e=>{
        const d=getDays(e.date);
        return (
          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.card, border:`1px solid ${d<=7?C.ember+"44":C.border}`, borderRadius:10, marginBottom:8 }}>
            <div style={{ textAlign:"center", minWidth:50 }}>
              <div style={{ color:d<=0?C.ember:d<=7?C.yellow:C.cyan, fontSize:26, fontWeight:"bold" }}>{d<=0?"🎉":d}</div>
              {d>0&&<div style={{ color:C.muted, fontSize:9 }}>days</div>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:C.text, fontWeight:"bold" }}>{e.name}</div>
              <div style={{ color:C.muted, fontSize:11 }}>{e.date}</div>
            </div>
            <button onClick={()=>setEvents(p=>p.filter(x=>x.id!==e.id))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer" }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

// ============ TOOLS ============
function PomodoroPanel() {
  const [mins, setMins] = useState(25); const [secs, setSecs] = useState(0); const [running, setRunning] = useState(false); const [mode, setMode] = useState("work"); const [cycles, setCycles] = useState(0);
  const intervalRef=useRef(null);
  const MODES={ work:{label:"💼 Work",time:25,color:C.ember}, short:{label:"☕ Break",time:5,color:C.green}, long:{label:"🌴 Long",time:15,color:C.cyan} };
  useEffect(()=>{
    if(running){intervalRef.current=setInterval(()=>{ setSecs(s=>{ if(s>0)return s-1; setMins(m=>{ if(m>0)return m-1; setRunning(false);setCycles(c=>c+1);return 0; });return 59; }); },1000);}
    else clearInterval(intervalRef.current);
    return()=>clearInterval(intervalRef.current);
  },[running]);
  const setMode2=(m)=>{setMode(m);setMins(MODES[m].time);setSecs(0);setRunning(false);};
  const total=MODES[mode].time*60; const elapsed=(MODES[mode].time-mins)*60+(60-secs); const pct=Math.min(100,(elapsed/total)*100);
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20, flexWrap:"wrap" }}>
        {Object.entries(MODES).map(([k,v])=><GlowBtn key={k} small active={mode===k} onClick={()=>setMode2(k)} color={v.color}>{v.label}</GlowBtn>)}
      </div>
      <div style={{ width:160, height:160, margin:"0 auto 20px", position:"relative" }}>
        <svg viewBox="0 0 100 100" style={{ transform:"rotate(-90deg)", width:"100%", height:"100%" }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke={C.border} strokeWidth="8" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={MODES[mode].color} strokeWidth="8" strokeDasharray={`${2*Math.PI*45}`} strokeDashoffset={`${2*Math.PI*45*(1-pct/100)}`} style={{ transition:"stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ color:MODES[mode].color, fontSize:32, fontWeight:"bold", fontFamily:"monospace" }}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
          <div style={{ color:C.muted, fontSize:11 }}>{cycles} cycles</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button onClick={()=>setRunning(r=>!r)} style={{ background:running?C.ember+"22":`linear-gradient(135deg,${C.cyan},${C.violet})`, border:`1px solid ${running?C.ember:C.cyan}`, borderRadius:10, padding:"10px 28px", color:running?C.ember:"#000", fontWeight:"bold", cursor:"pointer" }}>{running?"⏸ Pause":"▶ Start"}</button>
        <button onClick={()=>{setMins(MODES[mode].time);setSecs(0);setRunning(false);}} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 16px", color:C.muted, cursor:"pointer" }}>↺</button>
      </div>
    </div>
  );
}

function StopwatchPanel() {
  const [time, setTime] = useState(0); const [running, setRunning] = useState(false); const [laps, setLaps] = useState([]);
  const ref=useRef(null);
  useEffect(()=>{ if(running)ref.current=setInterval(()=>setTime(t=>t+10),10); else clearInterval(ref.current); return()=>clearInterval(ref.current); },[running]);
  const fmt=(ms)=>{ const m=Math.floor(ms/60000),s=Math.floor((ms%60000)/1000),cs=Math.floor((ms%1000)/10); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`; };
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ color:C.cyan, fontSize:48, fontWeight:"bold", fontFamily:"monospace", marginBottom:20 }}>{fmt(time)}</div>
      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:20 }}>
        <button onClick={()=>setRunning(r=>!r)} style={{ background:running?C.ember+"22":`linear-gradient(135deg,${C.cyan},${C.violet})`, border:`1px solid ${running?C.ember:C.cyan}`, borderRadius:10, padding:"10px 24px", color:running?C.ember:"#000", fontWeight:"bold", cursor:"pointer" }}>{running?"⏸ Pause":"▶ Start"}</button>
        <button onClick={()=>{if(running)setLaps(l=>[...l,{id:Date.now(),t:time,n:l.length+1}]);}} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.muted, cursor:"pointer" }}>🏁 Lap</button>
        <button onClick={()=>{setTime(0);setRunning(false);setLaps([]);}} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.muted, cursor:"pointer" }}>↺</button>
      </div>
      <div style={{ maxHeight:180, overflowY:"auto" }}>
        {laps.slice().reverse().map(l=>(
          <div key={l.id} style={{ display:"flex", justifyContent:"space-between", padding:"6px 12px", background:C.card, borderRadius:6, marginBottom:4 }}>
            <span style={{ color:C.muted, fontSize:12 }}>Lap {l.n}</span>
            <span style={{ color:C.cyan, fontFamily:"monospace", fontSize:12 }}>{fmt(l.t)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PasswordPanel() {
  const [len, setLen] = useState(16); const [opts, setOpts] = useState({upper:true,lower:true,nums:true,symbols:true}); const [pass, setPass] = useState(""); const [copied, setCopied] = useState(false);
  const gen=()=>{ let chars=""; if(opts.upper)chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ"; if(opts.lower)chars+="abcdefghijklmnopqrstuvwxyz"; if(opts.nums)chars+="0123456789"; if(opts.symbols)chars+="!@#$%^&*()_+-=[]{}|;:,.<>?"; if(!chars)return; setPass(Array.from({length:len},()=>chars[Math.floor(Math.random()*chars.length)]).join("")); setCopied(false); };
  const copy=()=>{ navigator.clipboard.writeText(pass); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const strength=[opts.upper,opts.lower,opts.nums,opts.symbols].filter(Boolean).length;
  const sCols=["",C.ember,C.yellow,C.cyan,C.green]; const sLabs=["","Weak 😬","Fair 😐","Good 👍","Strong 💪"];
  return (
    <div>
      <div style={{ marginBottom:14 }}><div style={{ color:C.muted, fontSize:11, marginBottom:6 }}>Length: {len}</div><input type="range" min="8" max="32" value={len} onChange={e=>setLen(Number(e.target.value))} style={{ width:"100%", accentColor:C.cyan }} /></div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {[["upper","A-Z"],["lower","a-z"],["nums","0-9"],["symbols","!@#"]].map(([k,l])=><GlowBtn key={k} small active={opts[k]} onClick={()=>setOpts(o=>({...o,[k]:!o[k]}))} color={C.cyan}>{l}</GlowBtn>)}
      </div>
      {strength>0&&<div style={{ display:"flex", gap:4, marginBottom:14 }}>
        {[1,2,3,4].map(i=><div key={i} style={{ flex:1, height:4, borderRadius:2, background:i<=strength?sCols[strength]:C.border }} />)}
        <span style={{ color:sCols[strength], fontSize:11, marginLeft:8, whiteSpace:"nowrap" }}>{sLabs[strength]}</span>
      </div>}
      <button onClick={gen} style={{ width:"100%", background:`linear-gradient(135deg,${C.cyan},${C.violet})`, border:"none", borderRadius:8, padding:12, color:"#000", fontWeight:"bold", cursor:"pointer", marginBottom:14 }}>🔐 Generate</button>
      {pass&&<div onClick={copy} style={{ background:C.card, border:`1px solid ${copied?C.green:C.border}`, borderRadius:10, padding:16, cursor:"pointer", textAlign:"center" }}>
        <div style={{ color:C.text, fontFamily:"monospace", fontSize:14, wordBreak:"break-all", marginBottom:8 }}>{pass}</div>
        <div style={{ color:copied?C.green:C.muted, fontSize:12 }}>{copied?"✓ Copied!":"Click to copy"}</div>
      </div>}
    </div>
  );
}

function ConverterPanel() {
  const [type, setType] = useState("length"); const [from, setFrom] = useState(""); const [fromUnit, setFromUnit] = useState(""); const [toUnit, setToUnit] = useState("");
  const UNITS={ length:{units:["m","km","cm","mm","inch","ft","mile"],base:{m:1,km:1000,cm:0.01,mm:0.001,inch:0.0254,ft:0.3048,mile:1609.34}}, weight:{units:["kg","g","lb","oz","ton"],base:{kg:1,g:0.001,lb:0.453592,oz:0.0283495,ton:1000}}, temp:{units:["C","F","K"],special:true}, speed:{units:["km/h","m/s","mph","knot"],base:{"km/h":1,"m/s":3.6,"mph":1.60934,"knot":1.852}} };
  const curr=UNITS[type];
  const convert=()=>{ if(!from||!fromUnit||!toUnit)return ""; const v=parseFloat(from); if(isNaN(v))return ""; if(type==="temp"){ let c=fromUnit==="F"?(v-32)*5/9:fromUnit==="K"?v-273.15:v; return toUnit==="F"?(c*9/5+32).toFixed(4):toUnit==="K"?(c+273.15).toFixed(4):c.toFixed(4); } return ((v*curr.base[fromUnit])/curr.base[toUnit]).toFixed(6); };
  useEffect(()=>{ if(curr?.units?.length){setFromUnit(curr.units[0]);setToUnit(curr.units[1]);} },[type]);
  return (
    <div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
        {Object.keys(UNITS).map(t=><GlowBtn key={t} small active={type===t} onClick={()=>setType(t)} color={C.cyan}>{t}</GlowBtn>)}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"flex-end" }}>
        <div style={{ flex:1 }}>
          <div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>From</div>
          <Inp value={from} onChange={e=>setFrom(e.target.value)} type="number" placeholder="Value" style={{ width:"100%", marginBottom:6 }} />
          <select value={fromUnit} onChange={e=>setFromUnit(e.target.value)} style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:8, color:C.text, fontSize:12 }}>
            {curr?.units?.map(u=><option key={u}>{u}</option>)}
          </select>
        </div>
        <div style={{ color:C.cyan, fontSize:20, paddingBottom:8 }}>→</div>
        <div style={{ flex:1 }}>
          <div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>To</div>
          <div style={{ padding:"8px 12px", background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:8, color:C.cyan, fontWeight:"bold", marginBottom:6, minHeight:37 }}>{convert()||"—"}</div>
          <select value={toUnit} onChange={e=>setToUnit(e.target.value)} style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:8, color:C.text, fontSize:12 }}>
            {curr?.units?.map(u=><option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function BMIPanel() {
  const [height, setHeight] = useState(""); const [weight, setWeight] = useState("");
  const bmi=height&&weight?(weight/((height/100)**2)).toFixed(1):null;
  const getC=(b)=>{ if(b<18.5)return{label:"Underweight 😟",color:C.cyan}; if(b<25)return{label:"Normal 😊",color:C.green}; if(b<30)return{label:"Overweight ⚠️",color:C.yellow}; return{label:"Obese 🚨",color:C.ember}; };
  const cat=bmi?getC(parseFloat(bmi)):null;
  return (
    <div>
      <div style={{ textAlign:"center", fontSize:36, marginBottom:20 }}>⚖️</div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <div style={{ flex:1 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Height (cm)</div><Inp value={height} onChange={e=>setHeight(e.target.value)} type="number" placeholder="170" style={{ width:"100%" }} /></div>
        <div style={{ flex:1 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Weight (kg)</div><Inp value={weight} onChange={e=>setWeight(e.target.value)} type="number" placeholder="70" style={{ width:"100%" }} /></div>
      </div>
      {bmi&&cat&&<div style={{ background:C.card, border:`1px solid ${cat.color}44`, borderRadius:12, padding:20, textAlign:"center" }}>
        <div style={{ color:cat.color, fontSize:48, fontWeight:"bold" }}>{bmi}</div>
        <div style={{ color:cat.color, fontSize:16, marginTop:6 }}>{cat.label}</div>
        <div style={{ color:C.muted, fontSize:11, marginTop:8 }}>Normal: 18.5–24.9</div>
      </div>}
    </div>
  );
}

function AgePanel() {
  const [dob, setDob] = useState("");
  const calc=()=>{ if(!dob)return null; const b=new Date(dob),now=new Date(); let y=now.getFullYear()-b.getFullYear(),m=now.getMonth()-b.getMonth(),d=now.getDate()-b.getDate(); if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate();} if(m<0){y--;m+=12;} const days=Math.floor((now-b)/86400000); const next=new Date(now.getFullYear()+(now>new Date(now.getFullYear(),b.getMonth(),b.getDate())?1:0),b.getMonth(),b.getDate()); return{y,m,d,days,daysLeft:Math.floor((next-now)/86400000)}; };
  const r=calc();
  return (
    <div>
      <div style={{ textAlign:"center", fontSize:36, marginBottom:20 }}>🎂</div>
      <div style={{ marginBottom:16 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Date of Birth</div><Inp value={dob} onChange={e=>setDob(e.target.value)} type="date" style={{ width:"100%" }} /></div>
      {r&&<div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:12, padding:16 }}>
        <div style={{ textAlign:"center", marginBottom:14 }}>
          <div style={{ color:C.cyan, fontSize:42, fontWeight:"bold" }}>{r.y}</div>
          <div style={{ color:C.muted, fontSize:13 }}>years old</div>
        </div>
        {[{l:"Months",v:r.m},{l:"Days (extra)",v:r.d},{l:"Total days alive",v:r.days.toLocaleString()},{l:"Days to birthday 🎉",v:r.daysLeft}].map(i=>(
          <div key={i.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:C.muted, fontSize:13 }}>{i.l}</span>
            <span style={{ color:C.text, fontWeight:"bold" }}>{i.v}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

function TipPanel() {
  const [bill, setBill] = useState(""); const [tip, setTip] = useState(15); const [people, setPeople] = useState(1);
  const tipAmt=bill?(parseFloat(bill)*tip/100).toFixed(2):0;
  const total=bill?(parseFloat(bill)+parseFloat(tipAmt)).toFixed(2):0;
  const perPerson=people>1?(parseFloat(total)/people).toFixed(2):total;
  return (
    <div>
      <div style={{ textAlign:"center", fontSize:36, marginBottom:20 }}>💵</div>
      <div style={{ marginBottom:12 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Bill Amount (₹)</div><Inp value={bill} onChange={e=>setBill(e.target.value)} type="number" placeholder="500" style={{ width:"100%" }} /></div>
      <div style={{ marginBottom:12 }}><div style={{ color:C.muted, fontSize:11, marginBottom:6 }}>Tip: {tip}%</div><div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{[5,10,15,18,20,25].map(t=><GlowBtn key={t} small active={tip===t} onClick={()=>setTip(t)} color={C.cyan}>{t}%</GlowBtn>)}</div></div>
      <div style={{ marginBottom:16 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Split</div><div style={{ display:"flex", gap:8, alignItems:"center" }}><button onClick={()=>setPeople(p=>Math.max(1,p-1))} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 14px", color:C.text, cursor:"pointer" }}>-</button><span style={{ color:C.cyan, fontWeight:"bold", minWidth:30, textAlign:"center" }}>{people}</span><button onClick={()=>setPeople(p=>p+1)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 14px", color:C.text, cursor:"pointer" }}>+</button></div></div>
      {bill&&<div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:12, padding:16 }}>
        {[{l:"Tip",v:`₹${tipAmt}`},{l:"Total",v:`₹${total}`},{l:`Per Person (${people})`,v:`₹${perPerson}`}].map(r=>(
          <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ color:C.muted, fontSize:13 }}>{r.l}</span><span style={{ color:C.cyan, fontWeight:"bold" }}>{r.v}</span></div>
        ))}
      </div>}
    </div>
  );
}

function LoanPanel() {
  const [p, setP] = useState(""); const [r, setR] = useState(""); const [y, setY] = useState("");
  const calc=()=>{ const pr=parseFloat(p),rate=parseFloat(r)/12/100,n=parseFloat(y)*12; if(!pr||!rate||!n)return null; const emi=(pr*rate*Math.pow(1+rate,n))/(Math.pow(1+rate,n)-1); return{emi:emi.toFixed(0),total:(emi*n).toFixed(0),interest:(emi*n-pr).toFixed(0)}; };
  const res=calc();
  return (
    <div>
      <div style={{ textAlign:"center", fontSize:36, marginBottom:20 }}>🏦</div>
      {[{label:"Loan Amount (₹)",val:p,set:setP,ph:"500000"},{label:"Interest Rate (%/yr)",val:r,set:setR,ph:"8.5"},{label:"Period (years)",val:y,set:setY,ph:"5"}].map(f=>(
        <div key={f.label} style={{ marginBottom:12 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>{f.label}</div><Inp value={f.val} onChange={e=>f.set(e.target.value)} type="number" placeholder={f.ph} style={{ width:"100%" }} /></div>
      ))}
      {res&&<div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:12, padding:16 }}>
        {[{l:"Monthly EMI",v:`₹${res.emi}`,c:C.cyan},{l:"Total Amount",v:`₹${res.total}`,c:C.text},{l:"Total Interest",v:`₹${res.interest}`,c:C.ember}].map(r=>(
          <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><span style={{ color:C.muted, fontSize:13 }}>{r.l}</span><span style={{ color:r.c, fontWeight:"bold" }}>{r.v}</span></div>
        ))}
      </div>}
    </div>
  );
}

function SIPPanel() {
  const [monthly, setMonthly] = useState(""); const [rate, setRate] = useState(""); const [years, setYears] = useState("");
  const calc=()=>{ const m=parseFloat(monthly),r=parseFloat(rate)/12/100,n=parseFloat(years)*12; if(!m||!r||!n)return null; const fv=m*((Math.pow(1+r,n)-1)/r)*(1+r); return{fv:fv.toFixed(0),invested:(m*n).toFixed(0),returns:(fv-m*n).toFixed(0)}; };
  const res=calc();
  return (
    <div>
      <div style={{ textAlign:"center", fontSize:36, marginBottom:20 }}>📈</div>
      {[{label:"Monthly SIP (₹)",val:monthly,set:setMonthly,ph:"5000"},{label:"Expected Return (%/yr)",val:rate,set:setRate,ph:"12"},{label:"Period (years)",val:years,set:setYears,ph:"10"}].map(f=>(
        <div key={f.label} style={{ marginBottom:12 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>{f.label}</div><Inp value={f.val} onChange={e=>f.set(e.target.value)} type="number" placeholder={f.ph} style={{ width:"100%" }} /></div>
      ))}
      {res&&<div style={{ background:C.card, border:`1px solid ${C.green}44`, borderRadius:12, padding:16 }}>
        {[{l:"Total Invested",v:`₹${parseInt(res.invested).toLocaleString()}`,c:C.text},{l:"Expected Returns",v:`₹${parseInt(res.returns).toLocaleString()}`,c:C.green},{l:"Total Value 🎉",v:`₹${parseInt(res.fv).toLocaleString()}`,c:C.cyan}].map(r=>(
          <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><span style={{ color:C.muted, fontSize:13 }}>{r.l}</span><span style={{ color:r.c, fontWeight:"bold" }}>{r.v}</span></div>
        ))}
      </div>}
    </div>
  );
}

function FuelPanel() {
  const [dist, setDist] = useState(""); const [mileage, setMileage] = useState(""); const [price, setPrice] = useState("");
  const liters=dist&&mileage?(parseFloat(dist)/parseFloat(mileage)).toFixed(2):null;
  const cost=liters&&price?(parseFloat(liters)*parseFloat(price)).toFixed(2):null;
  return (
    <div>
      <div style={{ textAlign:"center", fontSize:36, marginBottom:20 }}>🚗</div>
      {[{label:"Distance (km)",val:dist,set:setDist,ph:"100"},{label:"Mileage (km/l)",val:mileage,set:setMileage,ph:"15"},{label:"Fuel Price (₹/l)",val:price,set:setPrice,ph:"100"}].map(f=>(
        <div key={f.label} style={{ marginBottom:12 }}><div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>{f.label}</div><Inp value={f.val} onChange={e=>f.set(e.target.value)} type="number" placeholder={f.ph} style={{ width:"100%" }} /></div>
      ))}
      {liters&&<div style={{ background:C.card, border:`1px solid ${C.orange}44`, borderRadius:12, padding:16 }}>
        {[{l:"Fuel Needed",v:`${liters} L`,c:C.orange},{l:"Total Cost",v:`₹${cost||"—"}`,c:C.cyan}].map(r=>(
          <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><span style={{ color:C.muted, fontSize:13 }}>{r.l}</span><span style={{ color:r.c, fontWeight:"bold", fontSize:18 }}>{r.v}</span></div>
        ))}
      </div>}
    </div>
  );
}

function DicePanel() {
  const [sides, setSides] = useState(6); const [count, setCount] = useState(1); const [dice, setDice] = useState([]);
  const roll=()=>setDice(Array.from({length:count},()=>Math.floor(Math.random()*sides)+1));
  const total=dice.reduce((s,d)=>s+d,0);
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:16, flexWrap:"wrap" }}>
        {[4,6,8,10,12,20,100].map(s=><GlowBtn key={s} small active={sides===s} onClick={()=>setSides(s)} color={C.violet}>d{s}</GlowBtn>)}
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center", marginBottom:16 }}>
        <button onClick={()=>setCount(c=>Math.max(1,c-1))} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"4px 12px", color:C.text, cursor:"pointer" }}>-</button>
        <span style={{ color:C.cyan, fontWeight:"bold", minWidth:30 }}>{count}</span>
        <button onClick={()=>setCount(c=>Math.min(10,c+1))} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"4px 12px", color:C.text, cursor:"pointer" }}>+</button>
      </div>
      <button onClick={roll} style={{ background:`linear-gradient(135deg,${C.violet},${C.cyan})`, border:"none", borderRadius:10, padding:"14px 36px", color:"#000", fontWeight:"bold", cursor:"pointer", fontSize:16, marginBottom:20 }}>🎲 Roll!</button>
      {dice.length>0&&<>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:12 }}>
          {dice.map((d,i)=><div key={i} style={{ width:52, height:52, background:C.card, border:`2px solid ${C.violet}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:C.violet, fontSize:22, fontWeight:"bold" }}>{d}</div>)}
        </div>
        {count>1&&<div style={{ color:C.cyan, fontSize:18, fontWeight:"bold" }}>Total: {total}</div>}
      </>}
    </div>
  );
}

function CoinPanel() {
  const [result, setResult] = useState(null); const [flipping, setFlipping] = useState(false); const [history, setHistory] = useState([]);
  const flip=()=>{ setFlipping(true); setTimeout(()=>{ const r=Math.random()>0.5?"HEADS":"TAILS"; setResult(r);setFlipping(false); setHistory(h=>[{id:Date.now(),r},...h].slice(0,10)); },800); };
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ width:120, height:120, margin:"0 auto 20px", borderRadius:"50%", background:result==="HEADS"?`linear-gradient(135deg,${C.yellow},#FFA500)`:`linear-gradient(135deg,${C.muted},${C.border})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:60, transition:"all 0.3s", transform:flipping?"rotateY(180deg)":"rotateY(0deg)" }}>
        {flipping?"🌀":result==="HEADS"?"👑":"🦅"}
      </div>
      {result&&<div style={{ color:result==="HEADS"?C.yellow:C.muted, fontSize:24, fontWeight:"bold", marginBottom:16 }}>{result}!</div>}
      <button onClick={flip} disabled={flipping} style={{ background:`linear-gradient(135deg,${C.yellow},#FFA500)`, border:"none", borderRadius:10, padding:"12px 32px", color:"#000", fontWeight:"bold", cursor:"pointer", fontSize:15, marginBottom:20 }}>🪙 Flip!</button>
      {history.length>0&&<div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" }}>
        {history.map(h=><span key={h.id} style={{ fontSize:18 }}>{h.r==="HEADS"?"👑":"🦅"}</span>)}
      </div>}
    </div>
  );
}

function InvoicePanel() {
  const [client, setClient] = useState(""); const [items, setItems] = useState([{desc:"",qty:1,price:""}]); const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const addItem=()=>setItems(p=>[...p,{desc:"",qty:1,price:""}]);
  const updateItem=(i,k,v)=>setItems(p=>p.map((item,idx)=>idx===i?{...item,[k]:v}:item));
  const total=items.reduce((s,i)=>s+(parseFloat(i.price)||0)*i.qty,0);
  return (
    <div>
      <div style={{ color:C.cyan, fontWeight:"bold", fontSize:16, marginBottom:16 }}>🧾 Invoice Generator</div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <Inp value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} placeholder="Invoice No" style={{ flex:1 }} />
        <Inp value={client} onChange={e=>setClient(e.target.value)} placeholder="Client naam" style={{ flex:2 }} />
      </div>
      {items.map((item,i)=>(
        <div key={i} style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
          <Inp value={item.desc} onChange={e=>updateItem(i,"desc",e.target.value)} placeholder="Description" style={{ flex:3, minWidth:120 }} />
          <Inp value={item.qty} onChange={e=>updateItem(i,"qty",e.target.value)} type="number" placeholder="Qty" style={{ flex:1, minWidth:50 }} />
          <Inp value={item.price} onChange={e=>updateItem(i,"price",e.target.value)} type="number" placeholder="₹" style={{ flex:1, minWidth:70 }} />
          <button onClick={()=>setItems(p=>p.filter((_,idx)=>idx!==i))} style={{ background:"transparent", border:"none", color:C.ember, cursor:"pointer" }}>✕</button>
        </div>
      ))}
      <button onClick={addItem} style={{ background:`${C.cyan}22`, border:`1px solid ${C.cyan}44`, borderRadius:8, padding:"8px 16px", color:C.cyan, cursor:"pointer", fontSize:13, marginBottom:14 }}>+ Add Item</button>
      <div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:10, padding:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:C.muted }}>Invoice #</span><span style={{ color:C.text }}>{invoiceNo}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:C.muted }}>Client</span><span style={{ color:C.text }}>{client||"—"}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:C.muted }}>Date</span><span style={{ color:C.text }}>{new Date().toLocaleDateString()}</span></div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, display:"flex", justifyContent:"space-between" }}><span style={{ color:C.cyan, fontWeight:"bold", fontSize:16 }}>Total</span><span style={{ color:C.cyan, fontWeight:"bold", fontSize:18 }}>₹{total.toFixed(2)}</span></div>
      </div>
    </div>
  );
}

// ============ RENDER PANEL ============
function renderPanel(id, personality) {
  const AI=(sys,ph,btn,icon,title)=><AITool title={title} icon={icon} placeholder={ph} systemPrompt={sys} buttonLabel={btn} />;
  switch(id) {
    case "chat": return <ChatPanel personality={personality} />;
    case "image_gen": return AI("Generate detailed artistic image descriptions based on user prompts.","Image describe karo...","🎨 Generate","🎨","Image Generator");
    case "translator": return AI("Tu expert translator hai. Text ko requested language mein translate karo. Language bhi detect karo automatically. Hinglish ok.","Text aur target language batao (e.g. Hindi to English)...","🌐 Translate","🌐","Translator");
    case "summarizer": return AI("Tu expert summarizer hai. Long text ko concise, clear points mein summarize karo. Hinglish ok.","Text ya article paste karo...","📝 Summarize","📝","Summarizer");
    case "math": return AI("Tu math genius hai. Step by step solve karo, clearly explain karo. Hinglish mein.","Math problem likho...","🧮 Solve","🧮","Math Solver");
    case "code_gen": return AI("Tu senior developer hai. Clean, well-commented code likho. Language specify karo user ke liye.","Code kya chahiye? Language bhi batao...","💻 Generate Code","💻","Code Generator");
    case "code_explain": return AI("Tu expert debugger hai. Code review karo, bugs find karo, fixes suggest karo. Hinglish mein.","Buggy code paste karo...","🐛 Fix Bugs","🐛","Bug Fixer");
    case "resume": return AI("Tu expert resume writer hai. ATS-friendly professional resume content generate karo.","Apne baare mein batao (skills, experience, education)...","📄 Build Resume","📄","Resume Builder");
    case "cover_letter": return AI("Tu expert cover letter writer hai. Professional, personalized cover letter likho.","Job role aur apne background batao...","💼 Write Letter","💼","Cover Letter");
    case "essay": return AI("Tu expert academic writer hai. Well-structured essay likho with intro, body, conclusion.","Essay topic likho...","✍️ Write Essay","✍️","Essay Writer");
    case "email_draft": return AI("Tu professional email writer hai. Clear, concise, polite email draft karo. Tone match karo.","Email ka purpose aur context batao...","💌 Draft Email","💌","Email Draft");
    case "whatsapp_gen": return AI("Tu WhatsApp message expert hai. Casual, effective messages likho. Emojis use karo. Hinglish ok.","Message ka purpose aur receiver batao...","📱 Generate Msg","📱","WhatsApp Message");
    case "reply_suggest": return AI("Tu communication expert hai. 3 different reply options do for given situation. Hinglish ok.","Situation describe karo ya message paste karo...","💬 Suggest Replies","💬","Reply Suggester");
    case "story_gen": return AI("Tu creative storyteller hai. Engaging story with plot twists likho. Hinglish ok.","Genre aur topic batao (horror/romance/comedy/thriller)...","📖 Generate Story","📖","Story Generator");
    case "script_writer": return AI("Tu professional scriptwriter hai. Screenplay format mein script likho.","Scene ya story idea batao...","🎬 Write Script","🎬","Script Writer");
    case "poetry_gen": return AI("Tu renowned poet hai. Beautiful, meaningful poetry likho requested style mein. Hindi/Urdu/English.","Topic aur style batao (haiku/sonnet/free verse/ghazal)...","🌸 Write Poem","🌸","Poetry Generator");
    case "lyrics_writer": return AI("Tu hit songwriter hai. Catchy lyrics likho with chorus, verses, bridge. Hinglish ok.","Song genre aur theme batao...","🎵 Write Lyrics","🎵","Lyrics Writer");
    case "shayari": return AI("Tu desi rapper aur shayar hai! Hinglish mein fire bars aur shayari likho with rhymes! 🎤🔥","Topic batao (mohabbat/dard/dosti/life)...","🎤 Generate","🎤","Rap / Shayari");
    case "roast_gen": return AI("Tu savage roast master hai! Playfully roast karo, funny rakhna. Hinglish mein! 🔥😂","Apne baare mein kuch batao...","🔥 Roast Karo!","🔥","Roast Me!");
    case "fortune": return AI("Tu mystical fortune teller hai. Dramatic aur interesting fortune batao! 🔮✨","Apna naam aur DOB batao...","🔮 Tell My Fortune","🔮","Fortune Teller");
    case "pickup": return AI("Funny aur creative pickup lines generate karo Hinglish mein! 😂💘","Target ka vibe batao (funny/romantic/cheesy)...","💘 Generate Lines","💘","Pickup Lines");
    case "excuse": return AI("Creative aur believable excuses generate karo Hinglish mein! 🤥😅","Kiske liye excuse chahiye? (boss/gf/parents)...","🤥 Generate Excuse","🤥","Excuse Generator");
    case "debate": return AI("Tu professional debater hai. Strong arguments dono sides ke do, logical. Hinglish ok.","Topic batao...","⚔️ Start Debate","⚔️","Debate Mode");
    case "interview": return AI("Tu HR expert hai. Common interview Q&A generate karo. Hinglish ok.","Job role aur company batao...","🎙️ Prep Me","🎙️","Interview Prep");
    case "business_idea": return AI("Tu successful entrepreneur hai. Innovative business ideas with market analysis do. Hinglish ok.","Industry ya interest batao...","💡 Generate Ideas","💡","Business Ideas");
    case "startup_name": return AI("Tu creative branding expert hai. Catchy, memorable startup names suggest karo with reasoning.","Business type aur vibe batao...","🚀 Name It","🚀","Startup Names");
    case "recipe_gen": return AI("Tu master chef hai. Detailed recipe with ingredients aur steps do. Hinglish ok.","Ingredients ya dish naam batao...","🍽️ Get Recipe","🍽️","Recipe Generator");
    case "gift_idea": return AI("Tu gifting expert hai. Creative, thoughtful gift ideas suggest karo with budget.","Person aur occasion batao, budget bhi...","🎁 Ideas Do","🎁","Gift Ideas");
    case "trip_planner": return AI("Tu travel expert hai. Detailed day-by-day trip itinerary banao with budget tips. Hinglish ok.","Destination aur duration batao...","✈️ Plan Trip","✈️","Trip Planner");
    case "caption_gen": return AI("Tu social media expert hai. Viral-worthy captions generate karo with hashtags. Hinglish ok.","Photo/post describe karo...","📸 Generate","📸","Caption Generator");
    case "horoscope": return AI("Tu mystical astrologer hai. Today's horoscope batao for all zodiac signs ya specific one. Dramatic! 🌙✨","Zodiac sign batao (ya 'all signs')...","🌙 Read Stars","🌙","Daily Horoscope");
    case "logo_idea": return AI("Tu creative design director hai. Logo concepts, colors, typography suggestions do with rationale.","Brand name aur industry batao...","🎨 Design Ideas","🎨","Logo Ideas");
    case "joke_gen": return AI("Tu stand-up comedian hai! Funny, clean jokes generate karo. Hinglish ok. 😂","Category batao (dad jokes/dark/desi/pun)...","🤣 Make Me Laugh","🤣","Joke Generator");
    case "riddle": return AI("Tu riddle master hai! Interesting riddles with answers do. Easy to hard. Hinglish ok. 🧩","Difficulty batao (easy/medium/hard) aur count...","🧩 Give Riddles","🧩","Riddles");
    case "truth_dare": return AI("Tu party game master hai! Fun truth questions aur dares generate karo. Hinglish ok! 🎯","Group type batao (friends/couple/office) aur level (mild/spicy)...","🎯 Generate","🎯","Truth or Dare");
    case "roleplay": return AI("Tu creative roleplay partner hai. User ke chosen character ke saath engaging roleplay karo. Hinglish ok.","Character aur scenario batao...","🎭 Start Roleplay","🎭","Character Roleplay");
    case "would_you": return AI("Interesting 'Would You Rather' questions generate karo with both options clearly! Hinglish mein 😂","Theme batao (fun/dark/career/weird)...","🤔 Generate","🤔","Would You Rather");
    case "meditation": return AI("Tu mindfulness expert hai. Calming guided meditation script likho. Soothing tone rakhna. Hinglish ok.","Mood batao (stressed/anxious/angry/tired)...","🧘 Start Guide","🧘","Meditation Guide");
    case "first_aid": return AI("Tu medical expert hai. Clear first aid instructions do for given situation. Always recommend doctor too. Hinglish ok.","Emergency ya situation describe karo...","🩺 Get Guide","🩺","First Aid Guide");
    case "symptom": return AI("Tu health advisor hai. Symptoms analyze karo aur possible causes batao. ALWAYS recommend seeing a real doctor! Hinglish ok.","Symptoms describe karo...","🌡️ Check","🌡️","Symptom Checker");
    case "goals": return AI("Tu life coach hai. SMART goals aur action plan banao. Motivating! Hinglish ok.","Goal describe karo...","🎯 Plan Goal","🎯","Goal Tracker");
    case "vocab": return AI("Tu English teacher hai. New words, meanings, examples, usage do. Engaging way mein. Hinglish ok.","Topic ya words batao (ya 'random')...","🔤 Learn Words","🔤","Vocabulary Builder");
    case "flashcard": return AI("10 Q&A flashcards create karo is topic pe. Clear aur concise! Hinglish ok.","Topic batao...","🃏 Make Cards","🃏","Flashcards");
    case "quiz_gen": return AI("5 MCQ quiz questions create karo with answers. Engaging! Hinglish ok.","Topic aur difficulty batao...","🧠 Generate Quiz","🧠","Quiz Generator");
    case "trivia": return AI("5 interesting trivia questions with answers generate karo! Hinglish ok 🎮","Category batao (Science/History/Bollywood/Cricket)...","🎮 Generate","🎮","Trivia Game");
    case "diet_plan": return AI("Tu nutritionist hai. Personalized diet plan do with meal suggestions. Hinglish ok.","Goal, age, weight, dietary restrictions batao...","🥦 Make Plan","🥦","Diet Planner");
    case "workout_gen": return AI("Tu personal trainer hai. Custom workout plan do based on goals. Hinglish ok.","Goal, fitness level, equipment batao...","💪 Make Plan","💪","Workout Generator");
    case "journal": return AI("Tu empathetic therapist hai. Feelings validate karo, positive reflection do. Hinglish ok. 💙","Aaj ka din kaisa tha? Dil ki baat batao...","📔 Reflect","📔","AI Journal");
    case "reading": return AI("Top book recommendations do with descriptions. Diverse picks! Hinglish ok 📚","Genre ya topic batao...","📚 Recommend","📚","Reading List");
    case "links": return AI("Link organize karo aur brief summary do. Helpful tags suggest karo! Hinglish ok.","URL aur description paste karo...","🔗 Organize","🔗","Link Saver");
    case "mindmap": return AI("Detailed mind map create karo with main topic, branches aur sub-branches. Text format mein clearly. Hinglish ok.","Topic batao...","🗺️ Create Map","🗺️","Mind Map");
    case "color_palette": return AI("5 color palette suggestions do with hex codes aur usage tips. Creative aur trendy!","Theme batao (website/wedding/logo/room)...","🎨 Generate","🎨","Color Palette");
    case "todo": return <TodoPanel />;
    case "notes": return <NotesPanel />;
    case "habit": return <HabitPanel />;
    case "budget": return <BudgetPanel />;
    case "shopping": return <ShoppingPanel />;
    case "mood": return <MoodPanel />;
    case "water": return <WaterPanel />;
    case "sleep": return <SleepPanel />;
    case "workout": return <WorkoutPanel />;
    case "gratitude": return <GratitudePanel />;
    case "medicine": return <MedicinePanel />;
    case "period": return <PeriodPanel />;
    case "running_log": return <RunningPanel />;
    case "countdown": return <CountdownPanel />;
    case "timer": return <PomodoroPanel />;
    case "stopwatch": return <StopwatchPanel />;
    case "password": return <PasswordPanel />;
    case "converter": return <ConverterPanel />;
    case "bmi": return <BMIPanel />;
    case "age_calc": return <AgePanel />;
    case "tip_calc": return <TipPanel />;
    case "loan_calc": return <LoanPanel />;
    case "sip_calc": return <SIPPanel />;
    case "fuel_calc": return <FuelPanel />;
    case "dice": return <DicePanel />;
    case "coin": return <CoinPanel />;
    case "invoice_gen": return <InvoicePanel />;
    default: return <div style={{ color:C.muted, textAlign:"center", padding:40 }}>🚧 Coming soon bhai!</div>;
  }
}

// ============ MAIN APP ============
export default function App() {
  const [activeFeature, setActiveFeature] = useStorage("activeFeature","chat");
  const [personality, setPersonality] = useStorage("personality","bakchodi");
  const [activeCategory, setActiveCategory] = useState("ai");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const CATS=[{id:"ai",label:"AI",icon:"🤖"},{id:"life",label:"Life",icon:"🌟"},{id:"tools",label:"Tools",icon:"🛠️"}];
  const PERSONALITIES=[{id:"serious",label:"Serious"},{id:"funny",label:"Funny"},{id:"roast",label:"Roast"},{id:"bakchodi",label:"Bakchodi"},{id:"dost",label:"Dost"},{id:"philosopher",label:"Philosopher"},{id:"savage",label:"Savage"}];

  const filtered=FEATURES.filter(f=>{
    if(search)return f.label.toLowerCase().includes(search.toLowerCase());
    return f.category===activeCategory;
  });
  const currFeature=FEATURES.find(f=>f.id===activeFeature);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"monospace", color:C.text, position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        input[type="date"]::-webkit-calendar-picker-indicator,input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
      `}</style>

      <ParticleBg />

      {/* Overlay */}
      {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"#00000080", zIndex:99, backdropFilter:"blur(2px)" }} />}

      {/* SIDEBAR */}
      <div style={{ position:"fixed", left:sidebarOpen?0:-290, top:0, width:270, height:"100vh", background:C.card, borderRight:`1px solid ${C.border}`, zIndex:100, display:"flex", flexDirection:"column", transition:"left 0.3s ease" }}>
        
        {/* Header */}
        <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <div style={{ color:C.cyan, fontWeight:"bold", fontSize:17 }}>🔥 Shadow_X</div>
              <div style={{ color:C.muted, fontSize:10 }}>© Bakchodi Edition • Sambanova AI</div>
            </div>
            <button onClick={()=>setSidebarOpen(false)} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:18, padding:4 }}>✕</button>
          </div>
          {/* Telegram Button */}
          <a href="https://t.me/x_shadwo_c7h" target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, background:`linear-gradient(135deg,#0088cc22,#0088cc44)`, border:`1px solid #0088cc`, borderRadius:8, padding:"8px 12px", color:"#0088cc", textDecoration:"none", fontSize:12, fontWeight:"bold" }}>
            <span style={{ fontSize:16 }}>✈️</span> Join Telegram Channel
          </a>
        </div>

        {/* Search */}
        <div style={{ padding:"8px 10px", borderBottom:`1px solid ${C.border}` }}>
          <Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search features..." style={{ width:"100%", fontSize:12 }} />
        </div>

        {/* Category Tabs */}
        {!search&&<div style={{ display:"flex", padding:"6px 10px", gap:5, borderBottom:`1px solid ${C.border}` }}>
          {CATS.map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} style={{ flex:1, background:activeCategory===cat.id?`${C.cyan}22`:"transparent", border:`1px solid ${activeCategory===cat.id?C.cyan:C.border}`, borderRadius:6, padding:"5px 4px", color:activeCategory===cat.id?C.cyan:C.muted, cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>{cat.icon} {cat.label}</button>
          ))}
        </div>}

        {/* Feature List */}
        <div style={{ flex:1, overflowY:"auto", padding:"6px 8px" }}>
          {search&&<div style={{ color:C.muted, fontSize:10, padding:"4px 6px" }}>{filtered.length} results</div>}
          {filtered.map(f=>(
            <div key={f.id} onClick={()=>{setActiveFeature(f.id);setSidebarOpen(false);setSearch("");}} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:activeFeature===f.id?`${C.cyan}18`:"transparent", border:`1px solid ${activeFeature===f.id?C.cyan+"44":"transparent"}`, borderRadius:8, marginBottom:2, cursor:"pointer", transition:"all 0.15s" }}>
              <span style={{ fontSize:15 }}>{f.icon}</span>
              <span style={{ color:activeFeature===f.id?C.cyan:C.text, fontSize:12, fontWeight:activeFeature===f.id?"bold":"normal" }}>{f.label}</span>
              {search&&<span style={{ marginLeft:"auto", color:C.muted, fontSize:9 }}>{f.category}</span>}
            </div>
          ))}
        </div>

        {/* Personality */}
        <div style={{ padding:"10px 12px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ color:C.muted, fontSize:10, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Personality</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {PERSONALITIES.map(p=>(
              <button key={p.id} onClick={()=>setPersonality(p.id)} style={{ background:personality===p.id?`${C.violet}22`:"transparent", border:`1px solid ${personality===p.id?C.violet:C.border}`, borderRadius:6, padding:"3px 8px", color:personality===p.id?C.violet:C.muted, cursor:"pointer", fontSize:10, fontFamily:"monospace" }}>{p.label}</button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ padding:"8px 12px", borderTop:`1px solid ${C.border}`, textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:9 }}>© Shadow_X_Bakchodi • All Rights Reserved</div>
          <div style={{ color:C.muted, fontSize:9 }}>Unauthorized copying prohibited 🔒</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        {/* Top Bar */}
        <div style={{ position:"sticky", top:0, zIndex:50, background:`${C.bg}ee`, backdropFilter:"blur(10px)", borderBottom:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setSidebarOpen(true)} style={{ background:`${C.cyan}22`, border:`1px solid ${C.cyan}44`, borderRadius:8, padding:"8px 12px", color:C.cyan, cursor:"pointer", fontSize:16 }}>☰</button>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontWeight:"bold", fontSize:14 }}>{currFeature?.icon} {currFeature?.label}</div>
            <div style={{ color:C.muted, fontSize:10 }}>Shadow_X • {personality} mode • {FEATURES.length} features</div>
          </div>
          <a href="https://t.me/x_shadwo_c7h" target="_blank" rel="noreferrer" style={{ background:`#0088cc22`, border:`1px solid #0088cc44`, borderRadius:8, padding:"6px 10px", color:"#0088cc", textDecoration:"none", fontSize:12 }}>✈️</a>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
        </div>

        {/* Panel */}
        <div style={{ flex:1, padding:16, maxWidth:720, width:"100%", margin:"0 auto", zIndex:1, position:"relative" }}>
          {renderPanel(activeFeature, personality)}
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", padding:"10px 16px", borderTop:`1px solid ${C.border}`, color:C.muted, fontSize:10, zIndex:1, position:"relative" }}>
          🔥 Shadow_X_Bakchodi © All Rights Reserved • <a href="https://t.me/x_shadwo_c7h" target="_blank" rel="noreferrer" style={{ color:"#0088cc", textDecoration:"none" }}>t.me/x_shadwo_c7h</a>
        </div>
      </div>
    </div>
  );
}
