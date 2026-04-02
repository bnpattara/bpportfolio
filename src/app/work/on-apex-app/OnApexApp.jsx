import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ─── FONTS + KEYFRAMES ──────────────────────────────────────
function useGlobal() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html,body{height:100%;overflow:hidden;-webkit-font-smoothing:antialiased}
      body{background:#0C0C0C;font-family:'DM Sans',sans-serif;user-select:none;-webkit-tap-highlight-color:transparent}
      *{scrollbar-width:none}*::-webkit-scrollbar{display:none}
      button{cursor:pointer;border:none;background:none;font-family:inherit;padding:0;color:inherit}
      input{font-family:'DM Sans',sans-serif;outline:none}

      @keyframes fadeUp    {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn    {from{opacity:0}to{opacity:1}}
      @keyframes blink     {0%,100%{opacity:1}50%{opacity:.08}}
      @keyframes scan      {0%{top:8%;opacity:0}7%{opacity:.22}93%{opacity:.22}100%{top:92%;opacity:0}}
      @keyframes pulseRing {0%,100%{box-shadow:0 0 0 3px rgba(232,255,60,.25),0 0 0 7px rgba(232,255,60,.08)}50%{box-shadow:0 0 0 6px rgba(232,255,60,.32),0 0 0 13px rgba(232,255,60,.04)}}
      @keyframes shimmer   {from{background-position:200% 0}to{background-position:-200% 0}}
      @keyframes barRise   {from{transform:scaleY(0)}to{transform:scaleY(1)}}
      @keyframes voltPop   {0%{transform:scale(.45);opacity:0}65%{transform:scale(1.07)}100%{transform:scale(1);opacity:1}}
      @keyframes ripple    {from{transform:scale(0);opacity:.35}to{transform:scale(3.5);opacity:0}}
      @keyframes slideUp   {from{transform:translateY(100%)}to{transform:translateY(0)}}
      @keyframes slideDown {from{transform:translateY(0)}to{transform:translateY(110%)}}
      @keyframes gpsRing   {0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
      @keyframes countUp   {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes toastIn   {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes toastOut  {from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(12px)}}
      @keyframes scaleMap  {from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes pullScan  {from{left:-30%}to{left:100%}}
      @keyframes longRing  {from{transform:scale(1);opacity:.5}to{transform:scale(1.5);opacity:0}}

      .blink      {animation:blink 1s step-end infinite}
      .scan-line  {animation:scan 3.4s ease-in-out infinite;position:absolute;left:0;right:0;height:1px}
      .pulse-dot  {animation:pulseRing 2s ease-in-out infinite}
      .volt-pop   {animation:voltPop .42s cubic-bezier(.34,1.56,.64,1) both}
      .sk         {background:linear-gradient(90deg,rgba(0,0,0,.05) 25%,rgba(0,0,0,.11) 50%,rgba(0,0,0,.05) 75%);background-size:400% 100%;animation:shimmer 1.5s ease-in-out infinite}
      .sk-d       {background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:400% 100%;animation:shimmer 1.5s ease-in-out infinite}
      .map-in     {animation:scaleMap .38s cubic-bezier(.34,1.56,.64,1) both}
    `;
    document.head.appendChild(style);
    return () => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
        if (style.parentNode) style.parentNode.removeChild(style);
      } catch (_) {}
    };
  }, []);
}

// ─── TOKENS ─────────────────────────────────────────────────
const L = {
  bg:"#F7F7F3",card:"#FFFFFF",lift:"#EDEDE8",
  rule:"rgba(0,0,0,0.08)",ruleHard:"rgba(0,0,0,0.15)",
  ink:"#0A0A0A",ink2:"#3C3C38",ink3:"#888880",ink4:"#C0C0B8",
  volt:"#E8FF3C",voltDim:"#C8DF00",
  pos:"#0A7A3E",warn:"#B85800",neg:"#C03020",
};
const D = {
  bg:"#050505",card:"#0E0E0E",lift:"#181818",
  rule:"rgba(255,255,255,0.07)",ruleHard:"rgba(255,255,255,0.14)",
  ink:"#F0F0EA",ink2:"#A8A8A0",ink3:"#585852",ink4:"#2C2C28",
  volt:"#E8FF3C",voltDim:"#C8DF00",
  pos:"#2EC870",warn:"#E89030",neg:"#E05040",
};

// ─── HELPERS ────────────────────────────────────────────────
const pad = n => String(n).padStart(2,"0");
const fmtClock = s => `${pad(Math.floor(s/60))}:${pad(s%60)}`;
const fmtPace  = s => `${Math.floor(s/60)}:${pad(s%60)}`;

// Haptic, Web Vibration API, graceful fallback
const haptic = (type="light") => {
  try {
    if(!navigator?.vibrate) return;
    if(type==="light")   navigator.vibrate(8);
    if(type==="medium")  navigator.vibrate(18);
    if(type==="warning") navigator.vibrate([12,8,12]);
  } catch (_) {}
};

// ─── RUN ENGINE ─────────────────────────────────────────────
const RUN0 = {elapsed:0,km:0,pace:295,hr:148,cadence:170,zone:1,active:false,paused:false,shoe:"Cloudmonster 2"};
function runR(st,ac) {
  switch(ac.type) {
    case "START":    return {...st,active:true,paused:false,shoe:ac.shoe||st.shoe};
    case "PAUSE":    return {...st,paused:true};
    case "RESUME":   return {...st,paused:false};
    case "RESET":    return {...RUN0};
    case "TICK": {
      if(!st.active||st.paused) return st;
      const e=st.elapsed+1;
      const p=Math.round(Math.max(245,Math.min(370,st.pace+(Math.random()-.5)*10)));
      const h=Math.min(188,Math.max(138,st.hr+Math.round((Math.random()-.5)*4)));
      const c=Math.min(186,Math.max(160,st.cadence+Math.round((Math.random()-.5)*3)));
      const k=+(st.km+1/p).toFixed(3);
      const z=p<255?4:p<278?3:p<305?2:p<335?1:0;
      return {...st,elapsed:e,km:k,pace:p,hr:h,cadence:c,zone:z};
    }
    default: return st;
  }
}

// ─── TOAST SYSTEM ───────────────────────────────────────────
function useToast() {
  const [toasts,setToasts] = useState([]);
  const show = useCallback((msg,icon="✓") => {
    haptic("medium");
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,icon}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  },[]);
  return {toasts,show};
}

function ToastLayer({toasts,C}) {
  return (<div style={{position:"absolute",bottom:96,left:16,right:16,zIndex:500,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          display:"flex",alignItems:"center",gap:10,
          padding:"12px 16px",
          background:C.ink,
          boxShadow:"0 4px 24px rgba(0,0,0,0.3)",
          animation:"toastIn .3s cubic-bezier(0,0,.2,1) both",
        }}>
          <span style={{fontSize:14}}>{t.icon}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.bg,flex:1}}>{t.msg}</span>
          <div style={{width:3,height:3,borderRadius:"50%",background:C.volt,flexShrink:0}}/>
        </div>))}
    </div>);
}

// ─── ATOMS ──────────────────────────────────────────────────
const M = ({c,sz=9,sp="0.12em",up=true,children,sx={}}) => (<span style={{fontFamily:"'DM Mono',monospace",fontSize:sz,letterSpacing:sp,textTransform:up?"uppercase":"none",color:c,lineHeight:1,...sx}}>{children}</span>);
const F = ({n,sz=80,c,sx={}}) => (<span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:sz,lineHeight:.88,letterSpacing:"0.02em",color:c,...sx}}>{n}</span>);
const HR = ({c,sx={}}) => <div style={{height:1,background:c,...sx}}/>;

// Tap-ripple + haptic
function TapBtn({children,onClick,sx={},dark=false,hapticType="light"}) {
  const r = useRef();
  function tap(e) {
    haptic(hapticType);
    const el=r.current; if(!el) return;
    const rc=el.getBoundingClientRect();
    const sz=Math.max(rc.width,rc.height)*2.5;
    const d=document.createElement("div");
    d.style.cssText=`position:absolute;left:${e.clientX-rc.left-sz/2}px;top:${e.clientY-rc.top-sz/2}px;width:${sz}px;height:${sz}px;border-radius:50%;pointer-events:none;z-index:999;background:${dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)"};animation:ripple .55s ease-out forwards`;
    el.appendChild(d);
    setTimeout(()=>d.remove(),600);
    onClick&&onClick(e);
  }
  return <button ref={r} onPointerDown={tap} style={{position:"relative",overflow:"hidden",...sx}}>{children}</button>;
}

// Long-press button, 400ms hold → action sheet
function LongPressBtn({children,onLongPress,onClick,sx={},C}) {
  const timer = useRef(null);
  const [pressing,setPressing] = useState(false);

  function pd(e) {
    setPressing(true);
    timer.current = setTimeout(()=>{
      haptic("medium");
      setPressing(false);
      onLongPress&&onLongPress();
    },400);
  }
  function pu() {
    clearTimeout(timer.current);
    if(pressing) { setPressing(false); onClick&&onClick(); }
  }
  function pl() { clearTimeout(timer.current); setPressing(false); }

  return (<div
      onPointerDown={pd} onPointerUp={pu} onPointerLeave={pl}
      style={{position:"relative",cursor:"pointer",...sx}}
    >
      {children}
      {pressing&&<div style={{
        position:"absolute",inset:0,
        border:`2px solid ${C.ink}`,
        animation:"longRing .4s ease-out both",
        pointerEvents:"none",
      }}/>}
    </div>);
}

// Pull-to-refresh wrapper
function PullRefresh({onRefresh,children,C}) {
  const [dy,setDy] = useState(0);
  const [refreshing,setRefreshing] = useState(false);
  const startY = useRef(null);
  const el = useRef(null);
  const THRESH = 72;

  function pd(e) { if(el.current?.scrollTop===0) startY.current=e.clientY; }
  function pm(e) {
    if(startY.current===null) return;
    const d=e.clientY-startY.current;
    if(d>0&&d<120) setDy(d);
  }
  function pu() {
    if(dy>THRESH) {
      haptic("medium");
      setRefreshing(true);
      setDy(0);
      setTimeout(()=>{ onRefresh&&onRefresh(); setRefreshing(false); },1200);
    } else setDy(0);
    startY.current=null;
  }

  return (<div style={{position:"relative",height:"100%",overflow:"hidden"}}
      onPointerDown={pd} onPointerMove={pm} onPointerUp={pu}>
      {/* Pull indicator */}
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:dy||refreshing?Math.min(dy,THRESH):0,
        display:"flex",alignItems:"center",justifyContent:"center",
        overflow:"hidden",transition:dy?"none":"height .2s ease",
        background:C.bg,zIndex:10,
      }}>
        {refreshing ? (<div style={{width:"100%",height:2,position:"relative",overflow:"hidden",background:C.lift}}>
            <div style={{position:"absolute",top:0,height:"100%",width:"30%",background:C.volt,animation:"pullScan .9s ease-in-out infinite"}}/>
          </div>) : (<div style={{height:2,width:`${Math.min((dy/THRESH)*100,100)}%`,background:dy>=THRESH?C.volt:C.ink4,transition:"background .1s",marginTop:dy/2}}/>)}
      </div>
      <div ref={el} style={{height:"100%",overflowY:"auto",transform:`translateY(${dy*.4}px)`,transition:dy?"none":"transform .2s ease"}}>
        {children}
      </div>
    </div>);
}

// Sheet modal
function Sheet({open,onClose,children,title,C}) {
  const [dy,setDy]=useState(0);
  const sy=useRef(null);
  if(!open) return null;
  return (<div style={{position:"absolute",inset:0,zIndex:300,background:"rgba(0,0,0,0.45)",animation:"fadeIn .2s ease both"}}
      onPointerDown={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div
        onPointerDown={e=>sy.current=e.clientY}
        onPointerMove={e=>{if(sy.current!==null){const d=e.clientY-sy.current;if(d>0)setDy(d);}}}
        onPointerUp={()=>{if(dy>90)onClose();setDy(0);sy.current=null;}}
        style={{
          position:"absolute",bottom:0,left:0,right:0,
          background:C.card,borderRadius:"18px 18px 0 0",
          transform:`translateY(${dy}px)`,
          transition:dy?"none":"transform .38s cubic-bezier(0,0,.2,1)",
          animation:dy?"none":"slideUp .38s cubic-bezier(0,0,.2,1) both",
          maxHeight:"84%",display:"flex",flexDirection:"column",
          boxShadow:"0 -12px 60px rgba(0,0,0,0.28)",
        }}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
          <div style={{width:40,height:4,background:C.rule,borderRadius:2}}/>
        </div>
        {title&&<div style={{padding:"12px 24px 16px",borderBottom:`1px solid ${C.rule}`}}>
          <F n={title} sz={28} c={C.ink}/>
        </div>}
        <div style={{overflowY:"auto",padding:"20px 24px 36px"}}>{children}</div>
      </div>
    </div>);
}

// Map expand overlay
function MapOverlay({open,onClose,C}) {
  if(!open) return null;
  return (<div style={{position:"absolute",inset:0,zIndex:400,background:C.bg,animation:"scaleMap .38s cubic-bezier(.34,1.56,.64,1) both"}}>
      <div style={{position:"absolute",top:56,left:16,right:16,bottom:16,background:C.card,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.rule} 1px,transparent 1px),linear-gradient(90deg,${C.rule} 1px,transparent 1px)`,backgroundSize:"20px 20px"}}/>
        <div style={{position:"absolute",inset:20}}>
          <svg width="100%"height="100%"viewBox="0 0 320 480"preserveAspectRatio="none">
            <path d="M30,450 C60,380 90,300 130,260 C170,220 190,280 230,250 C270,220 290,140 310,80" stroke={D.rule} strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M30,450 C60,380 90,300 130,260 C170,220 190,280 230,250 C270,220 290,140 310,80" stroke={C.volt||L.volt} strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="pulse-dot" style={{position:"absolute",width:14,height:14,background:L.volt,borderRadius:"50%",bottom:"32%",right:"18%"}}/>
        <div style={{position:"absolute",top:12,left:12,padding:"6px 12px",background:C.ink}}>
          <M c={C.bg||"#fff"} sz={8} sp="0.1em">Live Route</M>
        </div>
      </div>
      <TapBtn dark onClick={onClose} sx={{position:"absolute",top:14,right:16,width:36,height:36,background:D.lift,border:`1px solid ${D.rule}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <M c={D.ink} sz={12} sp="0">✕</M>
      </TapBtn>
    </div>);
}

// PWA Install banner
function InstallBanner({show,onInstall,onDismiss}) {
  if(!show) return null;
  return (<div style={{
      position:"absolute",top:56,left:12,right:12,zIndex:200,
      background:L.ink,padding:"14px 16px",
      boxShadow:"0 4px 24px rgba(0,0,0,0.25)",
      animation:"toastIn .3s cubic-bezier(0,0,.2,1) both",
      display:"flex",gap:12,alignItems:"center",
    }}>
      <div style={{width:36,height:36,background:L.volt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="18"height="18"viewBox="0 0 24 24"fill="none"stroke={L.ink}strokeWidth="2"strokeLinecap="square"><path d="M12 2v13M5 9l7 7 7-7"/><path d="M2 17v3a2 2 0 002 2h16a2 2 0 002-2v-3"/></svg>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:12,color:"#fff",fontWeight:500,marginBottom:2}}>Add On Apex to Home Screen</div>
        <M c="rgba(255,255,255,0.45)" sz={9} sp="0.04em">Run without the browser</M>
      </div>
      <div style={{display:"flex",gap:8}}>
        <TapBtn dark onClick={onInstall} sx={{height:30,padding:"0 12px",background:L.volt,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase",color:L.ink,fontWeight:500}}>Install</TapBtn>
        <TapBtn dark onClick={onDismiss} sx={{height:30,width:30,background:"transparent",border:`1px solid rgba(255,255,255,0.14)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <M c="rgba(255,255,255,0.45)" sz={11} sp="0">✕</M>
        </TapBtn>
      </div>
    </div>);
}

// ─── ISLAND + STATUS + NAV ──────────────────────────────────
const Island = ({running,elapsed}) => (<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",width:running?196:124,height:35,background:"#000",borderRadius:18,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"width .38s cubic-bezier(.34,1.56,.64,1)"}}>
    {running&&<><div style={{width:7,height:7,borderRadius:"50%",background:D.volt,animation:"blink 1.1s step-end infinite"}}/><M c={D.ink} sz={11} sp="0.04em" up={false}>{fmtClock(elapsed)}</M></>}
  </div>);

const Status = ({C}) => {
  const [t,setT]=useState(()=>{const n=new Date();return`${n.getHours()}:${pad(n.getMinutes())}`;});
  useEffect(()=>{const i=setInterval(()=>{const n=new Date();setT(`${n.getHours()}:${pad(n.getMinutes())}`);},15e3);return()=>clearInterval(i);},[]);
  return (<div style={{position:"absolute",top:0,left:0,right:0,height:50,padding:"13px 24px 0",display:"flex",justifyContent:"space-between",zIndex:90,pointerEvents:"none"}}>
      <M c={C.ink} sz={12} sp="0.02em" up={false}>{t}</M>
      <M c={C.ink} sz={11} sp="0" up={false}>●●● 100%</M>
    </div>);
};

const NAV_ITEMS=[
  {id:"home",  label:"Home",  ico:(a,C)=><svg width="19"height="19"viewBox="0 0 24 24"fill="none"stroke={a?C.ink:C.ink3}strokeWidth="1.5"strokeLinecap="square"><path d="M3 12L12 4l9 8"/><path d="M5 10v9h4v-5h6v5h4v-9"/></svg>},
  {id:"feed",  label:"Feed",  ico:(a,C)=><svg width="19"height="19"viewBox="0 0 24 24"fill="none"stroke={a?C.ink:C.ink3}strokeWidth="1.5"strokeLinecap="square"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9"cy="7"r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>},
  {id:"run",   label:"Start", isStart:true},
  {id:"garage",label:"Garage",ico:(a,C)=><svg width="19"height="19"viewBox="0 0 24 24"fill="none"stroke={a?C.ink:C.ink3}strokeWidth="1.5"strokeLinecap="square"><path d="M3 17l2-6h14l2 6"/><line x1="1"y1="17"x2="23"y2="17"/><rect x="3"y="17"width="18"height="4"/></svg>},
  {id:"you",   label:"You",   ico:(a,C)=><svg width="19"height="19"viewBox="0 0 24 24"fill="none"stroke={a?C.ink:C.ink3}strokeWidth="1.5"strokeLinecap="square"><circle cx="12"cy="8"r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>},
];

function BottomNav({cur,go,C}) {
  return (<nav style={{position:"absolute",bottom:0,left:0,right:0,height:82,background:C.card,borderTop:`1px solid ${C.rule}`,display:"flex",alignItems:"flex-start",paddingTop:8,zIndex:80}}>
      {NAV_ITEMS.map(item=>item.isStart?(
        <TapBtn key="s" onClick={()=>go("prerun")} hapticType="medium" dark sx={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,marginTop:-10,background:"none"}}>
          <div style={{width:50,height:50,background:C.ink,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px rgba(0,0,0,${C===L?".18":".5"})`}}>
            <svg width="16"height="16"viewBox="0 0 18 18"><polygon points="5,3 15,9 5,15"fill={C.bg}/></svg>
          </div>
          <M c={C.ink3} sz={8} sp="0.08em">Start</M>
        </TapBtn>):(
        <TapBtn key={item.id} onClick={()=>go(item.id)} sx={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"5px 4px",background:"none"}}>
          <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>{item.ico(cur===item.id,C)}</div>
          <M c={cur===item.id?C.ink:C.ink3} sz={8} sp="0.08em">{item.label}</M>
        </TapBtn>))}
    </nav>);
}

// ═══════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════
const SHOE_MODELS=["Cloudmonster 2","Cloudflow 4","Cloudgo 2","Cloudrunner 2","Cloud X 3","Cloudsurfer 2"];
const GOALS_LIST=["Complete my first 5k","Run a half marathon","Hit 50 km/week","Stay consistent, 3 runs/week","Train for a full marathon"];
const SUGGESTED_RUNNERS=[{i:"MR",n:"Maya R.",city:"Richmond VA",shoe:"Cloudmonster 2"},{i:"JK",n:"Jordan K.",city:"Richmond VA",shoe:"Cloudflow 4"},{i:"ST",n:"Sam T.",city:"New York",shoe:"Cloudgo 2"},{i:"AC",n:"Alex C.",city:"Boston",shoe:"Cloudmonster 2"}];

function OnboardingScreen({go,onComplete}) {
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [shoe,setShoe]=useState(null);
  const [goal,setGoal]=useState(null);
  const [followed,setFollowed]=useState([]);

  function finish(){onComplete({name:name||"Runner",shoe:shoe||SHOE_MODELS[0],goal});go("home");}

  if(step===0) return (<div style={{position:"absolute",inset:0,background:D.bg,display:"flex",flexDirection:"column",padding:"80px 32px 48px"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <M c={D.volt} sz={10} sp="0.18em" sx={{display:"block",marginBottom:16}}>On Apex</M>
        <F n={"Run\nTogether."} sz={72} c={D.ink} sx={{lineHeight:.88,whiteSpace:"pre-line",display:"block",marginBottom:24}}/>
        <p style={{fontSize:14,color:D.ink2,lineHeight:1.65,maxWidth:280,marginBottom:40}}>The community layer On has never built. Your runs, your shoes, your crew.</p>
        <M c={D.ink3} sz={9} sp="0.12em" sx={{display:"block",marginBottom:8}}>What should we call you?</M>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
          style={{width:"100%",height:52,background:D.lift,border:`1px solid ${D.ruleHard}`,padding:"0 16px",fontSize:15,color:D.ink,letterSpacing:"-0.01em"}}/>
      </div>
      <TapBtn dark onClick={()=>setStep(1)} hapticType="medium" sx={{width:"100%",height:52,background:D.volt,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.bg,fontWeight:500}}>Get Started →</TapBtn>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>
        {[0,1,2].map(i=><div key={i} style={{width:i===0?20:6,height:3,background:i===0?D.volt:D.ink4}}/>)}
      </div>
    </div>);
  if(step===1) return (<div style={{position:"absolute",inset:0,background:L.bg,display:"flex",flexDirection:"column",padding:"60px 24px 32px"}}>
      <M c={L.ink3} sz={9} sp="0.14em" sx={{display:"block",marginBottom:8}}>Step 2 of 3</M>
      <F n="Your Shoe." sz={56} c={L.ink} sx={{display:"block",marginBottom:6}}/>
      <p style={{fontSize:13,color:L.ink3,lineHeight:1.6,marginBottom:20}}>Which On shoe are you running in? We'll track mileage automatically.</p>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
        {SHOE_MODELS.map(s=>(
          <TapBtn key={s} onClick={()=>setShoe(s)} sx={{width:"100%",padding:"16px",background:shoe===s?L.ink:L.card,border:`1px solid ${shoe===s?L.ink:L.rule}`,display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:shoe===s?"#fff":L.ink,marginBottom:2}}>{s}</div>
              <M c={shoe===s?"rgba(255,255,255,0.5)":L.ink3} sz={9} sp="0.06em">On Running</M>
            </div>
            {shoe===s&&<div style={{width:20,height:20,background:L.volt,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12"height="12"viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke={L.ink} strokeWidth="1.5" fill="none" strokeLinecap="square"/></svg></div>}
          </TapBtn>))}
      </div>
      <div style={{marginTop:16,display:"flex",gap:10}}>
        <TapBtn onClick={()=>setStep(0)} sx={{height:52,flex:1,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink3}}>← Back</TapBtn>
        <TapBtn onClick={()=>setStep(2)} hapticType="medium" sx={{height:52,flex:2,background:shoe?L.ink:L.lift,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:shoe?"#fff":L.ink4,pointerEvents:shoe?"auto":"none"}}>Next →</TapBtn>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:14}}>{[0,1,2].map(i=><div key={i} style={{width:i===1?20:6,height:3,background:i===1?L.ink:L.ink4}}/>)}</div>
    </div>);
  return (<div style={{position:"absolute",inset:0,background:L.bg,display:"flex",flexDirection:"column",padding:"60px 24px 32px"}}>
      <M c={L.ink3} sz={9} sp="0.14em" sx={{display:"block",marginBottom:8}}>Step 3 of 3</M>
      <F n="Goal + Crew." sz={56} c={L.ink} sx={{display:"block",marginBottom:6}}/>
      <div style={{flex:1,overflowY:"auto"}}>
        <M c={L.ink3} sz={9} sp="0.12em" sx={{display:"block",marginBottom:8}}>Your goal</M>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
          {GOALS_LIST.map(g=>(
            <TapBtn key={g} onClick={()=>setGoal(g)} sx={{width:"100%",padding:"12px 14px",textAlign:"left",background:goal===g?L.ink:L.card,border:`1px solid ${goal===g?L.ink:L.rule}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:goal===g?"#fff":L.ink}}>{g}</span>
              {goal===g&&<div style={{width:16,height:16,background:L.volt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="10"height="10"viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke={L.ink} strokeWidth="1.5" fill="none" strokeLinecap="square"/></svg></div>}
            </TapBtn>))}
        </div>
        <M c={L.ink3} sz={9} sp="0.12em" sx={{display:"block",marginBottom:8}}>Suggested runners</M>
        {SUGGESTED_RUNNERS.map(u=>(
          <div key={u.i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${L.rule}`}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:L.ink,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><M c={L.bg} sz={10} sp="0.04em">{u.i}</M></div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:L.ink,fontWeight:500,marginBottom:1}}>{u.n}</div>
              <M c={L.ink3} sz={8} sp="0.06em">{u.city} · {u.shoe}</M>
            </div>
            <TapBtn onClick={()=>setFollowed(p=>p.includes(u.i)?p.filter(x=>x!==u.i):[...p,u.i])} sx={{height:28,padding:"0 12px",background:followed.includes(u.i)?L.ink:L.lift,border:`1px solid ${followed.includes(u.i)?L.ink:L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase",color:followed.includes(u.i)?"#fff":L.ink2}}>
              {followed.includes(u.i)?"Following":"Follow"}
            </TapBtn>
          </div>))}
      </div>
      <div style={{marginTop:16,display:"flex",gap:10}}>
        <TapBtn onClick={()=>setStep(1)} sx={{height:52,flex:1,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink3}}>← Back</TapBtn>
        <TapBtn onClick={finish} hapticType="medium" sx={{height:52,flex:2,background:L.ink,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff",fontWeight:500}}>Enter Apex →</TapBtn>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:14}}>{[0,1,2].map(i=><div key={i} style={{width:i===2?20:6,height:3,background:i===2?L.ink:L.ink4}}/>)}</div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// PRE-RUN
// ═══════════════════════════════════════════════════════════
const PRERUN_SHOES=["Cloudmonster 2","Cloudflow 4","Cloudgo 2","Cloudrunner 2"];
function PreRunScreen({go,run,dispatch,userShoe,toast}) {
  const [gps,setGps]=useState("locking");
  const [sel,setSel]=useState(userShoe||"Cloudmonster 2");
  const [shoeSheet,setShoeSheet]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setGps("locked"),2200);return()=>clearTimeout(t);},[]);
  function start(){haptic("medium");dispatch({type:"START",shoe:sel});go("run");}
  return (<div style={{position:"absolute",inset:0,background:D.bg,display:"flex",flexDirection:"column",padding:"56px 0 0"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px",position:"relative"}}>
        <div style={{position:"relative",width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:32}}>
          {gps==="locking"&&[0,1,2].map(i=><div key={i} style={{position:"absolute",width:120,height:120,borderRadius:"50%",border:`1px solid ${D.volt}`,animation:`gpsRing 2s ease-out ${i*.55}s infinite`}}/>)}
          <div style={{width:gps==="locked"?56:46,height:gps==="locked"?56:46,borderRadius:"50%",background:gps==="locked"?D.volt:"transparent",border:`2px solid ${gps==="locked"?D.volt:D.ruleHard}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .4s cubic-bezier(.34,1.56,.64,1)"}}>
            <svg width="22"height="22"viewBox="0 0 24 24"fill="none"stroke={gps==="locked"?D.bg:D.ink3}strokeWidth="1.5"><circle cx="12"cy="12"r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          </div>
        </div>
        <M c={gps==="locked"?D.volt:D.ink3} sz={10} sp="0.18em" sx={{display:"block",marginBottom:6,transition:"color .3s"}}>
          {gps==="locked"?"GPS Locked":"Acquiring GPS..."}
        </M>
        <M c={D.ink3} sz={9} sp="0.08em" sx={{display:"block",marginBottom:40}}>Richmond VA · {gps==="locked"?"Strong signal":"Searching"}</M>
        <HR c={D.rule} sx={{width:"100%",marginBottom:20}}/>
        <div style={{width:"100%"}}>
          <M c={D.ink3} sz={9} sp="0.12em" sx={{display:"block",marginBottom:10}}>Running in</M>
          <TapBtn dark onClick={()=>setShoeSheet(true)} sx={{width:"100%",padding:"14px 16px",background:D.lift,border:`1px solid ${D.ruleHard}`,display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,background:D.card,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="20"height="20"viewBox="0 0 24 24"fill={D.ink2}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg>
              </div>
              <div><div style={{fontSize:13,color:D.ink,fontWeight:500,marginBottom:1}}>{sel}</div><M c={D.ink3} sz={8} sp="0.06em">Tap to change</M></div>
            </div>
            <M c={D.ink3} sz={14} sp="0">›</M>
          </TapBtn>
        </div>
      </div>
      <div style={{padding:"16px 24px 32px",display:"flex",gap:10}}>
        <TapBtn dark onClick={()=>go("home")} sx={{height:52,flex:1,background:D.lift,border:`1px solid ${D.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.ink2}}>Cancel</TapBtn>
        <TapBtn dark onClick={gps==="locked"?start:undefined} hapticType="medium" sx={{height:52,flex:2,background:gps==="locked"?D.volt:D.ink4,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.bg,fontWeight:500,transition:"background .3s",pointerEvents:gps==="locked"?"auto":"none"}}>
          {gps==="locked"?"Start Run →":"Waiting for GPS..."}
        </TapBtn>
      </div>
      <Sheet open={shoeSheet} onClose={()=>setShoeSheet(false)} C={D} title="Select Shoe">
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {PRERUN_SHOES.map(s=>(
            <TapBtn dark key={s} onClick={()=>{setSel(s);setShoeSheet(false);}} sx={{width:"100%",padding:"14px 16px",background:sel===s?D.volt:D.lift,border:`1px solid ${sel===s?D.volt:D.rule}`,display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
              <div style={{fontSize:13,fontWeight:500,color:sel===s?D.bg:D.ink}}>{s}</div>
              {sel===s&&<svg width="14"height="14"viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke={D.bg} strokeWidth="2" fill="none" strokeLinecap="square"/></svg>}
            </TapBtn>))}
        </div>
      </Sheet>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════
const WEEK=[{d:"M",km:12.4,run:true},{d:"T",km:0,run:false},{d:"W",km:8.1,run:true},{d:"T",km:9.8,run:true},{d:"F",km:7.7,run:true},{d:"S",km:0,run:false},{d:"S",km:0,run:false,today:true}];
const MXK=Math.max(...WEEK.map(w=>w.km));
const RUNS=[{d:"12",mo:"Mar",t:"long",n:"Sunday Long Run",meta:"12.4 km · 58:02 · 4:41/km",km:"12.4"},{d:"09",mo:"Mar",t:"tempo",n:"Tempo Threshold",meta:"9.8 km  · 43:10 · 4:24/km",km:"9.8"},{d:"08",mo:"Mar",t:"easy",n:"Easy Recovery",meta:"8.1 km  · 46:05 · 5:41/km",km:"8.1"}];
const TCLR={tempo:L.voltDim,long:L.ink4,easy:L.ink4,race:L.pos};

function HomeScreen({go,userName,toast}) {
  const [v,setV]=useState(false);
  const [ws,setWs]=useState(false);
  const [lp,setLp]=useState(null); // long-press run item
  useEffect(()=>{const t=setTimeout(()=>setV(true),60);return()=>clearTimeout(t);},[]);
  const tr=d=>`all .44s cubic-bezier(0,0,.2,1) ${d}s`;

  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{padding:"60px 24px 0"}}>
        <M c={L.ink3} sz={9} sp="0.14em" sx={{display:"block",marginBottom:8,opacity:v?1:0,transition:tr(.06)}}>Good morning</M>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:.88,color:L.ink,marginBottom:4,opacity:v?1:0,transform:v?"none":"translateY(10px)",transition:tr(.1)}}>{(userName||"RUNNER").toUpperCase()}.</div>
        <M c={L.ink4} sz={9} sp="0.08em" sx={{opacity:v?1:0,transition:tr(.14)}}>Wed · March 12 · 2026</M>
      </div>
      <div style={{margin:"20px 24px 0",padding:24,background:L.card,border:`1px solid ${L.rule}`,boxShadow:"0 2px 24px rgba(0,0,0,0.07)",opacity:v?1:0,transform:v?"none":"translateY(14px)",transition:tr(.16)}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <M c={L.ink3} sz={9} sp="0.14em" sx={{display:"block",marginBottom:6}}>This week</M>
            <div style={{display:"flex",alignItems:"flex-end",gap:5}}>
              <F n="38" sz={108} c={L.ink} sx={{lineHeight:.85}}/><M c={L.ink3} sz={14} sp="0.04em" up={false} sx={{marginBottom:8}}>km</M>
            </div>
          </div>
          <div style={{background:L.ink,width:60,height:60,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <F n="4" sz={28} c={L.volt}/><M c={L.volt} sz={7} sp="0.12em" sx={{marginTop:1}}>runs</M>
          </div>
        </div>
        <HR c={L.rule} sx={{margin:"16px 0"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
          {[{l:"Avg pace",v:"4:52"},{l:"Total time",v:"3h 04m"},{l:"vs last wk",v:"+12%",c:L.pos}].map((s,i)=>(
            <div key={i} style={{paddingRight:i<2?14:0,paddingLeft:i>0?14:0,borderRight:i<2?`1px solid ${L.rule}`:"none"}}>
              <M c={L.ink4} sz={8} sp="0.1em" sx={{display:"block",marginBottom:3}}>{s.l}</M>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:s.c||L.ink}}>{s.v}</span>
            </div>))}
        </div>
      </div>

      {/* Week strip */}
      <div style={{margin:"16px 24px 0",opacity:v?1:0,transition:tr(.22)}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <M c={L.ink3} sz={9} sp="0.14em">Daily</M>
          <TapBtn onClick={()=>setWs(true)} sx={{background:"none"}}><M c={L.ink3} sz={9} sp="0.08em">Detail →</M></TapBtn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {WEEK.map((w,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <M c={L.ink4} sz={8} sp="0.06em">{w.d}</M>
              <div style={{width:"100%",height:52,background:L.lift,position:"relative",overflow:"hidden"}}>
                {v&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:`${Math.max((w.km/MXK)*100,w.today?8:0)}%`,background:w.today?L.volt:w.run?L.ink:L.rule,transformOrigin:"bottom",animation:`barRise .5s cubic-bezier(0,0,.2,1) ${.3+i*.05}s both`}}/>}
              </div>
              {w.today?<div style={{background:L.ink,padding:"1px 3px"}}><M c={L.volt} sz={7} sp="0.08em">now</M></div>:w.run?<M c={L.ink3} sz={8} sp="0" up={false}>{w.km}</M>:<M c={L.ink4} sz={8} sp="0">, </M>}
            </div>))}
        </div>
      </div>

      {/* Recent runs · long press enabled */}
      <div style={{padding:"20px 24px 0",opacity:v?1:0,transition:tr(.3)}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <M c={L.ink3} sz={9} sp="0.14em">Recent runs</M><M c={L.ink3} sz={9} sp="0.08em">All →</M>
        </div>
        {RUNS.map((r,i)=>(
          <LongPressBtn key={i} C={L}
            onClick={()=>go("summary")}
            onLongPress={()=>setLp(r)}
            sx={{width:"100%",display:"grid",gridTemplateColumns:"44px 1fr auto",gap:14,padding:"14px 0",borderTop:`1px solid ${L.rule}`}}>
            <div><F n={r.d} sz={30} c={L.ink}/><br/><M c={L.ink3} sz={8} sp="0.1em">{r.mo}</M></div>
            <div>
              <div style={{width:20,height:2,background:TCLR[r.t],marginBottom:5}}/>
              <div style={{fontSize:13,color:L.ink,letterSpacing:"-0.01em",marginBottom:3,fontWeight:400}}>{r.n}</div>
              <M c={L.ink3} sz={9} sp="0.04em" up={false}>{r.meta}</M>
            </div>
            <div style={{textAlign:"right"}}><F n={r.km} sz={24} c={L.ink}/><br/><M c={L.ink3} sz={8} sp="0.08em">km</M></div>
          </LongPressBtn>))}
      </div>

      {/* Shoe nudge */}
      <TapBtn onClick={()=>go("garage")} sx={{display:"flex",gap:14,alignItems:"center",margin:"16px 24px 0",padding:18,background:L.card,border:`1px solid ${L.rule}`,boxShadow:"0 1px 10px rgba(0,0,0,0.05)",width:"calc(100% - 48px)",textAlign:"left",opacity:v?1:0,transition:tr(.38)}}>
        <div style={{width:44,height:44,background:L.ink,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="22"height="22"viewBox="0 0 24 24"fill={L.bg}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg></div>
        <div style={{flex:1}}><div style={{fontSize:12,color:L.ink,fontWeight:500,marginBottom:2}}>Cloudflow 4 · 487 km</div><M c={L.ink3} sz={9} sp="0.04em">Approaching replacement · Tap to view</M></div>
        <div style={{width:40,height:3,background:L.lift,flexShrink:0,position:"relative"}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:"81%",background:L.warn}}/></div>
      </TapBtn>

      {/* Long press action sheet */}
      <Sheet open={!!lp} onClose={()=>setLp(null)} C={L} title={lp?.n}>
        {lp&&["Share this run","Edit details","Delete run"].map((opt,i)=>(
          <TapBtn key={i} onClick={()=>{haptic(i===2?"warning":"light");if(i===0)toast("Run shared","→");if(i===2)toast("Run deleted","✕");setLp(null);}} sx={{width:"100%",height:46,background:i===2?`rgba(192,48,32,0.06)`:L.lift,border:`1px solid ${i===2?`rgba(192,48,32,0.12)`:L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:i===2?L.neg:L.ink,marginBottom:8}}>{opt}</TapBtn>))}
      </Sheet>

      <Sheet open={ws} onClose={()=>setWs(false)} C={L} title="Week Detail">
        {WEEK.filter(w=>w.run).map((w,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${L.rule}`}}>
            <M c={L.ink2} sz={10} sp="0.04em" up={false}>{["Monday","Wednesday","Thursday","Friday"][i]}</M>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:50,height:2,background:L.lift,position:"relative"}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${(w.km/MXK)*100}%`,background:L.ink}}/></div>
              <M c={L.ink} sz={10} sp="0.04em" up={false}>{w.km} km</M>
            </div>
          </div>))}
      </Sheet>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// ACTIVE RUN
// ═══════════════════════════════════════════════════════════
function RunScreen({go,run,dispatch,toast}) {
  const {elapsed,km,pace,hr,cadence,zone,paused,shoe}=run;
  const [confirm,setConfirm]=useState(false);
  const [mapOpen,setMapOpen]=useState(false);
  return (<div style={{position:"absolute",inset:0,background:D.bg,display:"flex",flexDirection:"column"}}>
      <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"62px 24px 0",position:"relative",minHeight:230}}>
        {!paused&&<div className="scan-line" style={{background:`linear-gradient(90deg,transparent,${D.volt},transparent)`,opacity:.18}}/>}
        <M c={D.ink3} sz={9} sp="0.14em" sx={{marginBottom:10}}>Elapsed time</M>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:98,lineHeight:.86,letterSpacing:"0.03em",color:D.ink,fontVariantNumeric:"tabular-nums",display:"flex",alignItems:"baseline"}}>
          {pad(Math.floor(elapsed/60))}<span className={!paused?"blink":""} style={{margin:"0 1px"}}>:</span>{pad(elapsed%60)}
        </div>
        <div style={{marginTop:14,display:"flex",gap:8,alignItems:"baseline"}}>
          <F n={km.toFixed(2)} sz={34} c={D.volt}/><M c={D.ink2} sz={10} sp="0.06em" up={false}>km · {shoe}</M>
          {paused&&<M c={D.warn} sz={9} sp="0.12em" sx={{marginLeft:8}}>Paused</M>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr",borderTop:`1px solid ${D.rule}`,borderBottom:`1px solid ${D.rule}`,flexShrink:0}}>
        {[{l:"Pace",v:fmtPace(pace),u:"/km"},null,{l:"Cadence",v:cadence,u:"spm"},null,{l:"HR",v:hr,u:"bpm"}].map((it,i)=>
          it===null?<div key={i} style={{background:D.rule}}/>:
          <div key={i} style={{padding:"18px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <M c={D.ink3} sz={8} sp="0.12em">{it.l}</M>
            <F n={it.v} sz={32} c={D.ink}/><M c={D.ink3} sz={8} sp="0.08em">{it.u}</M>
          </div>)}
      </div>
      <div style={{padding:"12px 24px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{display:"flex",gap:3,flex:1}}>
          {[0,1,2,3,4].map(i=><div key={i} style={{height:5,flex:1,background:i<zone?D.ink3:i===zone?D.volt:D.lift,transition:"background .3s ease"}}/>)}
        </div>
        <M c={D.volt} sz={9} sp="0.1em">Zone {zone+1}</M>
      </div>
      {/* Map · tap to expand */}
      <TapBtn dark onClick={()=>setMapOpen(true)} sx={{flex:1,background:D.card,position:"relative",overflow:"hidden",minHeight:130,display:"block",width:"100%",textAlign:"left"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${D.rule} 1px,transparent 1px),linear-gradient(90deg,${D.rule} 1px,transparent 1px)`,backgroundSize:"22px 22px"}}/>
        <div style={{position:"absolute",inset:12}}>
          <svg width="100%"height="100%"viewBox="0 0 300 120"preserveAspectRatio="none">
            <path d="M10,110 C30,90 55,62 82,54 C110,46 130,74 158,65 C186,56 208,26 238,16 C258,10 272,13 285,17" stroke="rgba(255,255,255,0.06)"strokeWidth="2"fill="none"strokeLinecap="round"/>
            <path d="M10,110 C30,90 55,62 82,54 C110,46 130,74 158,65 C186,56 208,26 238,16" stroke={D.volt}strokeWidth="2.5"fill="none"strokeLinecap="round"/>
          </svg>
        </div>
        <div className="pulse-dot" style={{position:"absolute",width:11,height:11,background:D.volt,borderRadius:"50%",bottom:"28%",right:"17%"}}/>
        <div style={{position:"absolute",bottom:8,right:8,padding:"4px 8px",background:"rgba(0,0,0,0.5)"}}>
          <M c={D.ink2} sz={7} sp="0.1em">Tap to expand</M>
        </div>
      </TapBtn>
      <div style={{padding:"14px 24px 28px",display:"flex",gap:10,flexShrink:0}}>
        <TapBtn dark onClick={()=>paused?dispatch({type:"RESUME"}):dispatch({type:"PAUSE"})} hapticType="medium" sx={{flex:1,height:52,background:D.lift,border:`1px solid ${D.ruleHard}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.ink}}>{paused?"Resume":"Pause"}</TapBtn>
        <TapBtn dark onClick={()=>setConfirm(true)} sx={{width:52,height:52,background:D.card,border:`1px solid ${D.rule}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="13"height="13"viewBox="0 0 16 16"><rect x="3"y="3"width="10"height="10"fill={D.ink2}/></svg>
        </TapBtn>
        <TapBtn dark onClick={()=>{dispatch({type:"PAUSE"});go("summary");}} hapticType="medium" sx={{flex:1,height:52,background:D.volt,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.bg,fontWeight:500}}>Finish →</TapBtn>
      </div>
      <Sheet open={confirm} onClose={()=>setConfirm(false)} C={D} title="End Run?">
        <M c={D.ink2} sz={10} sp="0.03em" up={false} sx={{display:"block",lineHeight:1.8,marginBottom:16}}>{km.toFixed(2)} km in {fmtClock(elapsed)}. Save this run?</M>
        <TapBtn dark onClick={()=>{dispatch({type:"PAUSE"});toast("Run saved","✓");go("summary");}} hapticType="medium" sx={{width:"100%",height:48,background:D.volt,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.bg,fontWeight:500,marginBottom:10}}>Save & Finish</TapBtn>
        <TapBtn dark onClick={()=>{dispatch({type:"RESET"});go("home");}} hapticType="warning" sx={{width:"100%",height:48,background:"transparent",border:`1px solid ${D.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:D.ink2}}>Discard</TapBtn>
      </Sheet>
      <MapOverlay open={mapOpen} onClose={()=>setMapOpen(false)} C={D}/>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════
const PBARS=[312,318,302,295,308,290,283];
const PBMIN=Math.min(...PBARS),PBMAX=Math.max(...PBARS);
function SummaryScreen({go,run,toast}) {
  const [v,setV]=useState(false);
  const [pr,setPr]=useState(false);
  const [sh,setSh]=useState(false);
  useEffect(()=>{const a=setTimeout(()=>setV(true),100);const b=setTimeout(()=>setPr(true),750);return()=>{clearTimeout(a);clearTimeout(b);};},[]);
  const km=run.active?run.km.toFixed(2):"12.4";
  const tm=run.active?fmtClock(run.elapsed):"58:02";
  const pc=run.active?fmtPace(Math.round(run.elapsed/Math.max(run.km,.01))):"4:41";
  const shoe=run.shoe||"Cloudmonster 2";
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{height:296,background:L.ink,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 24px 24px"}}>
        <div style={{position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:210,lineHeight:.8,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.05)",top:-18,right:-8,whiteSpace:"nowrap",pointerEvents:"none"}}>RUN</div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:22,height:1,background:L.volt}}/><M c="rgba(255,255,255,0.38)"sz={9}sp="0.12em">Sunday Long Run · Mar 12</M></div>
          <F n={km} sz={82} c="#fff" sx={{lineHeight:.84}}/><F n=" km" sz={82} c={L.volt} sx={{lineHeight:.84}}/>
          <M c="rgba(255,255,255,0.42)"sz={10}sp="0.06em"up={false}sx={{marginTop:12,display:"block"}}>{tm} · {shoe} · Richmond VA</M>
        </div>
      </div>
      <div style={{padding:"0 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,padding:"22px 0",borderBottom:`1px solid ${L.rule}`}}>
          <div style={{opacity:v?1:0,transform:v?"none":"translateY(8px)",transition:"all .4s .08s"}}>
            <M c={L.ink3}sz={8}sp="0.14em"sx={{display:"block",marginBottom:5}}>Time</M>
            <F n={tm}sz={46}c={L.ink}/>
            {pr&&<div className="volt-pop"style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px 4px 5px",background:L.volt,marginTop:8}}>
              <div style={{width:13,height:13,background:L.ink,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:L.volt,lineHeight:1}}>★</span></div>
              <M c={L.ink}sz={9}sp="0.1em"sx={{fontWeight:500}}>PR · 10k</M>
            </div>}
          </div>
          <div style={{opacity:v?1:0,transform:v?"none":"translateY(8px)",transition:"all .4s .14s"}}>
            <M c={L.ink3}sz={8}sp="0.14em"sx={{display:"block",marginBottom:5}}>Avg pace</M>
            <F n={pc}sz={46}c={L.ink}/><M c={L.ink3}sz={10}sp="0.04em"up={false}>/km</M>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"18px 0",borderBottom:`1px solid ${L.rule}`,opacity:v?1:0,transition:"all .4s .2s"}}>
          {[{l:"Cadence",v:"176",u:"spm"},{l:"Avg HR",v:"164",u:"bpm"},{l:"Elev",v:"+62",u:"m"}].map((s,i)=>(
            <div key={i}style={{display:"flex",flexDirection:"column",gap:5,borderRight:i<2?`1px solid ${L.rule}`:"none",paddingRight:i<2?14:0,paddingLeft:i>0?14:0}}>
              <M c={L.ink3}sz={8}sp="0.12em">{s.l}</M><div><F n={s.v}sz={26}c={L.ink}/><M c={L.ink3}sz={9}sp="0.04em"up={false}sx={{marginLeft:3}}>{s.u}</M></div>
            </div>))}
        </div>
        <div style={{padding:"18px 0",borderBottom:`1px solid ${L.rule}`,opacity:v?1:0,transition:"opacity .4s .26s"}}>
          <M c={L.ink3}sz={9}sp="0.14em"sx={{display:"block",marginBottom:12}}>Pace / km</M>
          <div style={{height:56,display:"flex",alignItems:"flex-end",gap:3}}>
            {PBARS.map((p,i)=>{const pct=1-(p-PBMIN)/(PBMAX-PBMIN+3);return<div key={i}style={{flex:1,background:p===PBMIN?L.volt:i>4?L.ink3:L.lift,height:v?Math.round(24+pct*28):0,transition:`height .5s cubic-bezier(0,0,.2,1) ${.28+i*.07}s`,transformOrigin:"bottom"}}/>;})}
          </div>
        </div>
        <TapBtn onClick={()=>go("garage")}sx={{width:"100%",padding:"18px 0",borderBottom:`1px solid ${L.rule}`,display:"flex",gap:14,alignItems:"center",background:"none",textAlign:"left"}}>
          <div style={{width:44,height:44,background:L.lift,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="24"height="24"viewBox="0 0 24 24"fill={L.ink3}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg></div>
          <div style={{flex:1}}><div style={{fontSize:13,color:L.ink,fontWeight:400,marginBottom:3}}>{shoe}</div><M c={L.ink3}sz={9}sp="0.04em"up={false}>494.7 km · 506 remaining</M></div>
          <div style={{width:48,height:3,background:L.lift,flexShrink:0,position:"relative"}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:"49.5%",background:L.ink}}/></div>
        </TapBtn>
        <div style={{paddingTop:20,display:"flex",flexDirection:"column",gap:10}}>
          <TapBtn onClick={()=>setSh(true)}sx={{height:52,background:L.ink,width:"100%",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.bg,fontWeight:500}}>Share Run →</TapBtn>
          <TapBtn onClick={()=>go("home")}sx={{height:52,background:"transparent",border:`1px solid ${L.ruleHard}`,width:"100%",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink2}}>Done</TapBtn>
        </div>
      </div>
      <Sheet open={sh} onClose={()=>setSh(false)} C={L} title="Share Run">
        <div style={{background:L.ink,padding:20,marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:110,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.05)",top:-8,right:-4,lineHeight:.8,whiteSpace:"nowrap",pointerEvents:"none"}}>RUN</div>
          <M c="rgba(255,255,255,0.35)"sz={8}sp="0.14em"sx={{display:"block",marginBottom:6}}>On Apex · Sunday Long Run</M>
          <F n={km}sz={52}c="#fff"/><M c="rgba(255,255,255,0.5)"sz={11}sp="0.04em"up={false}sx={{marginLeft:6}}>km</M>
          <div style={{display:"flex",gap:16,marginTop:8}}><M c="rgba(255,255,255,0.5)"sz={9}sp="0.06em"up={false}>{tm}</M><M c="rgba(255,255,255,0.5)"sz={9}sp="0.06em"up={false}>{pc}/km</M></div>
          <div style={{display:"inline-flex",alignItems:"center",height:18,padding:"0 8px",background:L.volt,marginTop:10}}><M c={L.ink}sz={8}sp="0.1em"sx={{fontWeight:500}}>ON APEX</M></div>
        </div>
        {["Save to Photos","Share to Instagram","Copy Link"].map((opt,i)=>(
          <TapBtn key={i}onClick={()=>{toast("Shared","→");setSh(false);}}sx={{width:"100%",height:46,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink,marginBottom:8}}>{opt}</TapBtn>))}
      </Sheet>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// SHOE REGISTRATION FLOW
// ═══════════════════════════════════════════════════════════
const DETECT_ORDERS=[{m:"Cloudmonster 2",order:"Order #ON-2024-8841",date:"Feb 12"},{m:"Cloudflow 4",order:"Order #ON-2024-7723",date:"Jan 3"}];
const KM_GOALS=["500","600","700","800","1000"];
function ShoeRegScreen({go,toast}) {
  const [step,setStep]=useState(0);
  const [shoe,setShoe]=useState(null);
  const [nick,setNick]=useState("");
  const [goal,setGoal]=useState("800");
  if(step===0) return (<div style={{position:"absolute",inset:0,background:L.bg,display:"flex",flexDirection:"column",padding:"60px 24px 32px"}}>
      <M c={L.ink3}sz={9}sp="0.14em"sx={{display:"block",marginBottom:8}}>Registration · 1 of 3</M>
      <F n={"Order\nSync."} sz={56}c={L.ink}sx={{lineHeight:.88,whiteSpace:"pre-line",display:"block",marginBottom:20}}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
        {DETECT_ORDERS.map(d=>(
          <TapBtn key={d.m}onClick={()=>setShoe(d.m)}sx={{width:"100%",padding:18,background:shoe===d.m?L.ink:L.card,border:`1px solid ${shoe===d.m?L.ink:L.rule}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
            <div style={{width:48,height:48,background:shoe===d.m?L.volt:L.lift,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="26"height="26"viewBox="0 0 24 24"fill={shoe===d.m?L.ink:L.ink3}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg></div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:shoe===d.m?"#fff":L.ink,marginBottom:3}}>{d.m}</div><M c={shoe===d.m?"rgba(255,255,255,0.5)":L.ink3}sz={9}sp="0.04em"up={false}>{d.order} · {d.date}</M></div>
            {shoe===d.m&&<div style={{width:20,height:20,background:L.volt,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12"height="12"viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"stroke={L.ink}strokeWidth="1.5"fill="none"strokeLinecap="square"/></svg></div>}
          </TapBtn>))}
        <TapBtn sx={{width:"100%",padding:14,background:L.lift,border:`1px solid ${L.rule}`,textAlign:"center"}}><M c={L.ink3}sz={9}sp="0.1em">Add manually</M></TapBtn>
      </div>
      <div style={{marginTop:16,display:"flex",gap:10}}>
        <TapBtn onClick={()=>go("garage")}sx={{height:52,flex:1,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink3}}>Cancel</TapBtn>
        <TapBtn onClick={()=>setStep(1)}sx={{height:52,flex:2,background:shoe?L.ink:L.lift,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:shoe?"#fff":L.ink4,pointerEvents:shoe?"auto":"none"}}>Confirm →</TapBtn>
      </div>
    </div>);
  if(step===1) return (<div style={{position:"absolute",inset:0,background:L.bg,display:"flex",flexDirection:"column",padding:"60px 24px 32px"}}>
      <M c={L.ink3}sz={9}sp="0.14em"sx={{display:"block",marginBottom:8}}>Registration · 2 of 3</M>
      <F n="Name It." sz={56}c={L.ink}sx={{display:"block",marginBottom:20}}/>
      <div style={{flex:1}}>
        <div style={{padding:20,background:L.card,border:`1px solid ${L.rule}`,boxShadow:"0 2px 16px rgba(0,0,0,0.06)",marginBottom:16}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
            <div style={{width:44,height:44,background:L.lift,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="24"height="24"viewBox="0 0 24 24"fill={L.ink3}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg></div>
            <div><div style={{fontSize:14,fontWeight:500,color:L.ink,marginBottom:2}}>{shoe}</div><M c={L.ink3}sz={9}sp="0.04em">On Running · Just added</M></div>
          </div>
          <input value={nick}onChange={e=>setNick(e.target.value)}placeholder="e.g. The Workhorse, Sunday Shoes..."
            style={{width:"100%",height:48,background:L.lift,border:`1px solid ${L.rule}`,padding:"0 14px",fontSize:14,color:L.ink}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <TapBtn onClick={()=>setStep(0)}sx={{height:52,flex:1,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink3}}>← Back</TapBtn>
        <TapBtn onClick={()=>setStep(2)}sx={{height:52,flex:2,background:L.ink,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff",fontWeight:500}}>Next →</TapBtn>
      </div>
    </div>);
  return (<div style={{position:"absolute",inset:0,background:L.bg,display:"flex",flexDirection:"column",padding:"60px 24px 32px"}}>
      <M c={L.ink3}sz={9}sp="0.14em"sx={{display:"block",marginBottom:8}}>Registration · 3 of 3</M>
      <F n="Set Goal." sz={56}c={L.ink}sx={{display:"block",marginBottom:20}}/>
      <div style={{flex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:20}}>
          {KM_GOALS.map(g=>(
            <TapBtn key={g}onClick={()=>setGoal(g)}sx={{height:52,background:goal===g?L.ink:L.card,border:`1px solid ${goal===g?L.ink:L.rule}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
              <F n={g}sz={18}c={goal===g?"#fff":L.ink}/><M c={goal===g?"rgba(255,255,255,0.5)":L.ink4}sz={7}sp="0.1em">km</M>
            </TapBtn>))}
        </div>
        <div style={{padding:18,background:L.ink,marginBottom:16}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
            <div style={{width:44,height:44,background:L.volt,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="24"height="24"viewBox="0 0 24 24"fill={L.ink}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg></div>
            <div><div style={{fontSize:13,fontWeight:500,color:"#fff",marginBottom:2}}>{shoe}</div><M c="rgba(255,255,255,0.45)"sz={9}sp="0.04em">{nick||"No nickname"} · {goal} km goal</M></div>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,0.1)"}}><div style={{height:"100%",width:"2%",background:L.volt}}/></div>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <TapBtn onClick={()=>setStep(1)}sx={{height:52,flex:1,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink3}}>← Back</TapBtn>
        <TapBtn onClick={()=>{haptic("medium");toast("Shoe registered","✓");go("garage");}}sx={{height:52,flex:2,background:L.ink,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff",fontWeight:500}}>Add to Garage →</TapBtn>
      </div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// SHOE CAROUSEL: horizontal scroll-snap, CSS scroll-snap-type: mandatory
// ═══════════════════════════════════════════════════════════
function ShoeCarousel({shoes,v,onSelect}) {
  const ref = useRef(null);
  const [active,setActive] = useState(0);

  // Track which card is snapped via scroll position
  function onScroll() {
    if(!ref.current) return;
    const idx = Math.round(ref.current.scrollLeft / ref.current.offsetWidth);
    setActive(idx);
  }

  return (<div style={{marginTop:20,opacity:v?1:0,transition:"opacity .44s .2s"}}>
      {/* Scroll container */}
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          display:"flex",
          overflowX:"auto",
          scrollSnapType:"x mandatory",
          WebkitOverflowScrolling:"touch",
          scrollBehavior:"smooth",
          paddingLeft:24,
          paddingRight:24,
          gap:12,
          // Hide scrollbar
          msOverflowStyle:"none",
          scrollbarWidth:"none",
        }}
      >
        {shoes.map((sh,i)=>{
          const pct = sh.km/sh.goal;
          const fill = pct>.9?L.neg:pct>.75?L.warn:L.ink;
          return (<TapBtn
              key={i}
              onClick={()=>onSelect(sh)}
              sx={{
                display:"block",
                flexShrink:0,
                width:"calc(100vw - 64px)",
                maxWidth:326,
                scrollSnapAlign:"start",
                background:L.card,
                border:`1px solid ${i===0?L.ruleHard:L.rule}`,
                boxShadow:i===0
                  ?"0 4px 28px rgba(0,0,0,0.10)"
                  :"0 2px 8px rgba(0,0,0,0.04)",
                textAlign:"left",
                overflow:"hidden",
              }}
            >
              <div style={{padding:"18px 18px 14px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:48,height:48,background:L.lift,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="26"height="26"viewBox="0 0 24 24"fill={L.ink3}><path d="M2 18l2-6h14l2 6H2zm4-2h12l-1-2H7l-1 2z"/></svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500,color:L.ink,marginBottom:2}}>{sh.m}</div>
                  <M c={L.ink3}sz={9}sp="0.08em"sx={{display:"block",marginBottom:8}}>{sh.n}</M>
                  <div style={{display:"inline-flex",height:18,padding:"0 8px",background:L.lift,border:`1px solid ${L.rule}`,alignItems:"center"}}>
                    <M c={L.ink3}sz={8}sp="0.1em">{sh.t}</M>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <F n={sh.km}sz={36}c={L.ink}/>
                  <br/><M c={L.ink3}sz={8}sp="0.08em">km</M>
                </div>
              </div>
              <div style={{padding:"0 18px 16px"}}>
                <div style={{height:3,background:L.lift,position:"relative",marginBottom:6}}>
                  <div style={{
                    position:"absolute",left:0,top:0,height:"100%",
                    width:v?`${Math.min(pct*100,100)}%`:0,
                    background:fill,
                    transition:`width .7s cubic-bezier(0,0,.2,1) ${.38+i*.1}s`,
                  }}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <M c={L.ink4}sz={8}sp="0.06em"up={false}>{sh.km} km used</M>
                  <M c={L.ink4}sz={8}sp="0.06em"up={false}>{sh.goal} km goal</M>
                </div>
              </div>
              {/* Tap hint */}
              <div style={{padding:"10px 18px",borderTop:`1px solid ${L.rule}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <M c={L.ink4}sz={8}sp="0.1em">Tap for details</M>
                <M c={L.ink3}sz={12}sp="0">›</M>
              </div>
            </TapBtn>);
        })}
      </div>

      {/* Dot indicators */}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:12,paddingBottom:4}}>
        {shoes.map((_,i)=>(
          <div
            key={i}
            onClick={()=>{
              if(!ref.current) return;
              ref.current.scrollTo({left:i*ref.current.offsetWidth,behavior:"smooth"});
            }}
            style={{
              width:i===active?20:6,height:3,
              background:i===active?L.ink:L.ink4,
              cursor:"pointer",
              transition:"width .22s cubic-bezier(.34,1.56,.64,1), background .15s ease",
            }}
          />))}
      </div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// ROUTE CAROUSEL: horizontal scroll-snap
// ═══════════════════════════════════════════════════════════

// Unique SVG path per route so each card feels distinct
const ROUTE_PATHS = [
  "M5,52 C20,44 38,28 60,24 C82,20 96,38 118,32 C140,26 158,14 178,10 C190,7 198,8 200,9",
  "M5,52 C18,48 30,20 55,18 C80,16 90,42 115,36 C140,30 162,8 185,6 C192,5 198,6 200,6",
  "M5,50 C25,50 40,30 65,26 C90,22 105,46 128,40 C151,34 168,12 188,8 C194,7 198,7 200,8",
  "M5,48 C22,46 42,24 66,22 C90,20 100,44 122,38 C144,32 164,10 186,7 C193,6 198,7 200,8",
];

function RouteCarousel({routes,saved,setSaved,toast,onExpand}) {
  const ref = useRef(null);
  const [active,setActive] = useState(0);

  function onScroll() {
    if(!ref.current) return;
    const idx = Math.round(ref.current.scrollLeft / (ref.current.offsetWidth));
    setActive(idx);
  }

  return (<div style={{marginTop:16}}>
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          display:"flex",
          overflowX:"auto",
          scrollSnapType:"x mandatory",
          WebkitOverflowScrolling:"touch",
          scrollBehavior:"smooth",
          paddingLeft:24,
          paddingRight:24,
          gap:12,
          msOverflowStyle:"none",
          scrollbarWidth:"none",
        }}
      >
        {routes.map((rt,i)=>(
          <div
            key={i}
            style={{
              flexShrink:0,
              width:"calc(100vw - 72px)",
              maxWidth:318,
              scrollSnapAlign:"start",
              background:L.card,
              border:`1px solid ${L.rule}`,
              overflow:"hidden",
            }}
          >
            {/* Map thumbnail */}
            <TapBtn
              onClick={()=>onExpand(rt)}
              sx={{display:"block",width:"100%",height:100,background:L.lift,position:"relative",textAlign:"left"}}
            >
              <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${L.rule} 1px,transparent 1px),linear-gradient(90deg,${L.rule} 1px,transparent 1px)`,backgroundSize:"14px 14px"}}/>
              <div style={{position:"absolute",inset:10}}>
                <svg width="100%"height="100%"viewBox="0 0 200 60"preserveAspectRatio="none">
                  <path d={ROUTE_PATHS[i%ROUTE_PATHS.length]} stroke={L.ink4} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d={ROUTE_PATHS[i%ROUTE_PATHS.length]} stroke={L.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="0"/>
                </svg>
              </div>
              {rt.by==="On Curated"&&(
                <div style={{position:"absolute",top:8,left:8,height:16,padding:"0 6px",background:L.volt,display:"flex",alignItems:"center"}}>
                  <M c={L.ink}sz={7}sp="0.1em">Curated</M>
                </div>)}
              <div style={{position:"absolute",bottom:8,right:8,padding:"3px 7px",background:"rgba(0,0,0,0.08)"}}>
                <M c={L.ink3}sz={7}sp="0.1em">Expand →</M>
              </div>
            </TapBtn>

            {/* Route info */}
            <div style={{padding:"14px 14px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,paddingRight:8}}>
                  <div style={{fontSize:13,fontWeight:500,color:L.ink,marginBottom:4}}>{rt.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <M c={L.ink3}sz={8}sp="0.08em">{rt.dist}</M>
                    <div style={{width:3,height:3,background:L.ink4}}/>
                    <M c={L.ink3}sz={8}sp="0.08em">{rt.diff}</M>
                    <div style={{width:3,height:3,background:L.ink4}}/>
                    <M c={L.ink3}sz={8}sp="0.08em">{rt.surface}</M>
                  </div>
                </div>
                <TapBtn
                  onClick={()=>{
                    setSaved(p=>{const n=[...p];n[i]=!n[i];return n;});
                    if(!saved[i]){haptic("light");toast("Route saved","✓");}
                  }}
                  sx={{width:30,height:30,background:saved[i]?L.ink:L.lift,border:`1px solid ${saved[i]?L.ink:L.rule}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                >
                  <svg width="13"height="13"viewBox="0 0 24 24"fill={saved[i]?"#fff":"none"}stroke={saved[i]?"#fff":L.ink3}strokeWidth="1.5"strokeLinecap="square">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                  </svg>
                </TapBtn>
              </div>

              {/* Shoe recommendation pill */}
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <M c={L.ink4}sz={8}sp="0.08em">Best in</M>
                <div style={{height:16,padding:"0 7px",background:L.lift,border:`1px solid ${L.rule}`,display:"flex",alignItems:"center"}}>
                  <M c={L.ink2}sz={8}sp="0.06em">{rt.shoe}</M>
                </div>
                <M c={L.ink4}sz={8}sp="0.06em">· {rt.by}</M>
              </div>
            </div>
          </div>))}
      </div>

      {/* Dot indicators */}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:10}}>
        {routes.map((_,i)=>(
          <div
            key={i}
            onClick={()=>{
              if(!ref.current) return;
              const cardW = ref.current.querySelector("div")?.offsetWidth || 318;
              ref.current.scrollTo({left:i*(cardW+12),behavior:"smooth"});
            }}
            style={{
              width:i===active?20:6,height:3,
              background:i===active?L.ink:L.ink4,
              cursor:"pointer",
              transition:"width .22s cubic-bezier(.34,1.56,.64,1), background .15s ease",
            }}
          />))}
      </div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// GARAGE
// ═══════════════════════════════════════════════════════════
const SHOES_DATA=[{m:"Cloudmonster 2",n:"The Workhorse",t:"Race Day",km:494,goal:1000},{m:"Cloudflow 4",n:"Daily Driver",t:"Training",km:487,goal:600},{m:"Cloudgo 2",n:"The New One",t:"Recovery",km:88,goal:1000}];
function GarageScreen({go,toast}) {
  const [v,setV]=useState(false);
  const [det,setDet]=useState(null);
  const [cyclon,setCyclon]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),60);return()=>clearTimeout(t);},[]);
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{padding:"60px 24px 0"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:.88,color:L.ink,marginBottom:4,opacity:v?1:0,transform:v?"none":"translateY(10px)",transition:"all .44s cubic-bezier(0,0,.2,1) .05s"}}>SHOE<br/>GARAGE.</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",opacity:v?1:0,transition:"opacity .4s .15s"}}>
          <M c={L.ink3}sz={10}sp="0.08em">3 pairs · Jan 2025</M>
          <TapBtn onClick={()=>go("shoereg")}sx={{background:"none"}}><M c={L.ink3}sz={9}sp="0.1em">+ Add Shoe</M></TapBtn>
        </div>
      </div>
      {/* Retire prompt */}
      <div style={{margin:"20px 24px 0",padding:18,background:L.ink,border:`1px solid ${L.warn}`,opacity:v?1:0,transition:"all .44s .18s"}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:L.warn,flexShrink:0,marginTop:4}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:500,color:"#fff",marginBottom:4}}>Cloudflow 4 is at 487 km</div>
            <M c="rgba(255,255,255,0.42)"sz={9}sp="0.04em"up={false}sx={{display:"block",lineHeight:1.7,marginBottom:12}}>Cushion degradation affects form. Replace at 500–700 km.</M>
            <div style={{display:"flex",gap:8}}>
              <TapBtn dark sx={{height:32,padding:"0 14px",background:L.warn,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase",color:"#fff"}}>Shop on.com →</TapBtn>
              <TapBtn dark onClick={()=>setCyclon(true)}sx={{height:32,padding:"0 14px",background:"transparent",border:"1px solid rgba(255,255,255,0.14)",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)"}}>Cyclon ♻</TapBtn>
            </div>
          </div>
        </div>
      </div>
      {/* Shoe cards · horizontal scroll-snap carousel */}
      <ShoeCarousel shoes={SHOES_DATA} v={v} onSelect={setDet}/>
      <div style={{margin:"14px 24px 24px",padding:"18px 0",borderTop:`1px solid ${L.rule}`,display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr",opacity:v?1:0,transition:"opacity .44s .48s"}}>
        {[{v:"3",l:"Active"},null,{v:"1069",l:"Total km"},null,{v:"14",l:"Months"}].map((it,i)=>it===null?<div key={i}style={{background:L.rule}}/>:<div key={i}style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><F n={it.v}sz={28}c={L.ink}/><M c={L.ink3}sz={8}sp="0.1em"sx={{textAlign:"center"}}>{it.l}</M></div>)}
      </div>
      <Sheet open={!!det}onClose={()=>setDet(null)}C={L}title={det?.m}>
        {det&&<div>{[{l:"Distance",v:`${det.km} km`},{l:"Goal",v:`${det.goal} km`},{l:"Remaining",v:`${det.goal-det.km} km`},{l:"Condition",v:det.km/det.goal>.75?"Replace Soon":"Good"}].map((row,i)=>(
          <div key={i}style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:i<3?`1px solid ${L.rule}`:"none"}}><M c={L.ink3}sz={9}sp="0.1em">{row.l}</M><M c={L.ink}sz={9}sp="0.04em"up={false}>{row.v}</M></div>))}<TapBtn sx={{width:"100%",height:48,background:L.ink,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff",marginTop:16}}>View on on.com →</TapBtn></div>}
      </Sheet>
      {/* Cyclon sheet */}
      <Sheet open={cyclon}onClose={()=>setCyclon(false)}C={L}title="Cyclon Program">
        <p style={{fontSize:13,color:L.ink2,lineHeight:1.65,marginBottom:16}}>On's Cyclon subscription lets you return worn shoes for recycling and receive a new pair. Close the loop on your Cloudflow 4.</p>
        {[{l:"Monthly subscription",v:"$29.99/mo"},{l:"Shoes covered",v:"Cloudflow 4"},{l:"Return process",v:"Free shipping label"},{l:"Turnaround",v:"5–7 business days"}].map((row,i)=>(
          <div key={i}style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${L.rule}`}}><M c={L.ink3}sz={9}sp="0.1em">{row.l}</M><M c={L.ink}sz={9}sp="0.04em"up={false}>{row.v}</M></div>))}
        <TapBtn onClick={()=>{toast("Cyclon request sent","♻");setCyclon(false);}}sx={{width:"100%",height:48,background:L.ink,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff",marginTop:16}}>Join Cyclon →</TapBtn>
      </Sheet>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// FEED, Reactions + Pull-to-Refresh
// ═══════════════════════════════════════════════════════════
const REACTIONS=[{id:"push",icon:"🔥",label:"Push"},{id:"solid",icon:"✊",label:"Solid"},{id:"pace",icon:"⚡",label:"Pace"},{id:"zone",icon:"🏔",label:"Zone"},{id:"rep",icon:"✓",label:"Respect"}];
const FEED_DATA=[
  {i:"MR",n:"Maya R.",  t:"2h",  d:"14.2",p:"4:38",type:"long", note:"Finally broke 4:40 on a long run.", shoe:"Cloudmonster 2",pr:true,  rxn:{push:8,solid:4,pace:12,zone:3,rep:6}},
  {i:"JK",n:"Jordan K.",t:"5h",  d:"6.1", p:"5:12",type:"easy", note:"Recovery through Maymont. Legs feel good.", shoe:"Cloudflow 4",pr:false, rxn:{push:2,solid:7,pace:1,zone:5,rep:3}},
  {i:"ST",n:"Sam T.",   t:"8h",  d:"10.0",p:"4:22",type:"tempo",note:"10k tempo. Zone 4 the whole way.", shoe:"Cloudgo 2",pr:false, rxn:{push:14,solid:6,pace:18,zone:2,rep:9}},
  {i:"AC",n:"Alex C.",  t:"yday",d:"21.1",p:"4:55",type:"race", note:"Half marathon done. Sub-1:45 is in reach.", shoe:"Cloudmonster 2",pr:true,  rxn:{push:22,solid:14,pace:10,zone:8,rep:20}},
];
const FTC={tempo:L.voltDim,long:L.ink4,easy:L.ink4,race:L.pos};
function FeedScreen({toast}) {
  const [loading,setLoading]=useState(true);
  const [items,setItems]=useState(FEED_DATA.map(f=>({...f,rxn:{...f.rxn}})));
  const [mine,setMine]=useState(FEED_DATA.map(()=>({})));
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),1000);return()=>clearTimeout(t);},[]);
  function react(fi,rid){
    const already=mine[fi][rid];
    setMine(p=>{const n=[...p];n[fi]={...n[fi],[rid]:!already};return n;});
    setItems(p=>{const n=p.map(x=>({...x,rxn:{...x.rxn}}));n[fi].rxn[rid]+=(already?-1:1);return n;});
  }
  function refresh(){setLoading(true);setTimeout(()=>setLoading(false),1000);}
  return (<div style={{position:"absolute",inset:0,background:L.bg}}>
      <PullRefresh onRefresh={refresh} C={L}>
        <div style={{paddingBottom:82}}>
          <div style={{padding:"60px 24px 0"}}>
            <F n={"Apex\nClubs."} sz={64}c={L.ink}sx={{lineHeight:.88,whiteSpace:"pre-line",display:"block",marginBottom:4}}/>
            <M c={L.ink3}sz={10}sp="0.08em"sx={{display:"block",marginBottom:20}}>Richmond Running Co. · 24 members</M>
            <HR c={L.rule}/>
          </div>
          {loading?(
            <div style={{padding:"20px 24px 0"}}>
              {[0,1,2].map(i=>(
                <div key={i}style={{padding:"20px 0",borderBottom:`1px solid ${L.rule}`,display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}><div className="sk"style={{width:36,height:36,borderRadius:"50%",flexShrink:0}}/><div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}><div className="sk"style={{width:"40%",height:10}}/><div className="sk"style={{width:"26%",height:8}}/></div></div>
                  <div className="sk"style={{height:52,width:"100%"}}/><div className="sk"style={{width:"75%",height:9}}/>
                </div>))}
            </div>):(
            <div style={{padding:"0 24px"}}>
              {items.map((item,i)=>(
                <div key={i}style={{padding:"20px 0",borderBottom:`1px solid ${L.rule}`,animation:`countUp .4s cubic-bezier(0,0,.2,1) ${i*.08}s both`}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:L.ink,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><M c={L.bg}sz={10}sp="0.04em">{item.i}</M></div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                        <div style={{fontSize:13,color:L.ink,fontWeight:500}}>{item.n}</div>
                        <M c={L.ink4}sz={8}sp="0.08em">{item.t} ago</M>
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
                        <div style={{width:16,height:2,background:FTC[item.type]}}/>
                        <M c={L.ink3}sz={8}sp="0.08em">{item.shoe}</M>
                        {item.pr&&<div style={{display:"inline-flex",height:14,padding:"0 5px",background:L.volt,alignItems:"center"}}><M c={L.ink}sz={7}sp="0.1em"sx={{fontWeight:500}}>PR</M></div>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr",background:L.lift,marginBottom:10}}>
                    {[{l:"Distance",v:`${item.d} km`},null,{l:"Pace",v:`${item.p}/km`},null,{l:"Type",v:item.type}].map((s,j)=>s===null?<div key={j}style={{background:L.rule}}/>:<div key={j}style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 0"}}><M c={L.ink4}sz={7}sp="0.12em">{s.l}</M><M c={L.ink}sz={9}sp="0.04em"up={false}>{s.v}</M></div>)}
                  </div>
                  <div style={{fontSize:12,color:L.ink2,lineHeight:1.55,marginBottom:12}}>{item.note}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {REACTIONS.map(rxn=>{
                      const active=mine[i][rxn.id];
                      return (<TapBtn key={rxn.id}onClick={()=>react(i,rxn.id)}sx={{display:"flex",alignItems:"center",gap:4,height:28,padding:"0 10px",background:active?L.ink:L.lift,border:`1px solid ${active?L.ink:L.rule}`,transition:"all .15s ease"}}>
                          <span style={{fontSize:12,lineHeight:1}}>{rxn.icon}</span>
                          <M c={active?"#fff":L.ink3}sz={8}sp="0.06em"up={false}>{item.rxn[rxn.id]}</M>
                        </TapBtn>);
                    })}
                  </div>
                </div>))}
            </div>)}
        </div>
      </PullRefresh>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// APEX CLUBS: full implementation
// ═══════════════════════════════════════════════════════════
const CLUBS=[
  {name:"Richmond Running Co.",members:24,city:"Richmond VA",upcoming:"Sat 7am · Brown's Island",myClub:true,board:[{i:"MR",n:"Maya R.",km:68,rank:1},{i:"BP",n:"Benn P.",km:38,rank:2},{i:"JK",n:"Jordan K.",km:32,rank:3},{i:"ST",n:"Sam T.",km:28,rank:4}]},
  {name:"RVA Trail Runners",members:41,city:"Richmond VA",upcoming:"Sun 8am · James River Park",myClub:false,board:[]},
];
function ClubsScreen({toast}) {
  const [sel,setSel]=useState(null);
  const [rsvp,setRsvp]=useState(false);
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{padding:"60px 24px 20px"}}>
        <F n="My\nClubs." sz={64}c={L.ink}sx={{lineHeight:.88,whiteSpace:"pre-line",display:"block",marginBottom:4}}/>
        <M c={L.ink3}sz={10}sp="0.08em">Geo-located running communities</M>
      </div>
      <HR c={L.rule}/>
      {CLUBS.map((club,i)=>(
        <TapBtn key={i}onClick={()=>setSel(club)}sx={{display:"block",width:"calc(100% - 48px)",margin:`${i===0?20:12}px 24px 0`,padding:20,background:club.myClub?L.ink:L.card,border:`1px solid ${club.myClub?L.ink:L.rule}`,textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:club.myClub?"#fff":L.ink,marginBottom:3}}>{club.name}</div>
              <M c={club.myClub?"rgba(255,255,255,0.5)":L.ink3}sz={9}sp="0.06em">{club.city} · {club.members} members</M>
            </div>
            {club.myClub&&<div style={{height:18,padding:"0 8px",background:L.volt,display:"flex",alignItems:"center"}}><M c={L.ink}sz={8}sp="0.1em">Member</M></div>}
          </div>
          {club.upcoming&&<div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 12px",background:club.myClub?"rgba(255,255,255,0.07)":L.lift}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:club.myClub?L.volt:L.ink,flexShrink:0}}/>
            <M c={club.myClub?L.volt:L.ink3}sz={9}sp="0.06em">{club.upcoming}</M>
          </div>}
        </TapBtn>))}
      <TapBtn sx={{display:"block",width:"calc(100% - 48px)",margin:"12px 24px",padding:16,background:L.lift,border:`1px solid ${L.rule}`,textAlign:"center"}}>
        <M c={L.ink3}sz={9}sp="0.1em">+ Discover clubs near you</M>
      </TapBtn>
      {/* Club detail sheet */}
      <Sheet open={!!sel}onClose={()=>setSel(null)}C={L}title={sel?.name}>
        {sel&&<div>
          <M c={L.ink3}sz={9}sp="0.1em"sx={{display:"block",marginBottom:12}}>Leaderboard · This week</M>
          {sel.board.map((row,i)=>(
            <div key={i}style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${L.rule}`}}>
              <div style={{width:24,height:24,background:i===0?L.volt:L.lift,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <M c={i===0?L.ink:L.ink3}sz={9}sp="0" up={false}>{row.rank}</M>
              </div>
              <div style={{width:32,height:32,borderRadius:"50%",background:L.ink,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><M c={L.bg}sz={9}sp="0.04em">{row.i}</M></div>
              <div style={{flex:1}}><div style={{fontSize:13,color:row.n==="Benn P."?L.ink:L.ink2,fontWeight:row.n==="Benn P."?500:400}}>{row.n}</div></div>
              <M c={L.ink}sz={10}sp="0.04em"up={false}>{row.km} km</M>
            </div>))}
          {sel.upcoming&&<div style={{marginTop:16}}>
            <M c={L.ink3}sz={9}sp="0.12em"sx={{display:"block",marginBottom:10}}>Next club run</M>
            <div style={{padding:16,background:L.lift,marginBottom:12}}>
              <div style={{fontSize:13,color:L.ink,fontWeight:500,marginBottom:4}}>{sel.upcoming}</div>
              <M c={L.ink3}sz={9}sp="0.04em">8 members going · Open to all paces</M>
            </div>
            <TapBtn onClick={()=>{haptic("medium");toast("You're in! See you Saturday","✓");setSel(null);}} sx={{width:"100%",height:48,background:L.ink,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff",fontWeight:500}}>RSVP →</TapBtn>
          </div>}
        </div>}
      </Sheet>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// CHALLENGES
// ═══════════════════════════════════════════════════════════
const CHALLENGES_DATA=[
  {name:"March Distance",type:"Distance",target:"100 km",ends:"Mar 31",joined:true, progress:38,goal:100,drop:"Cloudgo 2 colourway",brand:true},
  {name:"Elevation Seeker",type:"Elevation",target:"2000 m",ends:"Apr 15",joined:false,progress:0, goal:2000,drop:"On cap",brand:true},
  {name:"5-Day Streak",type:"Streak",target:"5 days",ends:"Ongoing",joined:true, progress:3,goal:5,drop:null,brand:false},
  {name:"Half Marathon Prep",type:"Distance",target:"80 km",ends:"Apr 1",joined:false,progress:0,goal:80,drop:null,brand:false},
];
function ChallengesScreen({toast}) {
  const [joined,setJoined]=useState(CHALLENGES_DATA.map(c=>c.joined));
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{padding:"60px 24px 20px"}}>
        <F n="Chal-\nlenges." sz={64}c={L.ink}sx={{lineHeight:.88,whiteSpace:"pre-line",display:"block",marginBottom:4}}/>
        <M c={L.ink3}sz={10}sp="0.08em">Distance · Elevation · Streak</M>
      </div>
      <HR c={L.rule}/>
      <div style={{padding:"16px 24px 0",display:"flex",flexDirection:"column",gap:12}}>
        {CHALLENGES_DATA.map((ch,i)=>(
          <div key={i}style={{background:L.card,border:`1px solid ${joined[i]?L.ruleHard:L.rule}`,padding:20,boxShadow:joined[i]?"0 4px 20px rgba(0,0,0,0.08)":"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                  {ch.brand&&<div style={{height:16,padding:"0 6px",background:L.volt,display:"flex",alignItems:"center"}}><M c={L.ink}sz={7}sp="0.1em">On Official</M></div>}
                  <M c={L.ink3}sz={8}sp="0.1em">{ch.type}</M>
                </div>
                <div style={{fontSize:14,fontWeight:500,color:L.ink,marginBottom:2}}>{ch.name}</div>
                <M c={L.ink3}sz={9}sp="0.04em">{ch.target} · Ends {ch.ends}</M>
              </div>
              <TapBtn onClick={()=>{
                const nowJoined=!joined[i];
                setJoined(p=>{const n=[...p];n[i]=nowJoined;return n;});
                if(nowJoined){haptic("medium");toast(`Joined ${ch.name}`,"✓");}
              }}sx={{height:30,padding:"0 14px",background:joined[i]?L.lift:L.ink,border:`1px solid ${joined[i]?L.rule:L.ink}`,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase",color:joined[i]?L.ink3:"#fff",flexShrink:0}}>
                {joined[i]?"Joined":"Join"}
              </TapBtn>
            </div>
            {joined[i]&&<div>
              <div style={{height:3,background:L.lift,position:"relative",marginBottom:6}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min((ch.progress/ch.goal)*100,100)}%`,background:L.ink}}/></div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <M c={L.ink3}sz={8}sp="0.06em"up={false}>{ch.progress}/{ch.goal}{ch.type==="Distance"?" km":ch.type==="Elevation"?" m":" days"}</M>
                <M c={L.ink3}sz={8}sp="0.06em"up={false}>{Math.round((ch.progress/ch.goal)*100)}%</M>
              </div>
            </div>}
            {ch.drop&&<div style={{marginTop:12,padding:"8px 12px",background:L.lift,display:"flex",gap:8,alignItems:"center"}}>
              <M c={L.ink3}sz={8}sp="0.1em">Top finisher drop</M>
              <M c={L.ink}sz={8}sp="0.06em"up={false}>· {ch.drop}</M>
            </div>}
          </div>))}
      </div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// EVENT DISCOVERY
// ═══════════════════════════════════════════════════════════
const EVENTS_DATA=[
  {name:"On × Richmond 5k",org:"On Running Official",date:"Mar 22",loc:"Brown's Island",dist:"5k",type:"Race",going:34,rsvped:false},
  {name:"Saturday Pop-Up Run",org:"Richmond Running Co.",date:"Mar 23",loc:"Maymont Park",dist:"8–12 km",type:"Club Run",going:8,rsvped:true},
  {name:"James River Trail Run",org:"On Community",date:"Mar 30",loc:"Belle Isle",dist:"10 km",type:"Trail",going:19,rsvped:false},
  {name:"Half Marathon Tune-Up",org:"RVA Trail Runners",date:"Apr 5",loc:"Byrd Park",dist:"21.1 km",type:"Race",going:52,rsvped:false},
];
function EventsScreen({toast}) {
  const [rsvped,setRsvped]=useState(EVENTS_DATA.map(e=>e.rsvped));
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{padding:"60px 24px 20px"}}>
        <F n="Events." sz={64}c={L.ink}sx={{lineHeight:.88,display:"block",marginBottom:4}}/>
        <M c={L.ink3}sz={10}sp="0.08em">Races · Club runs · Community events</M>
      </div>
      <HR c={L.rule}/>
      <div style={{padding:"16px 24px 0",display:"flex",flexDirection:"column",gap:10}}>
        {EVENTS_DATA.map((ev,i)=>(
          <div key={i}style={{background:L.card,border:`1px solid ${rsvped[i]?L.ruleHard:L.rule}`,padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{flex:1,paddingRight:12}}>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                  <M c={L.ink3}sz={8}sp="0.1em">{ev.type}</M>
                  <div style={{width:3,height:3,borderRadius:"50%",background:L.ink4}}/>
                  <M c={L.ink3}sz={8}sp="0.08em" up={false}>{ev.date}</M>
                </div>
                <div style={{fontSize:14,fontWeight:500,color:L.ink,marginBottom:3}}>{ev.name}</div>
                <M c={L.ink3}sz={9}sp="0.04em">{ev.org}</M>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <F n={ev.dist} sz={22} c={L.ink}/>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderTop:`1px solid ${L.rule}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                <svg width="12"height="12"viewBox="0 0 24 24"fill="none"stroke={L.ink3}strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12"cy="10"r="3"/></svg>
                <M c={L.ink3}sz={9}sp="0.04em" up={false}>{ev.loc}</M>
              </div>
              <M c={L.ink3}sz={8}sp="0.06em">{ev.going} going</M>
              <TapBtn onClick={()=>{
                const now=!rsvped[i];
                setRsvped(p=>{const n=[...p];n[i]=now;return n;});
                if(now){haptic("medium");toast(`RSVP'd for ${ev.name}`,"✓");}
              }}sx={{height:28,padding:"0 12px",background:rsvped[i]?L.ink:L.lift,border:`1px solid ${rsvped[i]?L.ink:L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase",color:rsvped[i]?"#fff":L.ink2}}>
                {rsvped[i]?"Going ✓":"RSVP"}
              </TapBtn>
            </div>
          </div>))}
      </div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// ROUTE LIBRARY
// ═══════════════════════════════════════════════════════════
const ROUTES_DATA=[
  {name:"Belle Isle Loop",dist:"5.2 km",diff:"Easy",surface:"Trail",shoe:"Cloudgo 2",city:"Richmond VA",by:"On Curated",saved:false},
  {name:"Canal Walk + Back",dist:"8.4 km",diff:"Moderate",surface:"Paved",shoe:"Cloudflow 4",city:"Richmond VA",by:"Maya R.",saved:true},
  {name:"Pony Pasture Out+Back",dist:"11.1 km",diff:"Moderate",surface:"Trail",shoe:"Cloudmonster 2",city:"Richmond VA",by:"Sam T.",saved:false},
  {name:"Monument Ave 10k",dist:"10.0 km",diff:"Easy",surface:"Paved",shoe:"Cloudflow 4",city:"Richmond VA",by:"On Curated",saved:false},
];
function RoutesScreen({toast}) {
  const [saved,setSaved]=useState(ROUTES_DATA.map(r=>r.saved));
  const [mapRoute,setMapRoute]=useState(null);
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{padding:"60px 24px 20px"}}>
        <F n="Routes." sz={64}c={L.ink}sx={{lineHeight:.88,display:"block",marginBottom:4}}/>
        <M c={L.ink3}sz={10}sp="0.08em">Community routes · Curated by On</M>
      </div>
      <HR c={L.rule}/>
      <RouteCarousel routes={ROUTES_DATA} saved={saved} setSaved={setSaved} toast={toast} onExpand={setMapRoute}/>
      <MapOverlay open={!!mapRoute} onClose={()=>setMapRoute(null)} C={L}/>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════
const MONTHLY=[{mo:"Oct",km:142},{mo:"Nov",km:168},{mo:"Dec",km:124},{mo:"Jan",km:189},{mo:"Feb",km:201},{mo:"Mar",km:156}];
const MMKM=Math.max(...MONTHLY.map(m=>m.km));
function ProfileScreen({go,userName,userShoe,toast}) {
  const [v,setV]=useState(false);
  const [cardSheet,setCardSheet]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),60);return()=>clearTimeout(t);},[]);
  const STATS=[{l:"Total km",v:"546"},{l:"Runs",v:"42"},{l:"Avg pace",v:"4:48"},{l:"Longest",v:"21.1 km"},{l:"Best pace",v:"3:58/km"},{l:"Shoe goal",v:"70%"}];
  return (<div style={{position:"absolute",inset:0,background:L.bg,overflowY:"auto",paddingBottom:82}}>
      <div style={{background:L.ink,padding:"60px 24px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:180,lineHeight:.8,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.04)",top:-10,right:-12,whiteSpace:"nowrap",pointerEvents:"none"}}>{(userName||"RUN").toUpperCase()}</div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:L.volt,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><F n={(userName||"B").charAt(0).toUpperCase()}sz={28}c={L.ink}/></div>
          <F n={(userName||"BENN").toUpperCase()}sz={52}c="#fff"sx={{lineHeight:.88,display:"block",marginBottom:4}}/>
          <M c="rgba(255,255,255,0.4)"sz={9}sp="0.1em">{userShoe||"Cloudmonster 2"} · Richmond VA</M>
        </div>
      </div>
      <div style={{margin:"16px 24px 0",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,opacity:v?1:0,transition:"opacity .4s .1s"}}>
        {[{l:"This week",v:"38 km"},{l:"This month",v:"156 km"},{l:"YTD",v:"546 km"}].map((s,i)=>(
          <div key={i}style={{padding:"14px 12px",background:L.card,border:`1px solid ${L.rule}`,boxShadow:"0 1px 8px rgba(0,0,0,0.05)"}}>
            <M c={L.ink3}sz={8}sp="0.1em"sx={{display:"block",marginBottom:4}}>{s.l}</M>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:L.ink}}>{s.v}</div>
          </div>))}
      </div>
      <div style={{margin:"12px 24px 0",padding:20,background:L.card,border:`1px solid ${L.rule}`,boxShadow:"0 2px 16px rgba(0,0,0,0.06)",opacity:v?1:0,transition:"opacity .4s .18s"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><M c={L.ink3}sz={9}sp="0.14em">Monthly km</M><M c={L.ink3}sz={9}sp="0.08em"up={false}>6 months</M></div>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:72}}>
          {MONTHLY.map((m,i)=>{
            const isLast=i===MONTHLY.length-1;
            return (<div key={i}style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",position:"relative",height:v?Math.round((m.km/MMKM)*60):0,transition:`height .6s cubic-bezier(0,0,.2,1) ${.2+i*.06}s`}}>
                  <div style={{position:"absolute",inset:0,background:isLast?L.ink:L.ink4}}/>
                </div>
                <M c={isLast?L.ink:L.ink4}sz={7}sp="0.06em">{m.mo}</M>
              </div>);
          })}
        </div>
      </div>
      <div style={{margin:"12px 24px 0",opacity:v?1:0,transition:"opacity .4s .26s"}}>
        <M c={L.ink3}sz={9}sp="0.14em"sx={{display:"block",marginBottom:10}}>Year to date</M>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:L.rule,border:`1px solid ${L.rule}`}}>
          {STATS.map((s,i)=><div key={i}style={{padding:"12px 14px",background:L.card}}><M c={L.ink3}sz={8}sp="0.1em"sx={{display:"block",marginBottom:3}}>{s.l}</M><div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:L.ink}}>{s.v}</div></div>)}
        </div>
      </div>
      <div style={{margin:"12px 24px 0",padding:18,background:L.card,border:`1px solid ${L.rule}`,opacity:v?1:0,transition:"opacity .4s .34s"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><M c={L.ink3}sz={9}sp="0.1em">Goal progress</M><M c={L.pos}sz={9}sp="0.08em">On track</M></div>
        <div style={{fontSize:13,color:L.ink,marginBottom:10}}>Hit 50 km/week by May 2026</div>
        <div style={{height:4,background:L.lift,position:"relative",marginBottom:6}}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",width:v?"76%":0,background:L.ink,transition:"width .8s cubic-bezier(0,0,.2,1) .5s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}><M c={L.ink3}sz={8}sp="0.08em">38 km / week now</M><M c={L.ink4}sz={8}sp="0.08em">76% to goal</M></div>
      </div>
      <TapBtn onClick={()=>setCardSheet(true)}sx={{display:"flex",gap:14,alignItems:"center",margin:"12px 24px 0",padding:18,background:L.ink,width:"calc(100% - 48px)",textAlign:"left",opacity:v?1:0,transition:"opacity .4s .4s"}}>
        <div style={{width:44,height:44,background:L.volt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="20"height="20"viewBox="0 0 24 24"fill="none"stroke={L.ink}strokeWidth="1.5"strokeLinecap="square"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12"y1="2"x2="12"y2="15"/></svg></div>
        <div style={{flex:1}}><div style={{fontSize:12,color:"#fff",fontWeight:500,marginBottom:2}}>Share your 2026 stats</div><M c="rgba(255,255,255,0.45)"sz={9}sp="0.04em">Generate shareable stat card</M></div>
        <M c="rgba(255,255,255,0.4)"sz={16}sp="0">→</M>
      </TapBtn>
      <div style={{margin:"10px 24px 24px",padding:"12px 14px",background:L.lift,border:`1px solid ${L.rule}`,display:"flex",gap:8,alignItems:"center",opacity:v?1:0,transition:"opacity .4s .46s"}}>
        <div style={{width:6,height:6,background:L.pos,borderRadius:"50%",flexShrink:0}}/>
        <M c={L.ink3}sz={9}sp="0.04em">Connected to On account · Orders sync automatically</M>
      </div>
      <Sheet open={cardSheet}onClose={()=>setCardSheet(false)}C={L}title="Your 2026 Card">
        <div style={{background:L.ink,padding:22,marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:120,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.05)",top:-8,right:-6,lineHeight:.8,whiteSpace:"nowrap",pointerEvents:"none"}}>2026</div>
          <M c="rgba(255,255,255,0.35)"sz={8}sp="0.14em"sx={{display:"block",marginBottom:10}}>On Apex · {(userName||"Benn").toUpperCase()}'s 2026</M>
          <F n="546"sz={60}c="#fff"/><M c="rgba(255,255,255,0.5)"sz={12}sp="0.04em"up={false}sx={{marginLeft:5}}>km</M>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
            {[{l:"Runs",v:"42"},{l:"Avg pace",v:"4:48/km"},{l:"Best",v:"3:58/km"},{l:"Shoe",v:userShoe||"CM2"}].map((s,i)=>(
              <div key={i}><M c="rgba(255,255,255,0.35)"sz={8}sp="0.12em"sx={{display:"block",marginBottom:2}}>{s.l}</M><M c="rgba(255,255,255,0.8)"sz={10}sp="0.04em"up={false}>{s.v}</M></div>))}
          </div>
          <div style={{display:"inline-flex",alignItems:"center",height:18,padding:"0 8px",background:L.volt,marginTop:14}}><M c={L.ink}sz={8}sp="0.1em"sx={{fontWeight:500}}>ON APEX</M></div>
        </div>
        {["Save to Photos","Share to Instagram","Copy Link"].map((opt,i)=>(
          <TapBtn key={i}onClick={()=>{toast("Shared","→");setCardSheet(false);}}sx={{width:"100%",height:46,background:L.lift,border:`1px solid ${L.rule}`,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:L.ink,marginBottom:8}}>{opt}</TapBtn>))}
      </Sheet>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// SECONDARY NAV, Clubs/Challenges/Events/Routes sub-nav
// ═══════════════════════════════════════════════════════════
function CommunityHub({go,toast}) {
  const [tab,setTab]=useState("clubs");
  const TABS=[{id:"clubs",label:"Clubs"},{id:"challenges",label:"Challenges"},{id:"events",label:"Events"},{id:"routes",label:"Routes"}];
  const content={
    clubs:      <ClubsScreen toast={toast}/>,
    challenges: <ChallengesScreen toast={toast}/>,
    events:     <EventsScreen toast={toast}/>,
    routes:     <RoutesScreen toast={toast}/>,
  };
  return (<div style={{position:"absolute",inset:0,background:L.bg,display:"flex",flexDirection:"column",paddingBottom:82}}>
      {/* Sub-nav tabs */}
      <div style={{position:"absolute",top:50,left:0,right:0,height:40,background:L.bg,borderBottom:`1px solid ${L.rule}`,display:"flex",zIndex:70}}>
        {TABS.map(t=>(
          <TapBtn key={t.id}onClick={()=>setTab(t.id)}sx={{flex:1,height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"none",borderBottom:tab===t.id?`2px solid ${L.ink}`:"2px solid transparent",transition:"border-color .15s"}}>
            <M c={tab===t.id?L.ink:L.ink3}sz={9}sp="0.1em">{t.label}</M>
          </TapBtn>))}
      </div>
      {/* Content · offset for tabs */}
      <div style={{position:"absolute",top:90,left:0,right:0,bottom:0,overflow:"hidden"}}>
        <div key={tab} style={{position:"absolute",inset:0,animation:"fadeUp .3s cubic-bezier(0,0,.2,1) both"}}>
          {content[tab]}
        </div>
      </div>
    </div>);
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
const NAV_ORDER=["home","feed","prerun","garage","you"];

export default function App() {
  useGlobal();
  const embedded =
    typeof window !== "undefined" && window.self !== window.top;
  const {toasts,show:toast} = useToast();
  const [screen,setScreen] = useState("onboarding");
  const [run,dispatch] = useReducer(runR,RUN0);
  const [user,setUser] = useState({name:"Benn",shoe:"Cloudmonster 2",goal:null});
  const [installBanner,setInstallBanner] = useState(false);
  const timer = useRef(null);
  const touchX = useRef(null);
  const [swipeDx,setSwipeDx] = useState(0);

  // Show install prompt after onboarding
  useEffect(()=>{
    if(screen!=="home") return;
    const t=setTimeout(()=>setInstallBanner(true),3000);
    return()=>clearTimeout(t);
  },[screen]);

  const go = useCallback(target=>{
    if(target===screen) return;
    clearInterval(timer.current);
    if(target==="run"){
      dispatch({type:"START",shoe:user.shoe});
      timer.current=setInterval(()=>dispatch({type:"TICK"}),1000);
    }
    setScreen(target);
  },[screen,user.shoe]);

  useEffect(()=>()=>clearInterval(timer.current),[]);

  function onPD(e){if(["run","prerun","onboarding"].includes(screen))return;touchX.current=e.clientX;}
  function onPM(e){if(touchX.current===null)return;setSwipeDx(e.clientX-touchX.current);}
  function onPU(){
    if(Math.abs(swipeDx)>65&&!["run","prerun","onboarding","summary","shoereg"].includes(screen)){
      const idx=NAV_ORDER.indexOf(screen);
      if(swipeDx<0&&idx<NAV_ORDER.length-1)go(NAV_ORDER[idx+1]);
      if(swipeDx>0&&idx>0)go(NAV_ORDER[idx-1]);
    }
    setSwipeDx(0);touchX.current=null;
  }

  const isDark=["run","prerun","onboarding"].includes(screen);
  const C=isDark?D:L;
  const navCur=["summary","shoereg"].includes(screen)?"home":screen;
  const showNav=!["run","prerun","onboarding","shoereg"].includes(screen);

  const screenMap={
    onboarding: <OnboardingScreen go={go} onComplete={data=>{setUser(data);toast(`Welcome, ${data.name||"Runner"}!`,"→");}}/>,
    home:       <HomeScreen go={go} userName={user.name} toast={toast}/>,
    prerun:     <PreRunScreen go={go} run={run} dispatch={dispatch} userShoe={user.shoe} toast={toast}/>,
    run:        <RunScreen go={go} run={run} dispatch={dispatch} toast={toast}/>,
    summary:    <SummaryScreen go={go} run={run} toast={toast}/>,
    feed:       <CommunityHub go={go} toast={toast}/>,
    garage:     <GarageScreen go={go} toast={toast}/>,
    shoereg:    <ShoeRegScreen go={go} toast={toast}/>,
    you:        <ProfileScreen go={go} userName={user.name} userShoe={user.shoe} toast={toast}/>,
  };

  return (<div style={{
      display:"flex",alignItems:"center",justifyContent:"center",
      minHeight: embedded ? undefined : "100vh",
      height: embedded ? "auto" : undefined,
      background:"#0C0C0C",
      padding: embedded ? 0 : 20,
      fontFamily:"'DM Sans',sans-serif",
      boxSizing:"border-box",
    }}>
      <div
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
        style={{
          width:390,height:844,
          background:C.bg,
          border: embedded ? "none" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: embedded ? 0 : 50,
          overflow:"hidden",
          position:"relative",flexShrink:0,
          boxShadow: embedded ? "none" : "0 0 0 1px rgba(255,255,255,0.03),0 40px 100px rgba(0,0,0,0.9)",
          transform:swipeDx?`translateX(${swipeDx*.12}px)`:"none",
          transition:swipeDx?"none":"transform .2s ease, background .5s ease",
          touchAction:"none",
        }}
      >
        <div style={{
          position:"absolute",
          inset: embedded ? 10 : 0,
          overflow:"hidden",
          borderRadius: embedded ? 40 : 0,
        }}>
          {!["onboarding","prerun"].includes(screen)&&<Island running={screen==="run"} elapsed={run.elapsed}/>}
          {screen!=="onboarding"&&<Status C={C}/>}

          <div key={screen} style={{position:"absolute",inset:0,animation:"fadeUp .3s cubic-bezier(0,0,.2,1) both"}}>
            {screenMap[screen]||screenMap.home}
          </div>

          {showNav&&<BottomNav cur={navCur} go={go} C={C}/>}

          <ToastLayer toasts={toasts} C={C}/>

          <InstallBanner
            show={installBanner&&screen==="home"}
            onInstall={()=>{toast("Added to Home Screen","✓");setInstallBanner(false);}}
            onDismiss={()=>setInstallBanner(false)}
          />
        </div>
      </div>
    </div>);
}
