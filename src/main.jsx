import React, {useEffect, useMemo, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  Sparkles, Shuffle, Download, Heart, Smartphone, Laptop, Tablet,
  SlidersHorizontal, Copy, RefreshCw, Trash2, Wand2, ImagePlus,
  Library, Share2, Play, Layers3, Settings2, Zap, X, Check,
  ChevronLeft, ChevronRight
} from "lucide-react";
import "./styles.css";

const PRESETS = {
  "Phone HD":[1080,1920],
  "Phone QHD":[1440,2560],
  "Phone 4K":[2160,3840],
  "Laptop FHD":[1920,1200],
  "Laptop QHD":[2560,1600],
  "Laptop 4K":[3840,2400],
  "Desktop 4K":[3840,2160],
  "Tablet":[2048,2732]
};

const PALETTES = [
  ["Midnight","#07111f","#075985","#22d3ee","#dbeafe"],
  ["Violet","#10061c","#6d28d9","#db2777","#f5d0fe"],
  ["Ember","#120806","#9a3412","#f59e0b","#fef3c7"],
  ["Forest","#04130d","#047857","#34d399","#d1fae5"],
  ["Ocean","#03121b","#0369a1","#38bdf8","#e0f2fe"],
  ["Mono","#050505","#27272a","#a1a1aa","#fafafa"],
  ["Sunset","#18070b","#be123c","#fb7185","#fed7aa"],
  ["Ice","#06121c","#334155","#67e8f9","#f8fafc"]
];

const STYLES = [
  "Aurora","Geometry","Orbs","Waves","Particles","Mesh","Nebula","Rings",
  "Liquid","Prism","Constellation","Topography","Bloom","Circuit","Solar",
  "Tunnel","Grid","Comet","Fractal","Minimal"
];

const DEFAULT_CONFIG = {
  preset:"Phone QHD", style:"Aurora", paletteIndex:0, density:14,
  glow:18, grain:1, vignette:.48, seed:"123456789"
};

function makeRng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h,16777619);
  }
  return () => {
    h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
    return (h >>> 0) / 4294967296;
  };
}

function drawWallpaper(canvas, c, quality=1) {
  if (!canvas) return;
  const [W,H] = PRESETS[c.preset] || PRESETS["Phone QHD"];
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const r = makeRng(c.seed);
  const p = PALETTES[c.paletteIndex]?.slice(1) || PALETTES[0].slice(1);
  ctx.clearRect(0,0,W,H);

  let g = ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,p[0]); g.addColorStop(.48,p[1]); g.addColorStop(1,p[0]);
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation="screen";

  const n = Math.max(3, Math.round(c.density * quality));
  const glow = (x,y,rad,color,a=.18) => {
    const q=ctx.createRadialGradient(x,y,0,x,y,rad);
    q.addColorStop(0,color); q.addColorStop(.55,color+"88"); q.addColorStop(1,"transparent");
    ctx.globalAlpha=a; ctx.fillStyle=q; ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill();
  };

  if(["Aurora","Nebula","Bloom"].includes(c.style))
    for(let i=0;i<n;i++) glow(r()*W,r()*H,W*(.05+r()*.3),p[1+i%3],.08+r()*.16);

  if(["Orbs","Solar"].includes(c.style))
    for(let i=0;i<n;i++){
      const x=r()*W,y=r()*H,rad=W*(.01+r()*.1);
      glow(x,y,rad,p[1+i%3],.12+r()*.18);
      ctx.globalAlpha=.45;ctx.strokeStyle=p[3];ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(x,y,rad*.45,0,Math.PI*2);ctx.stroke();
    }

  if(["Geometry","Prism","Grid"].includes(c.style))
    for(let i=0;i<n*2;i++){
      const x=r()*W,y=r()*H,s=W*(.015+r()*.12);
      ctx.save();ctx.translate(x,y);ctx.rotate(r()*Math.PI*2);
      ctx.globalAlpha=.12+r()*.12;ctx.strokeStyle=p[1+i%3];ctx.lineWidth=3+r()*8;
      ctx.strokeRect(-s/2,-s/2,s,s);ctx.restore();
    }

  if(["Waves","Liquid","Topography"].includes(c.style))
    for(let i=0;i<n+8;i++){
      ctx.globalAlpha=.05+r()*.09;ctx.strokeStyle=p[1+i%3];ctx.lineWidth=5+r()*22;
      ctx.beginPath();const y=H*i/(n+8);
      ctx.moveTo(-50,y);
      ctx.bezierCurveTo(W*.25,y-H*(.08+r()*.1),W*.65,y+H*(.08+r()*.1),W+50,y-H*(r()*.05));
      ctx.stroke();
    }

  if(["Particles","Constellation","Comet"].includes(c.style)){
    const pts=[];
    for(let i=0;i<n*10;i++){
      const x=r()*W,y=r()*H,rr=.5+r()*4;pts.push([x,y]);
      ctx.globalAlpha=.2+r()*.7;ctx.fillStyle=p[1+i%3];
      ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fill();
    }
    if(c.style==="Constellation"){
      ctx.globalAlpha=.12;ctx.strokeStyle=p[3];
      for(let i=0;i<pts.length;i+=3){
        const a=pts[i],b=pts[(i+1)%pts.length];
        ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
      }
    }
    if(c.style==="Comet"){
      for(let i=0;i<Math.max(2,n/2);i++){
        const x=r()*W,y=r()*H;ctx.globalAlpha=.1+r()*.15;ctx.strokeStyle=p[2];
        ctx.lineWidth=3+r()*10;ctx.beginPath();ctx.moveTo(x,y);
        ctx.lineTo(x-W*(.08+r()*.2),y-H*(.02+r()*.08));ctx.stroke();
        glow(x,y,W*.025,p[3],.3);
      }
    }
  }

  if(["Rings","Tunnel"].includes(c.style))
    for(let i=0;i<n;i++){
      ctx.globalAlpha=.08+r()*.09;ctx.strokeStyle=p[1+i%3];ctx.lineWidth=4+r()*12;
      ctx.beginPath();ctx.ellipse(W/2,H/2,W*(.03+i/n*.6),H*(.03+i/n*.6),r()*3.14,0,Math.PI*2);ctx.stroke();
    }

  if(c.style==="Circuit"){
    ctx.globalAlpha=.16;ctx.strokeStyle=p[2];ctx.lineWidth=4;
    for(let i=0;i<n;i++){
      const x=r()*W,y=r()*H;ctx.beginPath();ctx.moveTo(x,y);
      ctx.lineTo(x+W*(.04+r()*.18),y);
      ctx.lineTo(x+W*(.04+r()*.18),y+H*(r()-.5)*.25);ctx.stroke();
    }
  }

  if(c.style==="Fractal"){
    for(let i=0;i<n;i++){
      let x=W/2,y=H/2,ang=r()*Math.PI*2;
      ctx.globalAlpha=.08+r()*.1;ctx.strokeStyle=p[1+i%3];ctx.lineWidth=2+r()*8;
      ctx.beginPath();ctx.moveTo(x,y);
      for(let j=0;j<8;j++){
        const d=W*(.015+j*.025);x+=Math.cos(ang)*d;y+=Math.sin(ang)*d;
        ctx.lineTo(x,y);ang+=r()*.9-.45;
      }
      ctx.stroke();
    }
  }

  if(c.style==="Minimal"){
    for(let i=0;i<5;i++){
      const x=W*(.1+r()*.8),y=H*(.1+r()*.8);
      ctx.globalAlpha=.12;ctx.strokeStyle=p[3];ctx.lineWidth=2+r()*8;
      ctx.beginPath();ctx.arc(x,y,W*(.04+r()*.12),0,Math.PI*2);ctx.stroke();
    }
  }

  ctx.globalCompositeOperation="source-over";
  const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.1,W/2,H/2,Math.max(W,H)*.75);
  v.addColorStop(.55,"transparent");v.addColorStop(1,`rgba(0,0,0,${c.vignette})`);
  ctx.fillStyle=v;ctx.globalAlpha=1;ctx.fillRect(0,0,W,H);

  if(c.grain>0){
    const count=Math.floor(6000*c.grain);
    ctx.globalAlpha=.025*c.grain;
    for(let i=0;i<count;i++){
      ctx.fillStyle=r()>.5?"#fff":"#000";ctx.fillRect(r()*W,r()*H,1,1);
    }
  }
  ctx.globalAlpha=1;
}

function hashPrompt(prompt){
  let h=0; for(let i=0;i<prompt.length;i++) h=((h<<5)-h)+prompt.charCodeAt(i)|0;
  return Math.abs(h);
}

function aiDemoConfig(prompt, base) {
  const s=prompt.toLowerCase(), h=hashPrompt(prompt);
  let style="Nebula", paletteIndex=h%PALETTES.length;
  if(/cyber|neon|futur/.test(s)){style="Circuit";paletteIndex=1}
  else if(/ocean|sea|water|blue/.test(s)){style="Waves";paletteIndex=4}
  else if(/forest|nature|green/.test(s)){style="Bloom";paletteIndex=3}
  else if(/sunset|orange|fire/.test(s)){style="Solar";paletteIndex=2}
  else if(/minimal|clean/.test(s)){style="Minimal";paletteIndex=5}
  else if(/space|galaxy|nebula/.test(s)){style="Nebula";paletteIndex=0}
  return {...base,style,paletteIndex,seed:String(h||Date.now()),density:12+(h%15)}
}

function getStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function App(){
  const [mode,setMode]=useState("create");
  const [tab,setTab]=useState("studio");
  const [config,setConfig]=useState(DEFAULT_CONFIG);
  const [prompt,setPrompt]=useState("");
  const [aiProvider,setAiProvider]=useState("demo");
  const [apiEndpoint,setApiEndpoint]=useState("");
  const [favorites,setFavorites]=useState(()=>getStored("ws-v4-favs",[]));
  const [batch,setBatch]=useState([]);
  const [saved,setSaved]=useState(false);
  const [toast,setToast]=useState("");
  const [animated,setAnimated]=useState(false);
  const canvasRef=useRef(null);
  const batchRefs=useRef({});

  useEffect(()=>{ drawWallpaper(canvasRef.current,config); },[config]);

  const update=(k,v)=>setConfig(x=>({...x,[k]:v}));
  const randomize=()=>{
    setConfig(x=>({...x,
      seed:String(Math.floor(Math.random()*999999999)),
      paletteIndex:Math.floor(Math.random()*PALETTES.length),
      style:STYLES[Math.floor(Math.random()*STYLES.length)]
    }));
    setSaved(false);
  };

  const generateAI=async()=>{
    if(aiProvider==="endpoint" && apiEndpoint.trim()){
      try{
        const res=await fetch(apiEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          prompt, width:PRESETS[config.preset][0], height:PRESETS[config.preset][1]
        })});
        if(!res.ok) throw new Error("AI endpoint returned "+res.status);
        const data=await res.json();
        if(data.imageUrl){setToast("AI image URL received. Connect your renderer/storage to display it.");}
        else setToast("Endpoint responded, but no imageUrl was returned.");
      }catch(e){setToast("AI endpoint failed. Demo AI remains available.");}
      return;
    }
    if(!prompt.trim()){setToast("Enter a prompt first.");return;}
    setConfig(x=>aiDemoConfig(prompt,x));setMode("create");setToast("Demo AI generated a wallpaper recipe locally.");
  };

  const download=()=>{
    const a=document.createElement("a");
    a.download=`wallpaper-${config.preset.replaceAll(" ","-").toLowerCase()}-${config.seed}.png`;
    a.href=canvasRef.current.toDataURL("image/png");a.click();
  };

  const save=()=>{
    const next=[config,...favorites.filter(f=>f.seed!==config.seed)].slice(0,50);
    setFavorites(next);localStorage.setItem("ws-v4-favs",JSON.stringify(next));setSaved(true);setToast("Saved to your local library.");
  };

  const share=async()=>{
    const payload=btoa(JSON.stringify(config));
    const url=location.origin+location.pathname+"#wallpaper="+payload;
    try{await navigator.clipboard.writeText(url);setToast("Share link copied to clipboard.");}
    catch{setToast("Could not copy the share link.");}
  };

  const batchGenerate=()=>{
    const arr=Array.from({length:6},(_,i)=>({...config,seed:String(Math.floor(Math.random()*999999999)+i),style:STYLES[Math.floor(Math.random()*STYLES.length)],paletteIndex:Math.floor(Math.random()*PALETTES.length)}));
    setBatch(arr);setTab("batch");
    setTimeout(()=>arr.forEach((c,i)=>drawWallpaper(batchRefs.current[i],c,.22)),50);
  };

  const deleteFavorites=()=>{setFavorites([]);localStorage.removeItem("ws-v4-favs");setToast("Library cleared.");};
  const load=(x)=>{setConfig(x);setTab("studio");setSaved(true);setToast("Wallpaper loaded.");};

  useEffect(()=>{
    const m=location.hash.match(/#wallpaper=(.+)$/);
    if(m){try{setConfig(JSON.parse(atob(m[1])));setToast("Shared wallpaper loaded.");}catch{}}
  },[]);

  return <div className={"app "+(animated?"animated":"")}>
    <header className="topbar">
      <div className="brand"><Sparkles size={20}/><b>Wallpaper Studio</b><span>V3 + V4</span></div>
      <nav>
        <button className={tab==="studio"?"on":""} onClick={()=>setTab("studio")}><Layers3 size={16}/> Studio</button>
        <button className={tab==="batch"?"on":""} onClick={()=>setTab("batch")}><Zap size={16}/> Batch</button>
        <button className={tab==="library"?"on":""} onClick={()=>setTab("library")}><Library size={16}/> Library</button>
      </nav>
      <div className="seed">SEED <b>{config.seed}</b><button onClick={()=>navigator.clipboard?.writeText(config.seed)}><Copy size={14}/></button></div>
    </header>

    <main>
      {tab==="studio" && <>
        <section className="mainPanel">
          <div className="heroHead">
            <div><small>V3 PROCEDURAL + V4 AI-READY</small><h1>Create something<br/><i>worth keeping.</i></h1></div>
            <button className="outline" onClick={randomize}><Shuffle size={17}/> Randomize</button>
          </div>

          <div className={"canvasFrame "+(PRESETS[config.preset][0]>PRESETS[config.preset][1]?"wide":"tall")}>
            <canvas ref={canvasRef}/>
            <div className="dimension">{PRESETS[config.preset][0]} × {PRESETS[config.preset][1]}</div>
            {animated && <div className="liveBadge"><Play size={12}/> LIVE PREVIEW</div>}
          </div>

          <div className="actions">
            <button className="primary" onClick={randomize}><Shuffle/> Generate</button>
            <button className={saved?"active":""} onClick={save}><Heart fill={saved?"currentColor":"none"}/> {saved?"Saved":"Favorite"}</button>
            <button onClick={download}><Download/> Download PNG</button>
            <button onClick={share}><Share2/> Share</button>
          </div>

          <div className="aiCard">
            <div className="aiTitle"><Wand2/><div><b>V4 AI Studio</b><small>Optional AI layer — your current app still works without an API.</small></div></div>
            <div className="modeSwitch"><button className={mode==="create"?"sel":""} onClick={()=>setMode("create")}>Procedural</button><button className={mode==="ai"?"sel":""} onClick={()=>setMode("ai")}>AI Prompt</button></div>
            {mode==="ai" && <div className="promptArea">
              <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Example: dark futuristic cyberpunk city, blue neon, cinematic, minimal, premium laptop wallpaper"/>
              <div className="aiRow">
                <select value={aiProvider} onChange={e=>setAiProvider(e.target.value)}><option value="demo">Demo AI — no API</option><option value="endpoint">My AI endpoint</option></select>
                {aiProvider==="endpoint" && <input value={apiEndpoint} onChange={e=>setApiEndpoint(e.target.value)} placeholder="https://your-backend/generate"/>}
                <button className="primary" onClick={generateAI}><Wand2 size={16}/> Generate</button>
              </div>
              <small className="hint">Demo AI converts your prompt into a local visual recipe. For real AI images, connect a server-side endpoint later; never expose an API key in Vite.</small>
            </div>}
          </div>
        </section>

        <aside>
          <h2><SlidersHorizontal/> Studio Controls</h2>
          <label>Device / Resolution</label>
          <div className="presetGrid">{Object.keys(PRESETS).map(k=><button className={config.preset===k?"sel":""} key={k} onClick={()=>update("preset",k)}>{k}<span>{PRESETS[k][0]}×{PRESETS[k][1]}</span></button>)}</div>
          <label>Style</label>
          <select value={config.style} onChange={e=>update("style",e.target.value)}>{STYLES.map(s=><option key={s}>{s}</option>)}</select>
          <label>Palette</label>
          <div className="palettes">{PALETTES.map((p,i)=><button title={p[0]} key={i} className={config.paletteIndex===i?"pal sel":"pal"} onClick={()=>update("paletteIndex",i)}>{p.slice(1).map(c=><span style={{background:c}} key={c}/>)}</button>)}</div>
          <Range name="Density" value={config.density} min={4} max={30} set={v=>update("density",v)}/>
          <Range name="Glow" value={config.glow} min={0} max={40} set={v=>update("glow",v)}/>
          <Range name="Grain" value={config.grain} min={0} max={2} step=".1" set={v=>update("grain",v)}/>
          <Range name="Vignette" value={config.vignette} min={0} max={.8} step=".01" set={v=>update("vignette",v)}/>
          <button className="surprise" onClick={randomize}><RefreshCw/> Surprise Me</button>
          <button className={"animateBtn "+(animated?"enabled":"")} onClick={()=>setAnimated(x=>!x)}><Play size={15}/> {animated?"Live Preview On":"Live Preview Off"}</button>
          <button className="batchBtn" onClick={batchGenerate}><Zap size={15}/> Generate 6 Variations</button>
        </aside>
      </>}

      {tab==="batch" && <section className="fullSection">
        <div className="sectionHead"><div><small>V4 BATCH LAB</small><h2>Generate variations in one click.</h2></div><button className="primary" onClick={batchGenerate}><Shuffle/> New Batch</button></div>
        {batch.length===0 ? <Empty icon={<Zap/>} text="Create six variations from your current settings."/> :
        <div className="batchGrid">{batch.map((x,i)=><div className="batchCard" key={i}><div className="thumb"><canvas ref={el=>batchRefs.current[i]=el}/></div><div><b>{x.style}</b><small>{x.preset} • {x.seed}</small></div><div className="cardBtns"><button onClick={()=>{setConfig(x);setTab("studio")}}><Check/> Use</button><button onClick={()=>{setConfig(x);setTab("studio");setTimeout(download,100)}}><Download/></button></div></div>)}</div>}
      </section>}

      {tab==="library" && <section className="fullSection">
        <div className="sectionHead"><div><small>V4 PERSONAL LIBRARY</small><h2>Your saved wallpapers.</h2></div>{favorites.length>0&&<button className="danger" onClick={deleteFavorites}><Trash2/> Clear Library</button>}</div>
        {favorites.length===0 ? <Empty icon={<Heart/>} text="Favorite a wallpaper and it will appear here. Everything is stored locally in this demo."/> :
        <div className="libraryGrid">{favorites.map((x,i)=><LibraryCard key={i} config={x} onLoad={()=>load(x)} onDelete={()=>{const n=favorites.filter((_,j)=>j!==i);setFavorites(n);localStorage.setItem("ws-v4-favs",JSON.stringify(n))}} />)}</div>}
      </section>}
    </main>

    {toast && <div className="toast" onClick={()=>setToast("")}><Check size={15}/>{toast}<X size={14}/></div>}
  </div>
}

function Range({name,value,min,max,step=1,set}){return <div className="range"><label>{name}<b>{value}</b></label><input type="range" value={value} min={min} max={max} step={step} onChange={e=>set(+e.target.value)}/></div>}

function Empty({icon,text}){return <div className="empty">{icon}<b>{text}</b></div>}

function LibraryCard({config,onLoad,onDelete}){
 const ref=useRef(null);
 useEffect(()=>{drawWallpaper(ref.current,config,.25)},[config]);
 return <div className="libraryCard"><div className="libraryThumb"><canvas ref={ref}/></div><div className="libraryInfo"><b>{config.style}</b><small>{config.preset} • {config.seed}</small></div><div className="libraryActions"><button onClick={onLoad}>Open</button><button onClick={onDelete}><Trash2 size={15}/></button></div></div>
}

createRoot(document.getElementById("root")).render(<App/>);