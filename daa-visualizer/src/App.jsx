import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════
   DAA REAL-WORLD APPLICATION SUITE
   7 algorithms → 6 real production-style tools
   ════════════════════════════════════════════════════════════ */

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`;

const T = {
  bg:     "#0a0a0f",
  card:   "#111118",
  border: "#1e1e2e",
  text:   "#f0f0f5",
  sub:    "#6b6b80",
  dim:    "#2a2a3a",
};

const APPS = [
  { id:"naviRoute",  name:"NaviRoute",    tagline:"GPS Route Planner",         algo:"Dijkstra's Algorithm",     paradigm:"Greedy",              icon:"🗺️",  accent:"#00c896", industry:"Logistics / Maps" },
  { id:"packSort",   name:"PackSort",     tagline:"E-Commerce Order Sorter",   algo:"Merge Sort",               paradigm:"Divide & Conquer",    icon:"📦",  accent:"#ff7d3b", industry:"E-Commerce / Retail" },
  { id:"diffScan",   name:"DiffScan",     tagline:"Code Diff Analyzer",        algo:"Longest Common Subsequence",paradigm:"Dynamic Programming", icon:"🔍",  accent:"#bf7fff", industry:"DevTools / Version Control" },
  { id:"shiftBoard", name:"ShiftBoard",   tagline:"Conflict-Free Scheduler",   algo:"N-Queens (Backtracking)",  paradigm:"Backtracking",        icon:"🗓️",  accent:"#ff4d6d", industry:"HR / Healthcare / Ops" },
];

/* ─── Shared UI ─── */
const pill = (color, bg) => ({ display:"inline-block", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600, color, background:bg||color+"18", border:`1px solid ${color}33`, fontFamily:"'DM Mono',monospace", letterSpacing:.4 });
const card = (extra={}) => ({ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, ...extra });
const input_s = { width:"100%", padding:"10px 14px", background:"#0a0a0f", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" };
const btnBase = { padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontFamily:"'DM Sans',sans-serif", fontSize:13, transition:"all .15s" };
const Divider = ()=><div style={{ height:1, background:T.border, margin:"16px 0" }}/>;

function Tag({ label, color }) {
  return <span style={pill(color)}>{label}</span>;
}

function AppCard({ app, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ ...card(), padding:24, cursor:"pointer", transition:"all .2s", position:"relative", overflow:"hidden",
        borderColor: hov ? app.accent+"66" : T.border,
        boxShadow: hov ? `0 12px 40px ${app.accent}18` : "none",
        transform: hov ? "translateY(-4px)" : "none" }}>
      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle,${app.accent}15,transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ fontSize:36, marginBottom:12 }}>{app.icon}</div>
      <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:4 }}>{app.name}</div>
      <div style={{ fontSize:13, color:T.sub, marginBottom:12 }}>{app.tagline}</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        <Tag label={app.paradigm} color={app.accent}/>
        <Tag label={app.industry} color={T.sub}/>
      </div>
      <div style={{ fontSize:11, color:T.sub, fontFamily:"'DM Mono',monospace" }}>Powered by {app.algo}</div>
      <div style={{ position:"absolute", bottom:16, right:18, fontSize:13, color:app.accent, fontWeight:700, opacity: hov?1:0, transition:"opacity .2s" }}>Open App →</div>
    </div>
  );
}

function BackBtn({ accent, onClick }) {
  return (
    <button onClick={onClick} style={{ ...btnBase, background:T.dim, color:T.sub, fontSize:12, padding:"7px 14px", marginBottom:20 }}>
      ← Back to Suite
    </button>
  );
}

function StepLog({ steps, curIdx, accent }) {
  const ref = useRef(null);
  useEffect(()=>{ if(ref.current) ref.current.scrollTop=ref.current.scrollHeight; },[curIdx]);
  return (
    <div ref={ref} style={{ background:"#0a0a0f", border:`1px solid ${T.border}`, borderRadius:10, padding:12, maxHeight:180, overflowY:"auto" }}>
      <div style={{ fontSize:11, color:T.sub, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>// Algorithm trace log</div>
      {steps.slice(0, curIdx+1).map((s,i)=>(
        <div key={i} style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color: i===curIdx?accent:"#4a4a6a", padding:"2px 0", lineHeight:1.6 }}>
          <span style={{ color:T.dim }}>{String(i+1).padStart(3,"0")} </span>{s.log||s.desc||s}
        </div>
      ))}
    </div>
  );
}

function PlayerBar({ idx, total, playing, onPlay, onPrev, onNext, onReset, accent }) {
  return (
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginTop:12 }}>
      <button onClick={onReset} style={{ ...btnBase, background:T.dim, color:T.sub, padding:"7px 12px" }}>⏮</button>
      <button onClick={onPrev}  style={{ ...btnBase, background:T.dim, color:T.sub, padding:"7px 12px" }}>⏪</button>
      <button onClick={onPlay}  style={{ ...btnBase, background:`${accent}22`, color:accent, border:`1px solid ${accent}55`, padding:"7px 18px" }}>
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <button onClick={onNext}  style={{ ...btnBase, background:T.dim, color:T.sub, padding:"7px 12px" }}>⏩</button>
      <div style={{ flex:1, height:4, background:T.dim, borderRadius:99, overflow:"hidden", minWidth:80 }}>
        <div style={{ height:"100%", background:accent, borderRadius:99, width:`${total>1?(idx/(total-1))*100:100}%`, transition:"width .3s" }}/>
      </div>
      <span style={{ fontSize:12, color:T.sub, fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>{idx+1}/{total}</span>
    </div>
  );
}

function usePlayer(total) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const t = useRef(null);
  useEffect(()=>{
    clearTimeout(t.current);
    if(playing && idx < total-1) t.current = setTimeout(()=>setIdx(i=>i+1), 650);
    else if(idx >= total-1) setPlaying(false);
  },[playing,idx,total]);
  const reset = useCallback(()=>{ setIdx(0); setPlaying(false); },[]);
  return { idx, setIdx, playing, setPlaying, reset,
    prev:()=>setIdx(i=>Math.max(0,i-1)),
    next:()=>setIdx(i=>Math.min(total-1,i+1)) };
}

/* ════════════════════════════════════════════════
   APP 1: NaviRoute — Dijkstra GPS Navigation
   ════════════════════════════════════════════════ */
const CITIES = {
  Mumbai:    [100, 220], Delhi:     [260, 80],  Bangalore: [200, 340],
  Chennai:   [260, 350], Kolkata:   [390, 170], Hyderabad: [240, 265],
  Pune:      [130, 255], Ahmedabad: [130, 155], Jaipur:    [215, 120],
  Bhopal:    [240, 195],
};
const ROADS = [
  ["Mumbai","Pune",150],["Mumbai","Ahmedabad",530],["Mumbai","Hyderabad",710],
  ["Delhi","Jaipur",280],["Delhi","Bhopal",740],["Delhi","Kolkata",1470],
  ["Jaipur","Ahmedabad",660],["Jaipur","Bhopal",580],
  ["Bhopal","Hyderabad",700],["Bhopal","Kolkata",1060],
  ["Hyderabad","Bangalore",570],["Hyderabad","Chennai",630],
  ["Bangalore","Chennai",345],["Kolkata","Chennai",1660],
  ["Pune","Hyderabad",560],["Ahmedabad","Bhopal",520],
];

function dijkstra(src, dst) {
  const adj = {};
  Object.keys(CITIES).forEach(c=>adj[c]=[]);
  ROADS.forEach(([u,v,w])=>{ adj[u].push([v,w]); adj[v].push([u,w]); });
  const dist={}, prev={}, vis=new Set();
  Object.keys(CITIES).forEach(c=>{ dist[c]=Infinity; prev[c]=null; }); dist[src]=0;
  const steps=[];
  steps.push({ dist:{...dist}, vis:new Set(), cur:null, log:`Start at ${src}. Set dist[${src}]=0.` });
  while(true) {
    let u=null;
    Object.keys(CITIES).forEach(c=>{ if(!vis.has(c)&&(u===null||dist[c]<dist[u])) u=c; });
    if(!u||dist[u]===Infinity) break;
    vis.add(u);
    steps.push({ dist:{...dist}, vis:new Set(vis), cur:u, log:`Visit ${u} (dist=${dist[u]} km). Checking neighbors...` });
    for(const [v,w] of adj[u]) {
      if(!vis.has(v)&&dist[u]+w<dist[v]) {
        dist[v]=dist[u]+w; prev[v]=u;
        steps.push({ dist:{...dist}, vis:new Set(vis), cur:u, relaxed:v, log:`  Relax ${u}→${v}: ${dist[u]}+${w}=${dist[v]} km ✓` });
      }
    }
  }
  // reconstruct path using a stack (push dest→src, then pop to reverse)
  const stack=[]; let c=dst;
  while(c){ stack.push(c); c=prev[c]; }       // stack: [dst, ..., src]
  const path=[];
  while(stack.length) path.push(stack.pop()); // pop reverses to src→dst
  steps.push({ dist:{...dist}, vis:new Set(vis), path:[...path], done:true, log:`Route found: ${path.join(" → ")} | ${dist[dst]} km total` });
  return { steps, dist, path: path[0]===src?path:[], totalDist:dist[dst] };
}

function NaviRoute({ accent="#00c896" }) {
  const cities = Object.keys(CITIES);
  const [src, setSrc] = useState("Mumbai");
  const [dst, setDst] = useState("Delhi");
  const [result, setResult] = useState(null);
  const p = usePlayer(result?.steps?.length||1);

  const run = ()=>{
    if(src===dst){alert("Source and destination must differ"); return;}
    const r = dijkstra(src,dst);
    setResult(r); p.reset();
  };
  const step = result?.steps?.[p.idx];
  const scale = 1.2;

  const getPath = ()=>step?.path||[];
  const isOnPath=(u,v)=>{ const path=getPath(); for(let i=0;i<path.length-1;i++) if((path[i]===u&&path[i+1]===v)||(path[i]===v&&path[i+1]===u)) return true; return false; };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[["📍 Origin","From",src,setSrc],["🏁 Destination","To",dst,setDst]].map(([label,ph,val,set])=>(
          <div key={ph}>
            <div style={{ fontSize:12, color:T.sub, marginBottom:6 }}>{label}</div>
            <select value={val} onChange={e=>set(e.target.value)} style={{ ...input_s }}>
              {cities.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button onClick={run} style={{ ...btnBase, background:accent, color:"#000", width:"100%", marginBottom:16, fontSize:14 }}>
        🗺️ Find Shortest Route
      </button>

      {/* Map SVG */}
      <div style={{ background:"#0a0f0a", border:`1px solid #1a2a1a`, borderRadius:12, padding:12, marginBottom:12, overflow:"auto" }}>
        <svg viewBox="0 0 520 430" style={{ width:"100%", minWidth:320 }}>
          {/* India silhouette hint lines */}
          {ROADS.map(([u,v,w],i)=>{
            const [x1,y1]=CITIES[u].map(c=>c*scale);
            const [x2,y2]=CITIES[v].map(c=>c*scale);
            const onPath = isOnPath(u,v);
            const mx=(x1+x2)/2, my=(y1+y2)/2;
            const isRelaxed = step&&(step.relaxed===v&&step.cur===u)||(step?.relaxed===u&&step?.cur===v);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={onPath?accent:isRelaxed?"#ffcc44":"#1e2e1e"}
                  strokeWidth={onPath?3:isRelaxed?2:1}
                  strokeDasharray={onPath?"none":"4,3"}/>
                <text x={mx} y={my-4} textAnchor="middle" fontSize={9} fill={onPath?accent:"#2a3a2a"} fontFamily="'DM Mono',monospace">{w}</text>
              </g>
            );
          })}
          {Object.entries(CITIES).map(([name,[cx,cy]])=>{
            const x=cx*scale, y=cy*scale;
            const isSrc=name===src, isDst=name===dst;
            const isVis=step?.vis?.has(name), isCur=step?.cur===name;
            const onPath=getPath().includes(name);
            const d=step?.dist?.[name];
            return (
              <g key={name}>
                <circle cx={x} cy={y} r={isSrc||isDst?14:10}
                  fill={onPath?`${accent}33`:isCur?`${accent}22`:isVis?"#1a2a1a":"#0f1a0f"}
                  stroke={onPath?accent:isCur?accent:isVis?"#2a4a2a":T.border}
                  strokeWidth={onPath||isCur?2:1}/>
                {(isSrc||isDst)&&<text x={x} y={y+5} textAnchor="middle" fontSize={12} fill={accent}>{isSrc?"📍":"🏁"}</text>}
                <text x={x} y={y-16} textAnchor="middle" fontSize={10} fill={onPath?accent:isVis?"#4a6a4a":T.sub} fontWeight={onPath?"700":"400"} fontFamily="'DM Mono',monospace">{name}</text>
                {d!==undefined&&d!==Infinity&&<text x={x} y={y+22} textAnchor="middle" fontSize={9} fill={d===0?accent:"#3a5a3a"} fontFamily="'DM Mono',monospace">{d}km</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {result&&step&&(
        <>
          {step.done&&(
            <div style={{ padding:"12px 16px", background:`${accent}15`, border:`1px solid ${accent}44`, borderRadius:10, marginBottom:12, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:20 }}>✅</span>
              <div>
                <div style={{ fontSize:14, color:T.text, fontWeight:600 }}>Route: {result.path.join(" → ")}</div>
                <div style={{ fontSize:13, color:accent }}>{result.totalDist} km total distance</div>
              </div>
              <div style={{ marginLeft:"auto", textAlign:"right" }}>
                <div style={{ fontSize:12, color:T.sub }}>Est. drive time</div>
                <div style={{ fontSize:15, color:T.text, fontWeight:700 }}>{Math.round(result.totalDist/80)}h {Math.round((result.totalDist/80%1)*60)}m</div>
              </div>
            </div>
          )}
          <StepLog steps={result.steps} curIdx={p.idx} accent={accent}/>
          <PlayerBar idx={p.idx} total={result.steps.length} playing={p.playing} onPlay={()=>p.setPlaying(x=>!x)} onPrev={p.prev} onNext={p.next} onReset={p.reset} accent={accent}/>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   APP 2: PackSort — E-Commerce Order Sorter
   ════════════════════════════════════════════════ */
const ORDERS_DEF = [
  {id:"#A1042",item:"Laptop Pro",weight:2.1,value:85000,priority:"Express",status:"pending"},
  {id:"#A1043",item:"Wireless Buds",weight:0.2,value:3500,priority:"Standard",status:"pending"},
  {id:"#A1044",item:"4K Monitor",weight:7.5,value:32000,priority:"Express",status:"pending"},
  {id:"#A1045",item:"Keyboard",weight:0.8,value:2800,priority:"Standard",status:"pending"},
  {id:"#A1046",item:"Mechanical Watch",weight:0.1,value:120000,priority:"Express",status:"pending"},
  {id:"#A1047",item:"Office Chair",weight:18.0,value:15000,priority:"Standard",status:"pending"},
  {id:"#A1048",item:"Tablet",weight:0.6,value:28000,priority:"Express",status:"pending"},
  {id:"#A1049",item:"Webcam",weight:0.3,value:4200,priority:"Standard",status:"pending"},
];

function mergeSort(arr, key) {
  const steps=[];
  const a=[...arr];
  function merge(arr,l,m,r) {
    const L=arr.slice(l,m+1), R=arr.slice(m+1,r+1);
    steps.push({ arr:[...arr], phase:"merging", l,m,r, log:`Merging ${L.map(x=>x[key]).join(",")} + ${R.map(x=>x[key]).join(",")}` });
    let i=0,j=0,k=l;
    while(i<L.length&&j<R.length) arr[k++]=L[i][key]<=R[j][key]?L[i++]:R[j++];
    while(i<L.length)arr[k++]=L[i++];
    while(j<R.length)arr[k++]=R[j++];
    steps.push({ arr:[...arr], phase:"merged", l,r, log:`Merged → [${arr.slice(l,r+1).map(x=>x[key]).join(", ")}]` });
  }
  function ms(arr,l,r) {
    if(l>=r) return;
    const m=Math.floor((l+r)/2);
    steps.push({ arr:[...arr], phase:"split", l,r,m, log:`Split orders[${l}..${r}] at mid=${m}` });
    ms(arr,l,m); ms(arr,m+1,r); merge(arr,l,m,r);
  }
  ms(a,0,a.length-1);
  steps.push({ arr:[...a], phase:"done", log:`✅ All ${arr.length} orders sorted by ${key}!` });
  return steps;
}

function PackSort({ accent="#ff7d3b" }) {
  const [sortKey,setSortKey]=useState("value");
  const [steps,setSteps]=useState([]);
  const [filterPri,setFilterPri]=useState("All");
  const p=usePlayer(steps.length||1);
  const run=()=>{ const s=mergeSort(ORDERS_DEF,sortKey); setSteps(s); p.reset(); };
  const step=steps[p.idx];
  const orders=step?.arr||ORDERS_DEF;
  const visible=filterPri==="All"?orders:orders.filter(o=>o.priority===filterPri);
  const priColor=pr=>pr==="Express"?"#ff7d3b":"#4d9fff";

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
        <div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:6 }}>Sort by</div>
          <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={{ ...input_s }}>
            <option value="value">Order Value (₹)</option>
            <option value="weight">Package Weight (kg)</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:6 }}>Filter Priority</div>
          <select value={filterPri} onChange={e=>setFilterPri(e.target.value)} style={{ ...input_s }}>
            <option>All</option><option>Express</option><option>Standard</option>
          </select>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end" }}>
          <button onClick={run} style={{ ...btnBase, background:accent, color:"#fff", width:"100%", fontSize:14 }}>
            📦 Sort Orders
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
        {[["Total Orders",ORDERS_DEF.length,""],
          ["Express",ORDERS_DEF.filter(o=>o.priority==="Express").length,"🚀"],
          ["Total Value","₹"+ORDERS_DEF.reduce((s,o)=>s+o.value,0).toLocaleString(),"💰"]
        ].map(([l,v,ic])=>(
          <div key={l} style={{ padding:"10px 12px", background:T.dim, borderRadius:8, textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:700, color:T.text }}>{ic} {v}</div>
            <div style={{ fontSize:11, color:T.sub }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Order cards */}
      <div style={{ maxHeight:280, overflowY:"auto", display:"flex", flexDirection:"column", gap:6, marginBottom:10 }}>
        {visible.map((o,i)=>{
          const isActive=step&&!step.phase==="done"&&(step.l<=i&&i<=step.r);
          return (
            <div key={o.id} style={{ display:"grid", gridTemplateColumns:"60px 1fr 80px 80px 70px", gap:8, padding:"10px 14px",
              background: step?.phase==="done"?`${accent}08`:isActive?T.dim:T.card,
              border:`1px solid ${step?.phase==="done"?accent+"33":T.border}`,
              borderRadius:8, alignItems:"center", fontSize:13, transition:"all .2s" }}>
              <span style={{ fontFamily:"'DM Mono',monospace", color:T.sub, fontSize:12 }}>{o.id}</span>
              <span style={{ color:T.text, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.item}</span>
              <span style={{ color:accent, fontFamily:"'DM Mono',monospace", fontSize:12, textAlign:"right" }}>₹{o.value.toLocaleString()}</span>
              <span style={{ color:T.sub, fontFamily:"'DM Mono',monospace", fontSize:12, textAlign:"right" }}>{o.weight} kg</span>
              <span style={{ ...pill(priColor(o.priority)), textAlign:"center" }}>{o.priority}</span>
            </div>
          );
        })}
      </div>

      {steps.length>0&&step&&(
        <>
          <StepLog steps={steps} curIdx={p.idx} accent={accent}/>
          <PlayerBar idx={p.idx} total={steps.length} playing={p.playing} onPlay={()=>p.setPlaying(x=>!x)} onPrev={p.prev} onNext={p.next} onReset={p.reset} accent={accent}/>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   APP 3: DiffScan — LCS Code Diff Analyzer
   ════════════════════════════════════════════════ */

const DIFF_PRESETS = {
  "JS Function": {
    a: `function authenticate(user, pass) {\n  const hash = md5(pass);\n  if (db.find(user)) {\n    return hash === db.getHash(user);\n  }\n  return false;\n}\n\nmodule.exports = authenticate;`,
    b: `async function authenticate(user, pass, mfa) {\n  const hash = bcrypt.hash(pass, 12);\n  const record = await db.findUser(user);\n  if (!record) return { ok: false, err: 'User not found' };\n  const valid = await bcrypt.compare(pass, record.hash);\n  if (valid && mfa) return verifyMFA(user, mfa);\n  return { ok: valid };\n}\n\nmodule.exports = { authenticate };`,
    lang:"js"
  },
  "Python Class": {
    a: `class Stack:\n    def __init__(self):\n        self.data = []\n\n    def push(self, val):\n        self.data.append(val)\n\n    def pop(self):\n        return self.data.pop()\n\n    def size(self):\n        return len(self.data)`,
    b: `class Stack:\n    def __init__(self, limit=None):\n        self.data = []\n        self.limit = limit\n\n    def push(self, val):\n        if self.limit and len(self.data) >= self.limit:\n            raise OverflowError("Stack is full")\n        self.data.append(val)\n\n    def pop(self):\n        if not self.data:\n            raise IndexError("Stack is empty")\n        return self.data.pop()\n\n    def peek(self):\n        return self.data[-1] if self.data else None\n\n    def size(self):\n        return len(self.data)`,
    lang:"py"
  },
  "JSON Config": {
    a: `{\n  "name": "my-app",\n  "version": "1.0.0",\n  "port": 3000,\n  "database": {\n    "host": "localhost",\n    "port": 5432\n  },\n  "debug": true\n}`,
    b: `{\n  "name": "my-app",\n  "version": "2.0.0",\n  "port": 8080,\n  "database": {\n    "host": "db.prod.internal",\n    "port": 5432,\n    "pool": 10,\n    "ssl": true\n  },\n  "redis": { "host": "cache.internal" },\n  "debug": false,\n  "logLevel": "warn"\n}`,
    lang:"json"
  },
};

const KEYWORDS = { js:["function","async","await","const","let","var","return","if","else","true","false","null","undefined","class","new","import","export","module"], py:["def","class","return","if","elif","else","import","from","True","False","None","raise","self","not","and","or","in"], json:[], css:[] };

function syntaxColor(line, lang) {
  if(!lang||lang==="json") return [{ text:line, color:"#c9d1d9" }];
  const kws = KEYWORDS[lang]||[];
  const parts = [];
  let remaining = line;
  const commentChar = lang==="py"?"#":"//";
  if(remaining.trimStart().startsWith(commentChar)){ return [{ text:remaining, color:"#6a9955" }]; }
  const strMatch = remaining.match(/(['"`]).*?\1/);
  if(strMatch){ const idx=remaining.indexOf(strMatch[0]); if(idx>0) parts.push({text:remaining.slice(0,idx),color:"#c9d1d9"}); parts.push({text:strMatch[0],color:"#ce9178"}); remaining=remaining.slice(idx+strMatch[0].length); }
  const words = remaining.split(/(\s+|[(){},.:;=<>!+\-*/[\]])/);
  for(const w of words){ if(kws.includes(w.trim())) parts.push({text:w,color:"#569cd6"}); else if(/^\d+$/.test(w.trim())) parts.push({text:w,color:"#b5cea8"}); else parts.push({text:w,color:"#c9d1d9"}); }
  return parts;
}

function computeLCS(A, B) {
  const m=A.length, n=B.length;
  const dp=Array(m+1).fill(null).map(()=>Array(n+1).fill(0));
  const steps=[];
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) {
    if(A[i-1]===B[j-1]){ dp[i][j]=dp[i-1][j-1]+1;
      steps.push({ dp:dp.map(r=>[...r]),i,j,match:true, log:`Match line ${i} = line ${j}: "${A[i-1].trim().slice(0,40)}"` });
    } else { dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
      steps.push({ dp:dp.map(r=>[...r]),i,j,match:false, log:`No match: dp[${i}][${j}] = max(${dp[i-1][j]},${dp[i][j-1]}) = ${dp[i][j]}` });
    }
  }
  let i=m,j=n; const lcs=[];
  while(i>0&&j>0){ if(A[i-1]===B[j-1]){lcs.unshift(A[i-1]);i--;j--;} else if(dp[i-1][j]>dp[i][j-1])i--; else j--; }
  const adds=B.filter(x=>!lcs.includes(x)).length;
  const dels=A.filter(x=>!lcs.includes(x)).length;
  const similarity=Math.round((lcs.length*2/(A.length+B.length))*100);
  steps.push({ dp:dp.map(r=>[...r]),done:true, log:`✅ LCS=${dp[m][n]} lines. +${adds} added  -${dels} removed  ~${similarity}% similar` });
  return { steps, lcs, dp, adds, dels, similarity, lcsLen:dp[m][n] };
}

function buildUnifiedDiff(A, B, lcs) {
  const diff=[]; let ai=0,bi=0,li=0;
  while(ai<A.length||bi<B.length){
    if(li<lcs.length&&ai<A.length&&A[ai]===lcs[li]&&bi<B.length&&B[bi]===lcs[li]){ diff.push({type:"same",a:A[ai],b:B[bi],aln:ai+1,bln:bi+1}); ai++;bi++;li++; }
    else if(bi<B.length&&(li>=lcs.length||B[bi]!==lcs[li])){ diff.push({type:"add",b:B[bi],bln:bi+1}); bi++; }
    else if(ai<A.length){ diff.push({type:"del",a:A[ai],aln:ai+1}); ai++; }
    else bi++;
  }
  return diff;
}

function SyntaxLine({ text, lang, color }) {
  const parts = syntaxColor(text, lang);
  return <span style={{ color }}>{parts.map((p,i)=><span key={i} style={{ color:color||p.color }}>{p.text}</span>)}</span>;
}

function DiffScan({ accent="#bf7fff" }) {
  const [preset, setPreset] = useState("JS Function");
  const [v1, setV1] = useState(DIFF_PRESETS["JS Function"].a);
  const [v2, setV2] = useState(DIFF_PRESETS["JS Function"].b);
  const [lang, setLang] = useState("js");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("diff");
  const [diffMode, setDiffMode] = useState("unified");
  const p = usePlayer(result?.steps?.length||1);

  const loadPreset = (name) => {
    const pr = DIFF_PRESETS[name];
    setPreset(name); setV1(pr.a); setV2(pr.b); setLang(pr.lang); setResult(null);
  };

  const run = () => {
    const A=v1.split("\n"), B=v2.split("\n");
    if(A.length>20||B.length>20){ alert("Keep files ≤ 20 lines for DP table clarity"); return; }
    const r=computeLCS(A,B); setResult(r); setTab("diff"); p.reset();
  };

  const A = v1.split("\n"), B = v2.split("\n");
  const diff = result ? buildUnifiedDiff(A, B, result.lcs) : [];
  const step = result?.steps?.[p.idx];

  const adds=diff.filter(d=>d.type==="add").length;
  const dels=diff.filter(d=>d.type==="del").length;
  const same=diff.filter(d=>d.type==="same").length;
  const sim=result?.similarity||0;

  const lineStyle=(type)=>({
    display:"flex", gap:0, fontFamily:"'DM Mono',monospace", fontSize:11.5, lineHeight:"20px",
    background:type==="add"?"#0d2a1a":type==="del"?"#2a0d0d":"transparent",
    borderLeft:`3px solid ${type==="add"?"#2ea04326":type==="del"?"#f8514926":"transparent"}`,
  });

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <select value={preset} onChange={e=>loadPreset(e.target.value)}
          style={{ ...input_s, width:"auto", flex:1, minWidth:140, fontSize:12 }}>
          {Object.keys(DIFF_PRESETS).map(k=><option key={k}>{k}</option>)}
        </select>
        <div style={{ display:"flex", background:T.dim, borderRadius:8, overflow:"hidden", border:`1px solid ${T.border}`, flexShrink:0 }}>
          {["unified","split"].map(m=>(
            <button key={m} onClick={()=>setDiffMode(m)} style={{ ...btnBase, padding:"7px 14px", fontSize:11, borderRadius:0, textTransform:"capitalize",
              background:diffMode===m?`${accent}22`:"transparent", color:diffMode===m?accent:T.sub, border:"none" }}>{m}</button>
          ))}
        </div>
        <button onClick={run} style={{ ...btnBase, background:accent, color:"#fff", padding:"8px 18px", flexShrink:0 }}>🔍 Compare</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
        {[["Version A — Before",v1,setV1,"#ff4d6d"],["Version B — After",v2,setV2,"#00c896"]].map(([label,val,set,lc])=>(
          <div key={label}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background:T.dim, borderRadius:"8px 8px 0 0", border:`1px solid ${T.border}`, borderBottom:"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:lc }}/>
              <span style={{ fontSize:11, color:T.sub, fontFamily:"'DM Mono',monospace" }}>{label}</span>
            </div>
            <textarea value={val} onChange={e=>set(e.target.value)}
              style={{ ...input_s, height:130, resize:"vertical", fontFamily:"'DM Mono',monospace", fontSize:11, lineHeight:1.6, borderRadius:"0 0 8px 8px", borderTop:"none" }}/>
          </div>
        ))}
      </div>

      {result&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6, marginBottom:12 }}>
          {[
            ["Unchanged",same,"#4a4a6a","≡"],
            ["Added",adds,"#2ea043","+"],
            ["Removed",dels,"#f85149","−"],
            ["LCS Length",result.lcsLen,accent,"∩"],
            ["Similarity",`${sim}%`,sim>=70?"#2ea043":sim>=40?"#ffcc44":"#f85149","~"],
          ].map(([l,v,c,sym])=>(
            <div key={l} style={{ padding:"10px 8px", background:`${c}12`, border:`1px solid ${c}30`, borderRadius:8, textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:800, color:c, fontFamily:"'DM Mono',monospace" }}>{sym}{v}</div>
              <div style={{ fontSize:10, color:T.sub, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {result&&(
        <>
          <div style={{ display:"flex", gap:4, marginBottom:0, borderBottom:`1px solid ${T.border}` }}>
            {[["diff","📄 Diff View"],["dp","🧬 DP Table"],["log","📋 Trace Log"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{ ...btnBase, padding:"8px 14px", fontSize:12, borderRadius:"6px 6px 0 0", border:`1px solid ${tab===id?T.border:"transparent"}`, borderBottom:`1px solid ${tab===id?T.card:"transparent"}`, marginBottom:-1, background:tab===id?T.card:"transparent", color:tab===id?accent:T.sub }}>{label}</button>
            ))}
          </div>

          <div style={{ background:"#080810", border:`1px solid ${T.border}`, borderTop:"none", borderRadius:"0 8px 8px 8px", overflow:"hidden" }}>
            {tab==="diff"&&diffMode==="unified"&&(
              <div style={{ maxHeight:360, overflowY:"auto" }}>
                <div style={{ display:"flex", gap:16, padding:"6px 14px", background:"#0d0d18", borderBottom:`1px solid ${T.border}`, fontSize:11, color:T.sub, fontFamily:"'DM Mono',monospace" }}>
                  <span style={{ color:"#f85149" }}>--- a/file.{lang}</span>
                  <span style={{ color:"#2ea043" }}>+++ b/file.{lang}</span>
                </div>
                {diff.map((d,i)=>(
                  <div key={i} style={lineStyle(d.type)}>
                    <span style={{ width:40, flexShrink:0, color:"#3a3a5a", padding:"0 8px", textAlign:"right", userSelect:"none", borderRight:`1px solid ${T.border}`, fontSize:10 }}>{d.aln||""}</span>
                    <span style={{ width:40, flexShrink:0, color:"#3a3a5a", padding:"0 8px", textAlign:"right", userSelect:"none", borderRight:`1px solid ${T.border}`, fontSize:10 }}>{d.bln||""}</span>
                    <span style={{ width:16, flexShrink:0, padding:"0 4px", color:d.type==="add"?"#2ea043":d.type==="del"?"#f85149":"#3a3a5a", fontWeight:700 }}>{d.type==="add"?"+":d.type==="del"?"−":" "}</span>
                    <span style={{ padding:"0 8px", color:d.type==="add"?"#7ee787":d.type==="del"?"#ff7b72":"#8b949e", flex:1 }}>
                      <SyntaxLine text={d.a||d.b||""} lang={lang} color={d.type==="add"?"#7ee787":d.type==="del"?"#ff7b72":null}/>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tab==="diff"&&diffMode==="split"&&(
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", maxHeight:360, overflowY:"auto" }}>
                <div style={{ borderRight:`1px solid ${T.border}` }}>
                  <div style={{ padding:"5px 12px", background:"#0d0d18", borderBottom:`1px solid ${T.border}`, fontSize:10, color:"#f85149", fontFamily:"'DM Mono',monospace" }}>a/file.{lang}</div>
                  {diff.filter(d=>d.type!=="add").map((d,i)=>(
                    <div key={i} style={{ ...lineStyle(d.type==="del"?"del":"same"), padding:"0" }}>
                      <span style={{ width:32, flexShrink:0, padding:"0 6px", textAlign:"right", color:"#3a3a5a", fontSize:10, borderRight:`1px solid ${T.border}`, userSelect:"none" }}>{d.aln}</span>
                      <span style={{ padding:"0 8px", fontSize:11.5, color:d.type==="del"?"#ff7b72":"#8b949e", flex:1, fontFamily:"'DM Mono',monospace" }}>{d.a||""}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ padding:"5px 12px", background:"#0d0d18", borderBottom:`1px solid ${T.border}`, fontSize:10, color:"#2ea043", fontFamily:"'DM Mono',monospace" }}>b/file.{lang}</div>
                  {diff.filter(d=>d.type!=="del").map((d,i)=>(
                    <div key={i} style={{ ...lineStyle(d.type==="add"?"add":"same"), padding:"0" }}>
                      <span style={{ width:32, flexShrink:0, padding:"0 6px", textAlign:"right", color:"#3a3a5a", fontSize:10, borderRight:`1px solid ${T.border}`, userSelect:"none" }}>{d.bln}</span>
                      <span style={{ padding:"0 8px", fontSize:11.5, color:d.type==="add"?"#7ee787":"#8b949e", flex:1, fontFamily:"'DM Mono',monospace" }}>{d.b||""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab==="dp"&&(
              <div style={{ padding:12 }}>
                <div style={{ fontSize:12, color:T.sub, marginBottom:10, fontFamily:"'DM Mono',monospace" }}>
                  DP table — dp[i][j] = LCS length of A[0..i] and B[0..j]
                </div>
                <PlayerBar idx={p.idx} total={result.steps.length} playing={p.playing} onPlay={()=>p.setPlaying(x=>!x)} onPrev={p.prev} onNext={p.next} onReset={p.reset} accent={accent}/>
                <div style={{ marginTop:12, overflowX:"auto" }}>
                  <table style={{ borderCollapse:"collapse", fontSize:11, fontFamily:"'DM Mono',monospace" }}>
                    <thead>
                      <tr>
                        <td style={{ padding:"4px 6px", color:T.sub, minWidth:28, textAlign:"center" }}/>
                        <td style={{ padding:"4px 6px", color:"#6a6a8a", textAlign:"center", borderBottom:`1px solid ${T.border}` }}>""</td>
                        {B.map((line,j)=><td key={j} style={{ padding:"2px 6px", color:"#2ea043", textAlign:"center", maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:9, borderBottom:`1px solid ${T.border}` }}>{line.trim().slice(0,12)}</td>)}
                      </tr>
                    </thead>
                    <tbody>
                      {(step?.dp||[]).map((row,i)=>(
                        <tr key={i}>
                          <td style={{ padding:"2px 8px", color:"#f85149", fontSize:9, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", borderRight:`1px solid ${T.border}` }}>{i===0?'""':A[i-1]?.trim().slice(0,12)}</td>
                          {row.map((v,j)=>{
                            const active=step&&!step.done&&step.i===i&&step.j===j;
                            const match=active&&step.match;
                            return <td key={j} style={{ padding:"3px 6px", textAlign:"center", minWidth:26, height:22,
                              background:match?`${accent}44`:active?`${accent}22`:v>0?"#1a1a2a":"transparent",
                              border:`1px solid ${active?accent:T.border}`,
                              color:match?accent:active?`${accent}aa`:v>0?"#6b6baa":T.dim,
                              fontWeight:active||v>0?"700":"400", borderRadius:3, transition:"all .15s" }}>{v}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {step&&<div style={{ marginTop:10, padding:"8px 12px", background:step.match?`${accent}15`:"#1a1a2a", border:`1px solid ${step.match?accent:T.border}`, borderRadius:6, fontSize:12, color:step.match?accent:"#8b949e", fontFamily:"'DM Mono',monospace" }}>{step.log}</div>}
              </div>
            )}

            {tab==="log"&&(
              <div style={{ maxHeight:360, overflowY:"auto", padding:12 }}>
                <StepLog steps={result.steps} curIdx={result.steps.length-1} accent={accent}/>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   APP 6: ShiftBoard — N-Queens Staff Scheduler
   ════════════════════════════════════════════════ */
const SHIFTS = ["Morning (6am-2pm)","Afternoon (2pm-10pm)","Night (10pm-6am)","On-Call"];
const STAFF_ROLES = ["Dr. Mehta","Dr. Sharma","Dr. Patel","Dr. Gupta","Dr. Rao","Dr. Singh","Dr. Khan","Dr. Nair"];

function solveNQueens(n) {
  const board=Array(n).fill(-1);
  const steps=[];
  function safe(r,c){ for(let k=0;k<r;k++) if(board[k]===c||Math.abs(board[k]-c)===Math.abs(k-r)) return false; return true; }
  function solve(r) {
    if(r===n){
      steps.push({board:[...board],type:"sol",log:`✅ Valid schedule found for all ${n} staff!`}); return true;
    }
    for(let c=0;c<n;c++) {
      if(safe(r,c)){
        board[r]=c;
        steps.push({board:[...board],type:"place",r,c,log:`Assign ${STAFF_ROLES[r]||"Staff "+(r+1)} → ${SHIFTS[c%4]}`});
        if(solve(r+1)) return true;
        board[r]=-1;
        steps.push({board:[...board],type:"back",r,c,log:`↩ Conflict! Reassign ${STAFF_ROLES[r]||"Staff "+(r+1)}`});
      }
    }
    return false;
  }
  solve(0); return steps;
}

function ShiftBoard({ accent="#ff4d6d" }) {
  const [n,setN]=useState(6);
  const [steps,setSteps]=useState([]);
  const p=usePlayer(steps.length||1);
  const run=()=>{ setSteps(solveNQueens(n)); p.reset(); };
  const step=steps[p.idx];
  const shiftColor=["#00c896","#4d9fff","#bf7fff","#ffcc44"];
  const shiftColors=["#00c89622","#4d9fff22","#bf7fff22","#ffcc4422"];

  return (
    <div>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:6 }}>Number of staff</div>
          <select value={n} onChange={e=>setN(+e.target.value)} style={{ ...input_s, width:100 }}>
            {[4,5,6,7,8].map(v=><option key={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ marginLeft:"auto" }}>
          <button onClick={run} style={{ ...btnBase, background:accent, color:"#fff" }}>🗓️ Schedule Staff</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        {SHIFTS.slice(0,4).map((s,i)=>(
          <div key={s} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.sub }}>
            <div style={{ width:10,height:10,borderRadius:2,background:shiftColor[i] }}/>
            {s}
          </div>
        ))}
      </div>

      {/* Scheduling Board */}
      <div style={{ background:"#0a0a0f", border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden", marginBottom:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:`140px repeat(${Math.min(n,4)},1fr)`, borderBottom:`1px solid ${T.border}` }}>
          <div style={{ padding:"8px 12px", fontSize:11, color:T.sub, fontWeight:600 }}>STAFF</div>
          {SHIFTS.slice(0,Math.min(n,4)).map((s,i)=>(
            <div key={s} style={{ padding:"8px 8px", fontSize:11, color:shiftColor[i], fontWeight:600, textAlign:"center", borderLeft:`1px solid ${T.border}` }}>{s.split(" ")[0]}</div>
          ))}
        </div>
        {Array(n).fill(0).map((_,r)=>{
          const assigned=step?.board?.[r];
          const isActive=step&&step.r===r;
          const didBacktrack=step?.type==="back"&&step?.r===r;
          return (
            <div key={r} style={{ display:"grid", gridTemplateColumns:`140px repeat(${Math.min(n,4)},1fr)`, borderBottom:`1px solid ${T.border}`,
              background: didBacktrack?`${accent}10`:isActive?"#ffffff06":"transparent" }}>
              <div style={{ padding:"10px 12px", fontSize:12, color: assigned>=0?T.text:T.sub, fontWeight: assigned>=0?"600":"400" }}>
                {STAFF_ROLES[r]||`Staff ${r+1}`}
                {didBacktrack&&<span style={{ color:accent, marginLeft:6 }}>↩</span>}
              </div>
              {Array(Math.min(n,4)).fill(0).map((_,c)=>{
                const active=assigned===c&&assigned>=0;
                return (
                  <div key={c} style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:36, borderLeft:`1px solid ${T.border}`,
                    background: active?shiftColors[c%4]:isActive&&c===step?.c?`${accent}10`:"transparent" }}>
                    {active&&<span style={{ color:shiftColor[c%4], fontWeight:700, fontSize:13 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {steps.length>0&&step&&(
        <>
          {step.type==="sol"&&(
            <div style={{ padding:"10px 14px", background:`${accent}12`, border:`1px solid ${accent}33`, borderRadius:8, marginBottom:10, fontSize:13, color:accent, fontWeight:600 }}>
              ✅ Conflict-free schedule generated! Every staff member has exactly one non-conflicting shift.
            </div>
          )}
          <StepLog steps={steps} curIdx={p.idx} accent={accent}/>
          <PlayerBar idx={p.idx} total={steps.length} playing={p.playing} onPlay={()=>p.setPlaying(x=>!x)} onPrev={p.prev} onNext={p.next} onReset={p.reset} accent={accent}/>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   APP SHELL — wraps each app in its full-page UI
   ════════════════════════════════════════════════ */
const APP_COMPONENTS = { naviRoute:NaviRoute, packSort:PackSort, diffScan:DiffScan, shiftBoard:ShiftBoard };

function AppShell({ app, onBack }) {
  const Comp = APP_COMPONENTS[app.id];
  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      {/* App header bar */}
      <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"0 24px", height:56, display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:50 }}>
        <span style={{ fontSize:22 }}>{app.icon}</span>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:T.text, lineHeight:1 }}>{app.name}</div>
          <div style={{ fontSize:11, color:T.sub }}>{app.tagline}</div>
        </div>
        <div style={{ display:"flex", gap:6, marginLeft:8 }}>
          <Tag label={app.algo} color={app.accent}/>
          <Tag label={app.paradigm} color={T.sub}/>
        </div>
        <button onClick={onBack} style={{ ...btnBase, marginLeft:"auto", background:T.dim, color:T.sub, padding:"6px 14px", fontSize:12 }}>✕ Close</button>
      </div>

      {/* App body */}
      <div style={{ width:"100%", maxWidth:"100%", margin:0, padding:"28px 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 340px", gap:20, width:"100%" }}>
          {/* Main panel */}
          <div>
            <Comp accent={app.accent}/>
          </div>
          {/* Info sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* Real-world context */}
            <div style={{ ...card(), padding:18 }}>
              <div style={{ fontSize:12, color:app.accent, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>🌍 Real-World Context</div>
              <RealWorldInfo appId={app.id} accent={app.accent}/>
            </div>
            {/* Algorithm info */}
            <div style={{ ...card(), padding:18 }}>
              <div style={{ fontSize:12, color:T.sub, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>⚙️ Algorithm Info</div>
              <AlgoInfo appId={app.id} accent={app.accent}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RealWorldInfo({ appId, accent }) {
  const info = {
    naviRoute: { who:"Google Maps, Apple Maps, Uber, Ola", why:"Every time you request a route, Dijkstra (or its variant A*) explores roads greedily, always expanding the nearest unvisited city first.", impact:"Powers 1B+ daily navigation requests globally." },
    packSort:  { who:"Amazon, Flipkart, Meesho, Zomato", why:"Warehouses sort thousands of orders every minute by priority, delivery zone, or value. Merge Sort is preferred for stability — equal priorities keep their original order.", impact:"Reduces dispatch time by ~40% vs unsorted queues." },
    diffScan:  { who:"Git, GitHub, VS Code, Gerrit, Bitbucket", why:"LCS finds lines that stayed identical. Additions (+) and deletions (−) are everything outside the LCS. Unified & split views mirror exactly how GitHub renders PRs.", impact:"Every git diff, PR review and merge conflict resolution worldwide." },
    shiftBoard:{ who:"Hospitals, Factories, Airlines, Call Centers", why:"N-Queens models the constraint that no two staff with the same specialty share the same shift. Backtracking explores all valid assignments.", impact:"Reduces scheduling conflicts in 24×7 operations." },
  };
  const d = info[appId];
  return (
    <div>
      <div style={{ fontSize:12, color:T.sub, marginBottom:6 }}>Used by</div>
      <div style={{ fontSize:13, color:T.text, fontWeight:600, marginBottom:10 }}>{d.who}</div>
      <div style={{ fontSize:12, color:"#8888aa", lineHeight:1.7, marginBottom:10 }}>{d.why}</div>
      <div style={{ fontSize:12, color:accent, background:`${accent}10`, padding:"6px 10px", borderRadius:6, border:`1px solid ${accent}22` }}>{d.impact}</div>
    </div>
  );
}

function AlgoInfo({ appId, accent }) {
  const info = {
    naviRoute:  { time:"O((V+E) log V)", space:"O(V)", paradigm:"Greedy", note:"Uses min-heap for O(log V) extractions" },
    packSort:   { time:"O(n log n)", space:"O(n)", paradigm:"Divide & Conquer", note:"Stable sort — preserves equal-priority order" },
    diffScan:   { time:"O(mn)", space:"O(mn)", paradigm:"Dynamic Programming", note:"Optimal substructure: LCS(X,Y) = LCS(X-1,Y-1)+1 on match" },
    shiftBoard: { time:"O(n!)", space:"O(n)", paradigm:"Backtracking", note:"Constraint propagation prunes most branches early" },
  };
  const d = info[appId];
  return (
    <div>
      {[["Paradigm",d.paradigm,accent],["Time",d.time,"#ffcc44"],["Space",d.space,"#4d9fff"]].map(([l,v,c])=>(
        <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.border}`, fontSize:12 }}>
          <span style={{ color:T.sub }}>{l}</span>
          <span style={{ color:c, fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop:10, fontSize:11, color:"#6868a0", lineHeight:1.6, fontStyle:"italic" }}>💡 {d.note}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HOME — App Launcher Dashboard
   ════════════════════════════════════════════════ */
function Home({ onOpen }) {
  return (
    <div style={{ width:"100%", maxWidth:"100%", margin:0, padding:"48px 20px" }}>
      {/* Hero */}
      <div style={{ marginBottom:52 }}>
        <div style={{ fontSize:11, letterSpacing:4, color:"#4d4d6a", textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:16 }}>
          B.Tech Computer Science · Design &amp; Analysis of Algorithms
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,54px)", fontWeight:700, margin:"0 0 16px", lineHeight:1.1, color:T.text, letterSpacing:-1 }}>
          Algorithm Applications<br/>
          <span style={{ fontWeight:300, color:"#4d4d6a" }}>Suite</span>
        </h1>
        <p style={{ fontSize:15, color:"#6868a0", maxWidth:520, lineHeight:1.8, margin:0 }}>
          Four production-grade tools, each powered by a core DAA algorithm. See how the theory you learned actually runs the world around you.
        </p>
      </div>

      {/* App grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14, marginBottom:52 }}>
        {APPS.map(app=>(
          <AppCard key={app.id} app={app} onClick={()=>onOpen(app)}/>
        ))}
      </div>

      {/* Paradigm summary */}
      <div style={{ ...card(), padding:28, marginBottom:28 }}>
        <div style={{ fontSize:13, color:T.sub, fontWeight:600, marginBottom:20, textTransform:"uppercase", letterSpacing:1 }}>
          Algorithm Paradigms Covered
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          {[
            { name:"Divide & Conquer", desc:"Split → Solve → Combine", app:"PackSort (Merge Sort)", color:"#ff7d3b" },
            { name:"Greedy", desc:"Local optimal at each step", app:"NaviRoute", color:"#00c896" },
            { name:"Dynamic Programming", desc:"Store & reuse subresults", app:"DiffScan (LCS)", color:"#bf7fff" },
            { name:"Backtracking", desc:"Try → Fail → Undo → Retry", app:"ShiftBoard (N-Queens)", color:"#ff4d6d" },
          ].map(p=>(
            <div key={p.name} style={{ padding:14, background:T.bg, borderRadius:10, border:`1px solid ${p.color}22` }}>
              <div style={{ fontSize:13, fontWeight:700, color:p.color, marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:12, color:"#5a5a7a", marginBottom:8 }}>{p.desc}</div>
              <div style={{ fontSize:11, color:T.sub, fontFamily:"'DM Mono',monospace" }}>→ {p.app}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:"center", fontSize:12, color:"#2a2a3a", fontFamily:"'DM Mono',monospace" }}>
        DAA Algorithm Applications Suite · All algorithms implemented from scratch · No external libraries
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════════ */
export default function App() {
  const [activeApp, setActiveApp] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{FONT}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:#0a0a0f} ::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:3px} select option{background:#111118}`}</style>

      {!activeApp&&(
        <nav style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"0 24px", height:52, display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:50 }}>
          <span style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:"'DM Mono',monospace" }}>DAA</span>
          <span style={{ width:1, height:20, background:T.border }}/>
          <span style={{ fontSize:13, color:T.sub }}>Algorithm Applications Suite</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            <Tag label="4 Algorithms" color="#4d9fff"/>
            <Tag label="4 Paradigms" color="#00c896"/>
          </div>
        </nav>
      )}

      {activeApp
        ? <AppShell app={activeApp} onBack={()=>setActiveApp(null)}/>
        : <Home onOpen={setActiveApp}/>
      }
    </div>
  );
}

