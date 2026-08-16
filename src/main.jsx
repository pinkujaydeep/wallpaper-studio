import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Download, Shuffle, Heart, Sparkles, Smartphone, Laptop,
  SlidersHorizontal, Palette, Copy, RefreshCw
} from "lucide-react";
import "./styles.css";

const SIZES = {
  phone: { label: "Mobile", width: 1440, height: 2560 },
  laptop: { label: "Laptop", width: 2560, height: 1600 }
};

const PALETTES = [
  ["#0b1020","#2447a8","#7c3aed","#22d3ee"],
  ["#100c0c","#7f1d1d","#ea580c","#facc15"],
  ["#06130e","#065f46","#10b981","#a7f3d0"],
  ["#12061f","#6d28d9","#db2777","#f9a8d4"],
  ["#0a0a0a","#27272a","#71717a","#f4f4f5"],
  ["#07111f","#075985","#0ea5e9","#bae6fd"]
];

const STYLES = ["Aurora", "Geometry", "Orbs", "Waves", "Particles", "Mesh"];

function hashSeed(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
    return ((h >>> 0) / 4294967296);
  };
}

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}

function drawWallpaper(canvas, config) {
  const { width, height } = config.size;
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  const rnd = hashSeed(String(config.seed));
  const p = config.palette;

  // Background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, p[0]); bg.addColorStop(0.5, p[1]); bg.addColorStop(1, p[0]);
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,width,height);

  ctx.globalCompositeOperation = "screen";

  if (config.style === "Aurora") {
    for (let i=0;i<9;i++) {
      const x = rnd()*width, y = rnd()*height;
      const rx = width*(0.18+rnd()*0.38), ry = height*(0.08+rnd()*0.22);
      const g = ctx.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));
      g.addColorStop(0,p[2]); g.addColorStop(.45,p[3]); g.addColorStop(1,"transparent");
      ctx.globalAlpha = .10 + rnd()*.18;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x,y,rx,ry,rnd()*Math.PI,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha=.7;
    for(let i=0;i<18;i++){
      ctx.strokeStyle = p[(i%3)+1];
      ctx.lineWidth = 3 + rnd()*9;
      ctx.globalAlpha=.08+rnd()*.10;
      ctx.beginPath();
      const y=height*(.12+i*.045);
      ctx.moveTo(-100,y);
      ctx.bezierCurveTo(width*.25,y-height*.18,width*.65,y+height*.18,width+100,y-height*.03);
      ctx.stroke();
    }
  }

  if (config.style === "Geometry") {
    ctx.globalAlpha=.18;
    for(let i=0;i<config.complexity*2;i++){
      const x=rnd()*width, y=rnd()*height;
      const s=width*(.02+rnd()*.13);
      ctx.save(); ctx.translate(x,y); ctx.rotate(rnd()*Math.PI);
      ctx.strokeStyle=p[1+(i%3)]; ctx.lineWidth=4+rnd()*10;
      if(rnd()>.45){
        ctx.strokeRect(-s/2,-s/2,s,s);
      } else {
        ctx.beginPath();
        ctx.moveTo(0,-s/2); ctx.lineTo(s/2,s/2); ctx.lineTo(-s/2,s/2); ctx.closePath(); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.globalAlpha=.12;
    ctx.strokeStyle=p[3]; ctx.lineWidth=2;
    for(let x=0;x<width;x+=width/16) { ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke(); }
    for(let y=0;y<height;y+=height/16) { ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke(); }
  }

  if (config.style === "Orbs") {
    for(let i=0;i<config.complexity+8;i++){
      const x=rnd()*width,y=rnd()*height,r=width*(.015+rnd()*.12);
      const g=ctx.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);
      g.addColorStop(0,"#ffffff"); g.addColorStop(.08,p[(i%3)+1]);
      g.addColorStop(.55,p[(i%3)+1]); g.addColorStop(1,"transparent");
      ctx.globalAlpha=.16+rnd()*.20; ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
  }

  if (config.style === "Waves") {
    for(let i=0;i<18;i++){
      ctx.globalAlpha=.06+rnd()*.08;
      ctx.strokeStyle=p[1+(i%3)];
      ctx.lineWidth=8+rnd()*20;
      ctx.beginPath();
      const base=height*(i/18);
      ctx.moveTo(-100,base);
      ctx.bezierCurveTo(width*.2,base-height*.12,width*.35,base+height*.15,width*.55,base);
      ctx.bezierCurveTo(width*.75,base-height*.15,width*.9,base+height*.1,width+100,base-height*.03);
      ctx.stroke();
    }
  }

  if (config.style === "Particles") {
    for(let i=0;i<config.complexity*35;i++){
      const x=rnd()*width,y=rnd()*height,r=.7+rnd()*5;
      ctx.globalAlpha=.2+rnd()*.65; ctx.fillStyle=p[1+(i%3)];
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
  }

  if (config.style === "Mesh") {
    const cols=8, rows=12;
    ctx.globalAlpha=.14;
    ctx.lineWidth=3;
    for(let j=0;j<=rows;j++){
      ctx.beginPath();
      for(let i=0;i<=cols;i++){
        const x=i*width/cols, y=j*height/rows + (rnd()-.5)*height*.06;
        if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=p[2];ctx.stroke();
    }
    for(let i=0;i<=cols;i++){
      ctx.beginPath();
      for(let j=0;j<=rows;j++){
        const x=i*width/cols+(rnd()-.5)*width*.06, y=j*height/rows;
        if(j===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=p[3];ctx.stroke();
    }
  }

  // vignette + grain
  ctx.globalCompositeOperation="source-over";
  const v=ctx.createRadialGradient(width/2,height/2,Math.min(width,height)*.15,width/2,height/2,Math.max(width,height)*.72);
  v.addColorStop(.55,"transparent"); v.addColorStop(1,"rgba(0,0,0,.48)");
  ctx.fillStyle=v;ctx.fillRect(0,0,width,height);

  ctx.globalAlpha=.035;
  for(let i=0;i<9000;i++){
    const x=rnd()*width,y=rnd()*height;
    ctx.fillStyle=rnd()>.5?"#fff":"#000";
    ctx.fillRect(x,y,1,1);
  }
  ctx.globalAlpha=1;
}

function App() {
  const canvasRef=useRef(null);
  const [device,setDevice]=useState("phone");
  const [style,setStyle]=useState("Aurora");
  const [complexity,setComplexity]=useState(12);
  const [seed,setSeed]=useState(String(Math.floor(Math.random()*99999999)));
  const [paletteIndex,setPaletteIndex]=useState(Math.floor(Math.random()*PALETTES.length));
  const [favorites,setFavorites]=useState([]);
  const [saved,setSaved]=useState(false);

  const config={
    size:SIZES[device],
    style,
    complexity,
    seed,
    palette:PALETTES[paletteIndex]
  };

  useEffect(()=>{ drawWallpaper(canvasRef.current,config); },[device,style,complexity,seed,paletteIndex]);

  function generate() {
    setSeed(String(Math.floor(Math.random()*999999999)));
    setPaletteIndex(Math.floor(Math.random()*PALETTES.length));
    setStyle(STYLES[Math.floor(Math.random()*STYLES.length)]);
    setSaved(false);
  }

  function download() {
    const link=document.createElement("a");
    link.download=`wallpaper-${device}-${seed}.png`;
    link.href=canvasRef.current.toDataURL("image/png");
    link.click();
  }

  function saveFavorite() {
    const item={device,style,complexity,seed,paletteIndex};
    const next=[item,...favorites.filter(x=>x.seed!==seed)].slice(0,20);
    setFavorites(next); setSaved(true);
    localStorage.setItem("wallpaper-favorites",JSON.stringify(next));
  }

  useEffect(()=>{
    try { setFavorites(JSON.parse(localStorage.getItem("wallpaper-favorites")||"[]")); } catch {}
  },[]);

  function copySeed() {
    navigator.clipboard?.writeText(seed);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><Sparkles size={21}/><span>Wallpaper Studio</span></div>
        <div className="seed">Seed <b>{seed}</b> <button onClick={copySeed}><Copy size={15}/></button></div>
      </header>

      <main className="layout">
        <section className="preview-panel">
          <div className="preview-head">
            <div>
              <span className="eyebrow">PROCEDURAL GENERATOR</span>
              <h1>Make a wallpaper<br/><em>worth keeping.</em></h1>
            </div>
            <button className="icon-btn" onClick={generate} title="Randomize"><Shuffle/></button>
          </div>

          <div className={`canvas-wrap ${device}`}>
            <canvas ref={canvasRef}/>
          </div>

          <div className="preview-actions">
            <button className="primary" onClick={generate}><Shuffle size={18}/> Generate</button>
            <button className={saved?"secondary active":"secondary"} onClick={saveFavorite}><Heart size={18} fill={saved?"currentColor":"none"}/> {saved?"Saved":"Favorite"}</button>
            <button className="secondary" onClick={download}><Download size={18}/> Download</button>
          </div>
        </section>

        <aside className="controls">
          <div className="control-title"><SlidersHorizontal size={19}/> Controls</div>

          <label>Device</label>
          <div className="segmented">
            <button className={device==="phone"?"selected":""} onClick={()=>setDevice("phone")}><Smartphone size={17}/> Mobile</button>
            <button className={device==="laptop"?"selected":""} onClick={()=>setDevice("laptop")}><Laptop size={17}/> Laptop</button>
          </div>

          <label>Style</label>
          <select value={style} onChange={e=>setStyle(e.target.value)}>
            {STYLES.map(x=><option key={x}>{x}</option>)}
          </select>

          <label>Color palette</label>
          <div className="palettes">
            {PALETTES.map((p,i)=>
              <button key={i} className={paletteIndex===i?"palette selected": "palette"} onClick={()=>setPaletteIndex(i)}>
                {p.map(c=><span key={c} style={{background:c}}/>)}
              </button>
            )}
          </div>

          <label>Complexity <span>{complexity}</span></label>
          <input type="range" min="4" max="30" value={complexity} onChange={e=>setComplexity(+e.target.value)}/>

          <button className="surprise" onClick={generate}><RefreshCw size={17}/> Surprise me</button>

          <div className="info">
            <Palette size={17}/>
            <div><b>{SIZES[device].width} × {SIZES[device].height}px</b><br/>
            PNG export • generated locally in your browser</div>
          </div>

          {favorites.length>0 && (
            <div className="favorites">
              <h3>Recent favorites</h3>
              {favorites.slice(0,4).map((x,i)=>
                <button key={i} onClick={()=>{setDevice(x.device);setStyle(x.style);setComplexity(x.complexity);setSeed(x.seed);setPaletteIndex(x.paletteIndex)}} className="favorite-row">
                  <span>{x.style}</span><small>{x.device} • {x.seed}</small>
                </button>
              )}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App/>);