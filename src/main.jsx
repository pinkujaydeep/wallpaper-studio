import React,{useEffect,useMemo,useRef,useState}from"react";
import{createRoot}from"react-dom/client";
import{Download,Shuffle,Heart,Smartphone,Laptop,Tablet,SlidersHorizontal,Copy,RefreshCw,Maximize2,Sun,Blur,RotateCw,Grid3X3,Image as ImageIcon,Trash2}from"lucide-react";
import"./styles.css";

const PRESETS={
"Phone HD":[1080,1920],"Phone QHD":[1440,2560],"Phone 4K":[2160,3840],
"Laptop FHD":[1920,1200],"Laptop QHD":[2560,1600],"Laptop 4K":[3840,2400],
"Tablet":[2048,2732],"Desktop 4K":[3840,2160]
};
const PALETTES=[
["Midnight","#07111f","#075985","#22d3ee","#dbeafe"],["Violet","#10061c","#6d28d9","#db2777","#f5d0fe"],
["Ember","#120806","#9a3412","#f59e0b","#fef3c7"],["Forest","#04130d","#047857","#34d399","#d1fae5"],
["Ocean","#03121b","#0369a1","#38bdf8","#e0f2fe"],["Mono","#050505","#27272a","#a1a1aa","#fafafa"],
["Sunset","#18070b","#be123c","#fb7185","#fed7aa"],["Ice","#06121c","#334155","#67e8f9","#f8fafc"]
];
const STYLES=["Aurora","Geometry","Orbs","Waves","Particles","Mesh","Nebula","Rings","Liquid","Prism","Constellation","Topography","Bloom","Circuit","Solar","Tunnel","Grid","Comet","Fractal","Minimal"];

function rng(seed){let h=2166136261;for(let c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;return(h>>>0)/4294967296}}
function draw(canvas,c){
 const [W,H]=c.size,ctx=canvas.getContext("2d");canvas.width=W;canvas.height=H;const r=rng(c.seed),p=c.palette;
 ctx.fillStyle=p[1];ctx.fillRect(0,0,W,H);
 let g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,p[1]);g.addColorStop(.48,p[2]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.globalCompositeOperation="screen"; const n=c.density;
 const glow=(x,y,rad,color,a=.2)=>{let q=ctx.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,color);q.addColorStop(.55,color+"99");q.addColorStop(1,"transparent");ctx.globalAlpha=a;ctx.fillStyle=q;ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.fill()};
 if(c.style==="Aurora"||c.style==="Nebula"||c.style==="Bloom"){for(let i=0;i<n;i++)glow(r()*W,r()*H,W*(.05+r()*.3),p[2+i%3],.08+r()*.16)}
 if(c.style==="Orbs"||c.style==="Solar"){for(let i=0;i<n;i++){let x=r()*W,y=r()*H,rad=W*(.01+r()*.1);glow(x,y,rad,p[2+i%3],.12+r()*.18);ctx.globalAlpha=.5;ctx.strokeStyle=p[4];ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,rad*.45,0,7);ctx.stroke()}}
 if(["Geometry","Prism","Grid"].includes(c.style)){ctx.globalAlpha=.16;for(let i=0;i<n*2;i++){let x=r()*W,y=r()*H,s=W*(.015+r()*.12);ctx.save();ctx.translate(x,y);ctx.rotate(r()*6.28);ctx.strokeStyle=p[2+i%3];ctx.lineWidth=3+r()*8;ctx.strokeRect(-s/2,-s/2,s,s);ctx.restore()}}
 if(["Waves","Liquid","Topography"].includes(c.style)){for(let i=0;i<n+8;i++){ctx.globalAlpha=.05+r()*.09;ctx.strokeStyle=p[2+i%3];ctx.lineWidth=5+r()*22;ctx.beginPath();let y=H*i/(n+8);ctx.moveTo(-50,y);ctx.bezierCurveTo(W*.25,y-H*(.08+r()*.1),W*.65,y+H*(.08+r()*.1),W+50,y-H*(r()*.05));ctx.stroke()}}
 if(["Particles","Constellation","Comet"].includes(c.style)){let pts=[];for(let i=0;i<n*10;i++){let x=r()*W,y=r()*H,rr=.5+r()*4;pts.push([x,y]);ctx.globalAlpha=.2+r()*.7;ctx.fillStyle=p[2+i%3];ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.fill()}if(c.style==="Constellation"){ctx.globalAlpha=.12;ctx.strokeStyle=p[4];for(let i=0;i<pts.length;i+=3){let a=pts[i],b=pts[(i+1)%pts.length];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()}}}
 if(["Rings","Tunnel"].includes(c.style)){ctx.globalAlpha=.13;for(let i=0;i<n;i++){ctx.strokeStyle=p[2+i%3];ctx.lineWidth=4+r()*12;ctx.beginPath();ctx.ellipse(W/2,H/2,W*(.03+i/n*.6),H*(.03+i/n*.6),r()*3.14,0,7);ctx.stroke()}}
 if(c.style==="Circuit"){ctx.globalAlpha=.16;ctx.strokeStyle=p[3];ctx.lineWidth=4;for(let i=0;i<n;i++){let x=r()*W,y=r()*H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+W*(.04+r()*.18),y);ctx.lineTo(x+W*(.04+r()*.18),y+H*(r()-.5)*.25);ctx.stroke()}}
 if(c.style==="Fractal"){ctx.globalAlpha=.14;for(let i=0;i<n;i++){let x=W/2,y=H/2,ang=r()*6.28;ctx.strokeStyle=p[2+i%3];ctx.lineWidth=2+r()*8;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<8;j++){let d=W*(.015+j*.025);x+=Math.cos(ang)*d;y+=Math.sin(ang)*d;ctx.lineTo(x,y);ang+=r()*.9-.45}ctx.stroke()}}
 if(c.style==="Comet"){for(let i=0;i<n/2;i++){let x=r()*W,y=r()*H;ctx.globalAlpha=.08+r()*.15;ctx.strokeStyle=p[3];ctx.lineWidth=3+r()*10;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-W*(.08+r()*.2),y-H*(.02+r()*.08));ctx.stroke();glow(x,y,W*.025,p[4],.3)}}
 if(c.style==="Minimal"){for(let i=0;i<5;i++){let x=W*(.1+r()*.8),y=H*(.1+r()*.8);ctx.globalAlpha=.12;ctx.strokeStyle=p[4];ctx.lineWidth=2+r()*8;ctx.beginPath();ctx.arc(x,y,W*(.04+r()*.12),0,7);ctx.stroke()}}
 ctx.globalCompositeOperation="source-over";
 let v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.1,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(.55,"transparent");v.addColorStop(1,`rgba(0,0,0,${c.vignette})`);ctx.fillStyle=v;ctx.globalAlpha=1;ctx.fillRect(0,0,W,H);
 if(c.grain>0){let count=Math.floor(7000*c.grain);ctx.globalAlpha=.025*c.grain;for(let i=0;i<count;i++){ctx.fillStyle=r()>.5?"#fff":"#000";ctx.fillRect(r()*W,r()*H,1,1)}}
 ctx.globalAlpha=1;
}
function App(){
 const ref=useRef(null),[preset,setPreset]=useState("Phone QHD"),[style,setStyle]=useState("Aurora"),[pi,setPi]=useState(0),[density,setDensity]=useState(14),[glow,setGlow]=useState(18),[grain,setGrain]=useState(1),[vignette,setVignette]=useState(.48),[seed,setSeed]=useState(()=>String(Math.floor(Math.random()*1e9))),[favs,setFavs]=useState([]),[saved,setSaved]=useState(false);
 const config=useMemo(()=>({size:PRESETS[preset],style,palette:PALETTES[pi],density,glow,grain,vignette,seed}),[preset,style,pi,density,glow,grain,vignette,seed]);
 useEffect(()=>draw(ref.current,config),[config]);
 useEffect(()=>{try{setFavs(JSON.parse(localStorage.getItem("ws-favs")||"[]"))}catch{}},[]);
 const generate=()=>{setSeed(String(Math.floor(Math.random()*999999999)));setPi(Math.floor(Math.random()*PALETTES.length));setStyle(STYLES[Math.floor(Math.random()*STYLES.length)]);setSaved(false)};
 const download=()=>{let a=document.createElement("a");a.download=`wallpaper-${preset.replaceAll(" ","-").toLowerCase()}-${seed}.png`;a.href=ref.current.toDataURL("image/png");a.click()};
 const save=()=>{let x={preset,style,pi,density,glow,grain,vignette,seed},next=[x,...favs.filter(f=>f.seed!==seed)].slice(0,30);setFavs(next);localStorage.setItem("ws-favs",JSON.stringify(next));setSaved(true)};
 const load=x=>{setPreset(x.preset);setStyle(x.style);setPi(x.pi);setDensity(x.density);setGlow(x.glow);setGrain(x.grain);setVignette(x.vignette);setSeed(x.seed);setSaved(true)};
 return <div className="app"><header><div className="brand">✦ <b>Wallpaper Studio</b><small>V2</small></div><div className="seed">SEED <b>{seed}</b><button onClick={()=>navigator.clipboard?.writeText(seed)}><Copy size={14}/></button></div></header>
 <main><section className="hero"><div className="heroTop"><div><small>PROCEDURAL WALLPAPER LAB</small><h1>Design your next<br/><i>perfect background.</i></h1></div><button className="random" onClick={generate}><Shuffle/> Randomize</button></div>
 <div className={"preview "+(PRESETS[preset][0]>PRESETS[preset][1]?"wide":"tall")}><canvas ref={ref}/><div className="sizeTag">{PRESETS[preset][0]} × {PRESETS[preset][1]}</div></div>
 <div className="actions"><button className="primary" onClick={generate}><Shuffle/> Generate</button><button onClick={save} className={saved?"active":""}><Heart fill={saved?"currentColor":"none"}/> {saved?"Saved":"Favorite"}</button><button onClick={download}><Download/> Download PNG</button></div></section>
 <aside><h2><SlidersHorizontal/> Studio Controls</h2>
 <label>Format</label><div className="presetGrid">{Object.keys(PRESETS).map(k=><button className={preset===k?"sel":""} onClick={()=>setPreset(k)} key={k}>{k}<span>{PRESETS[k][0]}×{PRESETS[k][1]}</span></button>)}</div>
 <label>Style</label><select value={style} onChange={e=>setStyle(e.target.value)}>{STYLES.map(s=><option key={s}>{s}</option>)}</select>
 <label>Palette</label><div className="palettes">{PALETTES.map((p,i)=><button className={pi===i?"pal sel":"pal"} onClick={()=>setPi(i)} key={i} title={p[0]}>{p.slice(1).map(c=><span style={{background:c}} key={c}/>)}</button>)}</div>
 <Range name="Density" value={density} min={4} max={30} set={setDensity}/><Range name="Glow" value={glow} min={0} max={40} set={setGlow}/><Range name="Grain" value={grain} min={0} max={2} step=".1" set={setGrain}/><Range name="Vignette" value={vignette} min={0} max={.8} step=".01" set={setVignette}/>
 <button className="surprise" onClick={generate}><RefreshCw/> Surprise me</button>
 <div className="export"><ImageIcon/><div><b>Full resolution export</b><small>Generation happens locally. No image API required.</small></div></div>
 {favs.length>0&&<div className="favs"><div className="favHead"><b>Favorites</b><button onClick={()=>{setFavs([]);localStorage.removeItem("ws-favs")}}><Trash2 size={14}/></button></div>{favs.slice(0,6).map((f,i)=><button className="fav" onClick={()=>load(f)} key={i}><span>{f.style}</span><small>{f.preset} • {f.seed}</small></button>)}</div>}
 </aside></main></div>
}
function Range({name,value,min,max,step=1,set}){return <div className="range"><label>{name}<b>{value}</b></label><input type="range" value={value} min={min} max={max} step={step} onChange={e=>set(+e.target.value)}/></div>}
createRoot(document.getElementById("root")).render(<App/>);