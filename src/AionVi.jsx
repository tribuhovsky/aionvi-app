import { useState, useEffect, useRef } from "react";

const CYN="#00E5FF",LAV="#B388FF",MNT="#69F0AE",BG="#030A14",LIL="#CE93D8",AQU="#80DEEA";
const card=(e={})=>({background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,...e});
const pill=(on,c=CYN)=>({padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${on?c:"rgba(255,255,255,0.15)"}`,background:on?`${c}22`:"transparent",color:on?c:"rgba(255,255,255,0.55)",transition:"all .2s"});
const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

const SOL=[
  {hz:396,l:"396",eff:"Страх → Свобода",c:MNT,free:0},
  {hz:417,l:"417",eff:"Трансформация",c:AQU,free:0},
  {hz:432,l:"432",eff:"Природная гармония",c:CYN,free:1},
  {hz:528,l:"528",eff:"Исцеление",c:LAV,free:1},
  {hz:639,l:"639",eff:"Отношения",c:LIL,free:0},
  {hz:741,l:"741",eff:"Интуиция",c:"#F48FB1",free:0},
  {hz:852,l:"852",eff:"Дух. порядок",c:AQU,free:0},
  {hz:963,l:"963",eff:"Единство",c:LAV,free:0},
];
const TRACKS=[
  {id:"mt1",n:"Утренний поток",d:"Медитативная атмосфера",hz:432,dur:"18:30",free:1,type:"track"},
  {id:"mt2",n:"Тихое пространство",d:"Глубокое расслабление",hz:417,dur:"22:00",free:0,type:"track"},
  {id:"mt3",n:"Источник",d:"Восстановление и исцеление",hz:528,dur:"20:15",free:0,type:"track"},
  {id:"mt4",n:"Глубина",d:"Медитация · темнота и свет",hz:396,dur:"25:00",free:0,type:"track"},
];
const NAT=[
  {id:"ocean",n:"Океан",free:1,type:"nature"},{id:"forest",n:"Лес",free:1,type:"nature"},
  {id:"white",n:"Белый шум",free:1,type:"nature"},{id:"pink",n:"Розовый шум",free:0,type:"nature"},
  {id:"fire",n:"Огонь",free:0,type:"nature"},{id:"rain",n:"Дождь",free:0,type:"nature"},
];
const IG=[
  {id:"vargan",n:"Варган",tip:"Резонирует с телом через кости черепа — эффект ощущается физически.",variants:[
    {id:"va_432",n:"Якутский",s:"Тёплый · классический",hz:432,free:1,type:"vargan"},
    {id:"va_417",n:"Алтайский",s:"Трансформирующий · медный",hz:417,free:0,type:"vargan"},
    {id:"va_396",n:"Австрийский",s:"Глубокий · освобождающий",hz:396,free:0,type:"vargan"},
    {id:"va_528",n:"Норвежский",s:"Светлый · воздушный",hz:528,free:0,type:"vargan"},
  ]},
  {id:"bowl",n:"Тиб. чаша",tip:"Создают стоячие волны, воздействующие на каждую клетку тела.",variants:[
    {id:"bo_396",n:"Чаша UT · 396",s:"Страх → Свобода",hz:396,free:0,type:"bowl"},
    {id:"bo_417",n:"Чаша RE · 417",s:"Трансформация ситуаций",hz:417,free:0,type:"bowl"},
    {id:"bo_432",n:"Чаша MI · 432",s:"Природная гармония",hz:432,free:1,type:"bowl"},
    {id:"bo_528",n:"Чаша FA · 528",s:"Исцеление",hz:528,free:0,type:"bowl"},
    {id:"bo_639",n:"Чаша SOL · 639",s:"Любовь · связь",hz:639,free:0,type:"bowl"},
  ]},
  {id:"handpan",n:"Хендпан",tip:"Богатый обертоновый звук — медитативный и обволакивающий.",variants:[
    {id:"hp_396",n:"A minor",s:"Меланхолия · медитация",hz:396,free:0,type:"handpan"},
    {id:"hp_417",n:"C# minor",s:"Трансформация · поиск",hz:417,free:0,type:"handpan"},
    {id:"hp_432",n:"D minor",s:"Глубина · покой",hz:432,free:1,type:"handpan"},
    {id:"hp_528",n:"F major",s:"Радость · исцеление",hz:528,free:0,type:"handpan"},
  ]},
  {id:"panflute",n:"Флейта Пана",tip:"Один из древнейших инструментов. Связывает с природой и первозданным звуком.",variants:[
    {id:"pf_396",n:"Флейта UT",s:"Очищение · земля",hz:396,free:0,type:"panflute"},
    {id:"pf_417",n:"Флейта RE",s:"Перемены · ветер",hz:417,free:0,type:"panflute"},
    {id:"pf_432",n:"Флейта MI",s:"Природа · вода",hz:432,free:1,type:"panflute"},
    {id:"pf_528",n:"Флейта FA",s:"Свет · трансформация",hz:528,free:0,type:"panflute"},
  ]},
  {id:"drum",n:"Алт. бубен",tip:"Вводит в θ-состояние за 10–15 минут прослушивания.",variants:[
    {id:"dr_396",n:"Бубен земли",s:"Ритм корней · 396 Hz",hz:396,free:0,type:"drum"},
    {id:"dr_432",n:"Бубен духа",s:"Связь с миром · 432 Hz",hz:432,free:1,type:"drum"},
  ]},
  {id:"gong",n:"Гонг",tip:"Охватывает весь слышимый диапазон, вызывая глубокую перезагрузку нервной системы.",variants:[
    {id:"go_432",n:"Гонг пространства",s:"432 Hz · медитация",hz:432,free:0,type:"gong"},
    {id:"go_528",n:"Гонг трансформации",s:"528 Hz · исцеление",hz:528,free:0,type:"gong"},
  ]},
  {id:"crystal",n:"Крист. чаша",tip:"Особо чистый обертоновый звук кристалла.",variants:[
    {id:"cr_432",n:"Кристалл C",s:"Чистота · ясность",hz:432,free:0,type:"crystal"},
    {id:"cr_528",n:"Кристалл F",s:"Любовь · исцеление",hz:528,free:0,type:"crystal"},
  ]},
  {id:"kalimba",n:"Калимба",tip:"Африканский щипковый инструмент с нежным медитативным тоном.",variants:[
    {id:"ka_432",n:"Калимба C",s:"Чистота · радость",hz:432,free:1,type:"kalimba"},
    {id:"ka_528",n:"Калимба F",s:"Тепло · исцеление",hz:528,free:0,type:"kalimba"},
  ]},
];
const BIN=[
  {id:"delta",n:"Delta",d:"0.5–4 Hz · Глубокий сон",bHz:2,free:1,type:"binaural"},
  {id:"theta",n:"Theta",d:"4–8 Hz · Медитация",bHz:6,free:1,type:"binaural"},
  {id:"alpha",n:"Alpha",d:"8–14 Hz · Расслабление",bHz:10,free:0,type:"binaural"},
  {id:"beta",n:"Beta",d:"14–30 Hz · Фокус",bHz:20,free:0,type:"binaural"},
  {id:"gamma",n:"Gamma",d:"30–100 Hz · Осознанность",bHz:40,free:0,type:"binaural"},
];
const MEDS=[
  {id:"m1",t:"Полное расслабление",d:"Освобождение от напряжения",cat:"Расслабление",s:"8:30",f:"25:00",free:1,c:CYN},
  {id:"m2",t:"Спокойный сон",d:"Мягкий переход в сон",cat:"Сон",s:"9:00",f:"25:00",free:1,c:LAV},
  {id:"m3",t:"Ясность и фокус",d:"Активация ментальной ясности",cat:"Концентрация",free:0,c:AQU,s:"9:00",f:"25:00"},
  {id:"m4",t:"Исцеление тела",d:"Звуковое путешествие",cat:"Исцеление",free:0,c:MNT,s:"9:00",f:"25:00"},
  {id:"m5",t:"Поток энергии",d:"Активация жизненной силы",cat:"Энергия",free:0,c:LIL,s:"9:00",f:"25:00"},
  {id:"m6",t:"Свобода от тревоги",d:"Растворение страхов",cat:"Тревога",free:0,c:LAV,s:"9:00",f:"25:00"},
];
const MOODS=[
  {id:"anxious",l:"Тревога",icon:"zigzag",r:"Theta + Чаша 432 + Океан"},
  {id:"tired",l:"Усталость",icon:"wave_down",r:"Delta + Лес + Гонг 432"},
  {id:"scatter",l:"Рассеянность",icon:"scatter",r:"Beta + 528 Hz + Белый шум"},
  {id:"sad",l:"Грусть",icon:"arc_down",r:"639 Hz + Хендпан + Океан"},
  {id:"ok",l:"Ясность",icon:"diamond",r:"Alpha + 432 Hz + Калимба"},
];
const ALL_ITEMS={
  ...Object.fromEntries(IG.flatMap(g=>g.variants).map(v=>[v.id,v])),
  ...Object.fromEntries(NAT.map(n=>[n.id,n])),
  ...Object.fromEntries(TRACKS.map(t=>[t.id,t])),
  ...Object.fromEntries(BIN.map(b=>[b.id,b])),
};

/* ── VISUALS ── */
function AionLogo({size=60,animated=false}){
  const w=size*.82,h=size;
  return(
    <svg width={w} height={h} viewBox="0 0 52 72">
      <defs>
        <filter id="vg" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {animated&&<style>{`@keyframes op{0%,100%{opacity:.85}50%{opacity:1}}`}</style>}
      </defs>
      <g filter="url(#vg)">
        <polygon points="22,40 27,45 4,3" fill="white" opacity="0.93"/>
        <polygon points="30,40 25,45 48,3" fill="white" opacity="0.93"/>
        <line x1="26" y1="45" x2="26" y2="70" stroke="white" strokeWidth="2.3" strokeLinecap="round" opacity="0.75"/>
        <circle cx="26" cy="32" r="9" fill="white" opacity="0.1"/>
        <circle cx="26" cy="32" r="6" fill="white" opacity="0.22"/>
        <circle cx="26" cy="32" r="4.5" fill="white" style={animated?{animation:"op 3s ease-in-out infinite"}:{}} opacity="0.95"/>
      </g>
    </svg>
  );
}

function AionWordmark({size=22}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:size*.5}}>
      <span style={{fontSize:size,fontWeight:200,letterSpacing:`${size*.22}px`,color:"#fff",fontFamily:"'Arial Narrow','Arial',sans-serif",textTransform:"uppercase",whiteSpace:"nowrap"}}>AION</span>
      <span style={{fontSize:size*.75,fontWeight:200,letterSpacing:`${size*.06}px`,color:"#fff",fontFamily:"'Arial Narrow','Arial',sans-serif"}}>Vi</span>
    </div>
  );
}

function FogBackground(){
  const cvs=useRef(null);
  useEffect(()=>{
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d");c.width=430;c.height=900;
    const blobs=[
      {x:70,y:130,r:185,vx:.21,vy:.14,rgb:[105,240,174],ph:0},
      {x:370,y:80,r:150,vx:-.18,vy:.21,rgb:[179,136,255],ph:1.6},
      {x:215,y:370,r:200,vx:.13,vy:-.1,rgb:[0,229,255],ph:3},
      {x:85,y:540,r:165,vx:.19,vy:.17,rgb:[179,136,255],ph:.9},
      {x:385,y:660,r:175,vx:-.21,vy:-.14,rgb:[105,240,174],ph:2.2},
      {x:215,y:810,r:145,vx:.1,vy:.21,rgb:[206,147,216],ph:4.1},
    ];
    let t=0,raf;
    const draw=()=>{
      raf=requestAnimationFrame(draw);ctx.clearRect(0,0,430,900);
      blobs.forEach(b=>{
        b.x+=b.vx;b.y+=b.vy;
        if(b.x<-b.r)b.x=430+b.r;if(b.x>430+b.r)b.x=-b.r;
        if(b.y<-b.r)b.y=900+b.r;if(b.y>900+b.r)b.y=-b.r;
        const a=.028+.013*Math.sin(t*.007+b.ph);
        const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
        g.addColorStop(0,`rgba(${b.rgb.join(',')},${a})`);
        g.addColorStop(.65,`rgba(${b.rgb.join(',')},${a*.3})`);
        g.addColorStop(1,`rgba(${b.rgb.join(',')},0)`);
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
      });t++;
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={cvs} style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,height:900,pointerEvents:"none",zIndex:0}}/>;
}

function MandalaViz({playing,color=CYN,size=180}){
  const cvs=useRef(null);
  useEffect(()=>{
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d");c.width=size;c.height=size;
    const cx=size/2,cy=size/2;
    let t=0,raf;
    const hr=parseInt(color.slice(1,3),16),hg=parseInt(color.slice(3,5),16),hb=parseInt(color.slice(5,7),16);
    const draw=()=>{
      raf=requestAnimationFrame(draw);ctx.clearRect(0,0,size,size);
      const sp=playing?.0025:.0007;
      const pulse=playing?1+.07*Math.sin(t*.045):1;
      const alf=playing?.22:.08;
      // Outer ring: 6 petals (flower of life)
      ctx.save();ctx.translate(cx,cy);ctx.rotate(t*sp);
      for(let i=0;i<6;i++){
        ctx.save();ctx.rotate(i*Math.PI/3);
        ctx.beginPath();ctx.arc(size*.2,0,size*.2,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${hr},${hg},${hb},${alf*.7})`;ctx.lineWidth=.8;ctx.stroke();ctx.restore();
      }
      ctx.restore();
      // Middle octagon spokes
      ctx.save();ctx.translate(cx,cy);ctx.rotate(-t*sp*1.6);
      for(let i=0;i<8;i++){
        const ang=i*Math.PI/4;
        const r1=size*.2*pulse,r2=size*.33*pulse;
        ctx.beginPath();ctx.moveTo(Math.cos(ang)*r1,Math.sin(ang)*r1);ctx.lineTo(Math.cos(ang)*r2,Math.sin(ang)*r2);
        ctx.strokeStyle=`rgba(${hr},${hg},${hb},${playing?.55:.18})`;ctx.lineWidth=1.2;ctx.stroke();
      }
      ctx.restore();
      // Inner hexagon
      ctx.save();ctx.translate(cx,cy);ctx.rotate(t*sp*2.2);
      ctx.beginPath();
      for(let i=0;i<6;i++){const ang=i*Math.PI/3;const r=size*.15*pulse;i===0?ctx.moveTo(Math.cos(ang)*r,Math.sin(ang)*r):ctx.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);}
      ctx.closePath();ctx.strokeStyle=`rgba(${hr},${hg},${hb},${playing?.4:.12})`;ctx.lineWidth=1;ctx.stroke();
      ctx.restore();
      // Outer circle ring
      ctx.beginPath();ctx.arc(cx,cy,size*.38*pulse,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${hr},${hg},${hb},${playing?.18:.06})`;ctx.lineWidth=.7;ctx.stroke();
      // Glow core
      const gr=ctx.createRadialGradient(cx,cy,0,cx,cy,size*.11*pulse);
      gr.addColorStop(0,`rgba(${hr},${hg},${hb},${playing?.45:.12})`);
      gr.addColorStop(.5,`rgba(${hr},${hg},${hb},${playing?.15:.04})`);
      gr.addColorStop(1,`rgba(${hr},${hg},${hb},0)`);
      ctx.beginPath();ctx.arc(cx,cy,size*.11*pulse,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
      t++;
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[playing,color,size]);
  return <canvas ref={cvs} width={size} height={size} style={{borderRadius:"50%",display:"block"}}/>;
}

function CircleTimer({cur,max,size=80,color=CYN}){
  const r=(size-8)/2,circ=2*Math.PI*r,p=max>0?cur/max:0;
  return(
    <svg width={size} height={size} style={{position:"absolute",top:0,left:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={4}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={circ*(1-p)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dashoffset 1s linear"}}/>
    </svg>
  );
}

function LockIcon({col=LIL}){return <svg width="12" height="13" viewBox="0 0 12 13" fill="none"><rect x="1.5" y="6" width="9" height="6.5" rx="1.5" stroke={col} strokeWidth="1.2"/><path d="M3 6V4.5a3 3 0 016 0V6" stroke={col} strokeWidth="1.2" strokeLinecap="round"/></svg>;}

function TabIcon({type,active}){
  const col=active?CYN:"rgba(255,255,255,0.28)";const s=22;
  if(type==="home")return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9.5H22L16.5 14.5L18.5 22L12 17.5L5.5 22L7.5 14.5L2 9.5H9Z" stroke={col} strokeWidth="1.2" strokeLinejoin="round" fill={active?`${col}18`:"none"}/></svg>;
  if(type==="studio")return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.5" fill={col}/><path d="M8 12Q10 7.5 12 12Q14 16.5 16 12" stroke={col} strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M5 12Q8.5 4.5 12 12Q15.5 19.5 19 12" stroke={col} strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".5"/></svg>;
  if(type==="meditate")return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={col} strokeWidth="1.3"/><circle cx="12" cy="12" r="8" stroke={col} strokeWidth=".7" strokeDasharray="2.5 2" opacity=".45"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke={col} strokeWidth="1.1" strokeLinecap="round"/></svg>;
  if(type==="library")return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H16M3 18H12" stroke={col} strokeWidth="1.4" strokeLinecap="round"/><polygon points="20,11 22.5,14.5 20,18 17.5,14.5" stroke={col} strokeWidth="1.1" fill={active?`${col}20`:"none"}/></svg>;
  if(type==="profile")return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7.5" r="3.5" stroke={col} strokeWidth="1.3"/><path d="M5 21Q5 15 12 15Q19 15 19 21" stroke={col} strokeWidth="1.3" fill="none" strokeLinecap="round"/><ellipse cx="12" cy="7.5" rx="7" ry="7" stroke={col} strokeWidth=".6" strokeDasharray="1.5 2.5" opacity=".3"/></svg>;
  return null;
}

function MoodIcon({type,col}){
  if(type==="zigzag")return <svg width="18" height="12" fill="none"><polyline points="0,8 4,3 9,9 13,3 18,8" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if(type==="wave_down")return <svg width="18" height="12" fill="none"><path d="M0,3 Q4.5,9 9,6 Q13.5,3 18,7" stroke={col} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>;
  if(type==="scatter")return <svg width="18" height="12" fill="none"><circle cx="3" cy="4" r="2" fill={col}/><circle cx="9" cy="9" r="1.5" fill={col} opacity=".6"/><circle cx="15" cy="3" r="2" fill={col}/><circle cx="6" cy="8" r="1" fill={col} opacity=".4"/></svg>;
  if(type==="arc_down")return <svg width="18" height="12" fill="none"><path d="M1,2 Q9,12 17,2" stroke={col} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>;
  if(type==="diamond")return <svg width="18" height="12" fill="none"><polygon points="9,1 17,6 9,11 1,6" stroke={col} strokeWidth="1.3" fill={`${col}25`}/><circle cx="9" cy="6" r="1.5" fill={col}/></svg>;
  return null;
}

function Tip({text}){
  const [open,setOpen]=useState(false);
  return(
    <span style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:17,height:17,borderRadius:"50%",border:"1px solid rgba(255,255,255,.2)",background:"transparent",color:"rgba(255,255,255,.4)",fontSize:9,cursor:"pointer",lineHeight:"15px",padding:0}}>?</button>
      {open&&<div onClick={()=>setOpen(false)} style={{position:"absolute",top:22,right:0,zIndex:50,width:190,background:"#0D1F36",border:`1px solid ${CYN}30`,borderRadius:10,padding:"9px 11px",fontSize:11,color:"rgba(255,255,255,.65)",lineHeight:1.6}}>{text}</div>}
    </span>
  );
}

/* ── ONBOARDING ── */
const SLIDES=[
  {
    id:"welcome",
    render:()=>(
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}><AionLogo size={90} animated/></div>
        <div style={{marginBottom:10,display:"flex",justifyContent:"center"}}><AionWordmark size={22}/></div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.45)",letterSpacing:"0.08em",lineHeight:1.8}}>Твоя персональная<br/>звуковая среда</div>
      </div>
    ),
    hint:null,
  },
  {
    id:"frequency",
    render:()=>(
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" stroke={CYN} strokeWidth=".8" strokeDasharray="3 3" opacity=".4"/>
            <circle cx="40" cy="40" r="18" stroke={CYN} strokeWidth="1" opacity=".6"/>
            <circle cx="40" cy="40" r="7" fill={CYN} opacity=".8"/>
            {[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return <line key={i} x1={40+22*Math.cos(a)} y1={40+22*Math.sin(a)} x2={40+30*Math.cos(a)} y2={40+30*Math.sin(a)} stroke={CYN} strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>;})}
          </svg>
        </div>
        <div style={{fontSize:16,color:"#fff",fontWeight:300,marginBottom:10}}>Тональный ключ</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.9}}>Каждая частота несёт своё значение.<br/><span style={{color:CYN}}>432 Hz</span> — природная гармония.<br/><span style={{color:LAV}}>528 Hz</span> — исцеление.<br/>Выбери одну — и всё сложится в унисон.</div>
      </div>
    ),
    hint:"Выбери ключ первым — остальное встанет на место",
  },
  {
    id:"studio",
    render:()=>(
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {[[LAV,15,20],[CYN,35,28],[MNT,55,22]].map(([c,x,w],i)=>(
              <g key={i}>
                <rect x={x} y={30} width={w} height="20" rx="4" fill={`${c}18`} stroke={c} strokeWidth=".8"/>
                <rect x={x+w/2-2} y={24} width="4" height={Math.random()*10+6} rx="2" fill={c} opacity=".7" style={{transform:`scaleY(1)`,transformOrigin:`${x+w/2}px 44px`}}/>
              </g>
            ))}
            <path d="M10 55 Q20 45 30 52 Q40 58 50 46 Q60 36 70 48" stroke={AQU} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5"/>
          </svg>
        </div>
        <div style={{fontSize:16,color:"#fff",fontWeight:300,marginBottom:10}}>Studio — твой микшер</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.9}}>Накладывай слои: частота + инструмент + природа.<br/>Регулируй громкость каждого слоя.<br/>Создай <span style={{color:MNT}}>свою музыку Души</span> — и сохрани её.</div>
      </div>
    ),
    hint:"Начни с 2–3 слоёв — этого достаточно",
  },
  {
    id:"ready",
    render:()=>(
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
          <MandalaViz playing={true} color={CYN} size={120}/>
        </div>
        <div style={{fontSize:16,color:"#fff",fontWeight:300,marginBottom:10}}>Всё готово</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.9}}>Надень наушники.<br/>Выбери частоту. Добавь звуки.<br/>Позволь себе <span style={{color:LAV}}>просто быть</span>.</div>
      </div>
    ),
    hint:null,
  },
];

function Onboarding({onDone}){
  const [step,setStep]=useState(0);
  const slide=SLIDES[step];
  const isLast=step===SLIDES.length-1;
  return(
    <div style={{position:"fixed",inset:0,background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:200,padding:"0 28px"}}>
      <FogBackground/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380}}>
        <div style={{minHeight:320,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          {slide.render()}
        </div>
        {slide.hint&&(
          <div style={{marginBottom:24,padding:"9px 14px",background:`${CYN}0C`,border:`1px solid ${CYN}22`,borderRadius:10,fontSize:11,color:CYN,textAlign:"center",letterSpacing:".3px"}}>
            💡 {slide.hint}
          </div>
        )}
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <button
            onClick={isLast?onDone:()=>setStep(s=>s+1)}
            style={{flex:1,padding:"14px 0",borderRadius:14,background:isLast?CYN:`${CYN}18`,border:`1px solid ${CYN}${isLast?"":"44"}`,color:isLast?"#000":CYN,fontSize:14,cursor:"pointer",fontWeight:isLast?600:400,letterSpacing:"0.05em",transition:"all .2s"}}>
            {isLast?"Войти в AION Vi →":"Далее"}
          </button>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{padding:"14px 18px",borderRadius:14,background:"transparent",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.45)",fontSize:14,cursor:"pointer"}}>←</button>}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8}}>
          {SLIDES.map((_,i)=><div key={i} style={{width:i===step?20:6,height:6,borderRadius:3,background:i===step?CYN:"rgba(255,255,255,.18)",transition:"all .3s"}}/>)}
        </div>
        {step===0&&<button onClick={onDone} style={{display:"block",margin:"14px auto 0",background:"none",border:"none",color:"rgba(255,255,255,.25)",fontSize:11,cursor:"pointer",letterSpacing:".5px"}}>Пропустить</button>}
      </div>
    </div>
  );
}

/* ── SPLASH ── */
function Splash({onDone}){
  const [ph,setPh]=useState(0);
  const cvs=useRef(null);
  useEffect(()=>{
    setTimeout(()=>setPh(1),200);
    setTimeout(()=>setPh(2),2900);
    setTimeout(onDone,3400);
  },[]);
  useEffect(()=>{
    if(!cvs.current)return;
    const c=cvs.current,ctx=c.getContext("2d");
    let t=0,raf;
    const draw=()=>{
      raf=requestAnimationFrame(draw);ctx.clearRect(0,0,c.width,c.height);
      [[CYN,0,7],[LAV,2.2,5],[MNT,4.5,3]].forEach(([col,off,amp])=>{
        const r=parseInt(col.slice(1,3),16),g=parseInt(col.slice(3,5),16),b=parseInt(col.slice(5,7),16);
        ctx.beginPath();ctx.strokeStyle=`rgba(${r},${g},${b},0.55)`;ctx.lineWidth=1.5;
        for(let x=0;x<=c.width;x++){const y=c.height/2+amp*Math.sin(x/c.width*Math.PI*6+t*.04+off);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.stroke();
      });t++;
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return(
    <div style={{position:"fixed",inset:0,background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999,transition:"opacity .55s",opacity:ph===2?0:1}}>
      <div style={{transition:"all .9s",opacity:ph>=1?1:0,transform:ph>=1?"translateY(0) scale(1)":"translateY(12px) scale(.8)"}}><AionLogo size={90} animated/></div>
      <div style={{marginTop:22,opacity:ph>=1?1:0,transition:"opacity 1.1s .35s"}}><AionWordmark size={24}/></div>
      <div style={{marginTop:8,fontSize:11,letterSpacing:"0.3em",color:"rgba(255,255,255,.3)",opacity:ph>=1?1:0,transition:"opacity 1.1s .55s",textTransform:"uppercase"}}>Sound · Frequency · Harmony</div>
      <canvas ref={cvs} width={300} height={60} style={{marginTop:36,opacity:ph>=1?1:0,transition:"opacity 1.1s .65s"}}/>
    </div>
  );
}

/* ── STUDIO ── */
function InstGroup({group,selectedKey,layers,onToggle,pro}){
  const [open,setOpen]=useState(false);
  const hasActive=group.variants.some(v=>layers[v.id]);
  const solCol=hz=>SOL.find(s=>s.hz===hz)?.c||CYN;
  return(
    <div style={{marginBottom:7}}>
      <button onClick={()=>setOpen(o=>!o)} style={{...card({padding:"10px 13px",width:"100%",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,border:hasActive?`1px solid ${CYN}44`:"1px solid rgba(255,255,255,.09)"})}}>
        <div style={{width:32,height:32,borderRadius:8,background:`${hasActive?CYN:LAV}14`,border:`1px solid ${hasActive?CYN:LAV}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke={hasActive?CYN:LAV} strokeWidth="1.2"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke={hasActive?CYN:LAV} strokeWidth="1.1" strokeLinecap="round" opacity=".5"/></svg>
        </div>
        <div style={{flex:1}}><div style={{fontSize:13,color:hasActive?CYN:"rgba(255,255,255,.85)"}}>{group.n}</div>{hasActive&&<div style={{fontSize:9,color:CYN,marginTop:1,letterSpacing:1}}>АКТИВЕН</div>}</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.25)"}}>{group.variants.length} вида</div>
        {group.tip&&<Tip text={group.tip}/>}
        <div style={{fontSize:13,color:"rgba(255,255,255,.2)",transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</div>
      </button>
      {open&&(
        <div style={{...card({padding:9,marginTop:3,borderRadius:12})}}>
          {group.variants.map(v=>{
            const locked=!v.free&&!pro,active=!!layers[v.id];
            const col=solCol(v.hz);const cMatch=selectedKey&&v.hz===selectedKey;
            return(
              <button key={v.id} onClick={()=>onToggle(v)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 7px",borderRadius:10,cursor:"pointer",marginBottom:3,border:`1px solid ${active?col:cMatch?`${col}44`:"rgba(255,255,255,.06)"}`,background:active?`${col}14`:cMatch?`${col}07`:"transparent",opacity:locked&&!active?.4:1}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`${col}14`,border:`1px solid ${col}44`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:10,fontWeight:600,color:col,lineHeight:1}}>{v.hz}</span>
                  <span style={{fontSize:7,color:`${col}99`}}>Hz</span>
                </div>
                <div style={{flex:1,textAlign:"left"}}>
                  <div style={{fontSize:12,color:active?col:"rgba(255,255,255,.82)"}}>{v.n}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.37)",marginTop:1}}>{v.s}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                  {cMatch&&<span style={{fontSize:9,color:col,background:`${col}18`,padding:"2px 7px",borderRadius:8}}>✓ В ключе</span>}
                  {locked&&<LockIcon/>}
                  {active&&<div style={{width:6,height:6,borderRadius:"50%",background:col}}/>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KeySelector({selectedKey,setSelectedKey,pro}){
  const sk=SOL.find(s=>s.hz===selectedKey);
  return(
    <div style={{...card({padding:13,marginBottom:13})}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
        <div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em",marginBottom:2}}>ШАГ 1 · ТОНАЛЬНЫЙ КЛЮЧ</div>
          {sk&&<div style={{fontSize:11,color:sk.c}}>{sk.hz} Hz · {sk.eff}</div>}
        </div>
        <Tip text="Выбери основную частоту. Все инструменты, совместимые с ней, выделятся. Это гарантирует гармоничное звучание."/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
        {SOL.map(s=>{
          const locked=!s.free&&!pro,active=selectedKey===s.hz;
          return(
            <button key={s.hz} onClick={()=>locked?null:setSelectedKey(active?null:s.hz)}
              style={{padding:"7px 3px",borderRadius:9,border:`1px solid ${active?s.c:"rgba(255,255,255,.09)"}`,background:active?`${s.c}16`:"rgba(255,255,255,.02)",cursor:"pointer",textAlign:"center",opacity:locked?.4:1,position:"relative"}}>
              <div style={{fontSize:14,fontWeight:400,color:active?s.c:"rgba(255,255,255,.75)"}}>{s.l}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,.3)",marginTop:1,lineHeight:1.2}}>{s.eff.split(" ")[0]}</div>
              {locked&&<div style={{position:"absolute",top:2,right:3}}><LockIcon/></div>}
            </button>
          );
        })}
      </div>
      {!selectedKey&&<div style={{marginTop:7,fontSize:10,color:"rgba(255,255,255,.25)",textAlign:"center"}}>Выбери тональность — или пропусти для свободного режима</div>}
    </div>
  );
}

function StudioScreen({pro,layers,toggleLayer,updateVol,playing,sTime,onStop,saveMix,setShowPro,setShowShare,activeCount,freeLimit,selectedKey,setSelectedKey,sleepSec,setSleepSec,sleepActive,setSleepActive}){
  const [baseSec,setBaseSec]=useState("tracks");
  const [conflict,setConflict]=useState(null);
  const keyColor=SOL.find(s=>s.hz===selectedKey)?.c||CYN;
  const harmonyPct=()=>{
    const instr=Object.keys(layers).filter(id=>ALL_ITEMS[id]?.hz&&ALL_ITEMS[id]?.type!=="binaural");
    if(!selectedKey||instr.length===0)return null;
    return Math.round(instr.filter(id=>ALL_ITEMS[id]?.hz===selectedKey).length/instr.length*100);
  };
  const hp=harmonyPct();
  const hCol=hp===100?MNT:hp>=75?AQU:LIL;

  const handleToggle=item=>{
    if(!item.free&&!pro){setShowPro(true);return;}
    if(layers[item.id]){toggleLayer(item.id,true);return;}
    if(!pro&&activeCount>=freeLimit){setShowPro(true);return;}
    if(selectedKey&&item.hz&&item.hz!==selectedKey){setConflict(item);return;}
    toggleLayer(item.id,true,item);
  };

  const SLEEP_OPTS=[{l:"15 мин",v:900},{l:"30 мин",v:1800},{l:"45 мин",v:2700},{l:"60 мин",v:3600}];

  return(
    <div style={{padding:"50px 15px 20px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <div style={{fontSize:18,fontWeight:200,letterSpacing:"0.15em",color:"#fff"}}>STUDIO</div>
        <div style={{fontSize:11,color:activeCount>=freeLimit&&!pro?LIL:"rgba(255,255,255,.35)"}}>{activeCount}/{pro?"∞":freeLimit} слоёв</div>
      </div>

      {/* Mandala + Player */}
      <div style={{...card({padding:16,marginBottom:13,textAlign:"center"})}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
          <MandalaViz playing={playing} color={keyColor} size={160}/>
        </div>
        {hp!==null&&<div style={{fontSize:11,color:hCol,marginBottom:8}}>{hp===100?"✦ Идеальная гармония":`${hp}% гармония`}</div>}
        {!playing&&activeCount===0&&<div style={{fontSize:11,color:"rgba(255,255,255,.25)",marginBottom:8}}>Выбери тональный ключ и добавь звуки ↓</div>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{position:"relative",width:56,height:56}}>
            <CircleTimer cur={sTime} max={600} size={56} color={keyColor}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:11,fontWeight:600,color:keyColor}}>{fmt(sTime)}</div></div>
          </div>
          {sleepActive&&<div style={{position:"relative",width:48,height:48}}>
            <CircleTimer cur={sleepSec} max={sleepSec+1} size={48} color={LIL}/>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontSize:9,color:LIL}}>{Math.ceil(sleepSec/60)}м</div>
            </div>
          </div>}
          {playing&&<button onClick={onStop} style={{...pill(true,LIL),fontSize:11}}>■ Стоп</button>}
          {activeCount>0&&<button onClick={saveMix} style={{...pill(false,MNT),fontSize:11}}>Сохранить</button>}
          {activeCount>0&&<button onClick={()=>setShowShare(true)} style={{...pill(false,LAV),fontSize:11}}>Поделиться</button>}
        </div>

        {/* Active layers */}
        {activeCount>0&&(
          <div style={{marginTop:10,borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:10}}>
            {Object.entries(layers).map(([id,{vol}])=>{
              const d=ALL_ITEMS[id];if(!d)return null;
              const col=d.hz?(SOL.find(s=>s.hz===d.hz)?.c||CYN):CYN;
              return(
                <div key={id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:col,flexShrink:0}}/>
                  <span style={{fontSize:11,color:"rgba(255,255,255,.7)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{d.n}</span>
                  {d.hz&&<span style={{fontSize:9,color:`${col}99`,minWidth:24}}>{d.hz}Hz</span>}
                  <input type="range" min={0} max={1} step={0.01} value={vol} onChange={e=>updateVol(id,+e.target.value)} style={{width:55,accentColor:col}}/>
                  <button onClick={()=>toggleLayer(id,true)} style={{width:16,height:16,borderRadius:"50%",border:"none",background:"rgba(255,80,80,.2)",color:"rgba(255,150,150,.8)",cursor:"pointer",fontSize:9,flexShrink:0,padding:0}}>✕</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Sleep timer */}
        <div style={{marginTop:10,borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
          {!pro?<div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"rgba(255,255,255,.3)"}}><LockIcon/>Sleep Timer — Premium</div>:(
            <>
              <span style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>Sleep Timer:</span>
              {SLEEP_OPTS.map(o=>(
                <button key={o.v} onClick={()=>{setSleepSec(o.v);setSleepActive(true);}} style={{...pill(sleepActive&&sleepSec<=o.v+60&&sleepSec>=o.v-60,LIL),fontSize:10,padding:"4px 10px"}}>{o.l}</button>
              ))}
              {sleepActive&&<button onClick={()=>{setSleepActive(false);setSleepSec(0);}} style={{...pill(false),fontSize:10,padding:"4px 10px",color:"rgba(255,100,100,.7)"}}>Отмена</button>}
            </>
          )}
        </div>
      </div>

      <KeySelector selectedKey={selectedKey} setSelectedKey={setSelectedKey} pro={pro}/>

      {/* Tracks */}
      <div style={{...card({padding:13,marginBottom:13})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em"}}>ШАГ 2 · ОСНОВА</div>
          <Tip text="Выбери музыкальный трек или природный фон. Треки с совпадающей тональностью выделены."/>
        </div>
        <div style={{display:"flex",gap:7,marginBottom:10}}>
          <button onClick={()=>setBaseSec("tracks")} style={pill(baseSec==="tracks",CYN)}>Музыка</button>
          <button onClick={()=>setBaseSec("nature")} style={pill(baseSec==="nature",MNT)}>Природа</button>
        </div>
        {baseSec==="tracks"&&TRACKS.map(t=>{
          const locked=!t.free&&!pro,active=!!layers[t.id];
          const col=SOL.find(s=>s.hz===t.hz)?.c||CYN;
          const cMatch=selectedKey&&t.hz===selectedKey;
          return(
            <button key={t.id} onClick={()=>locked?setShowPro(true):handleToggle(t)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 9px",borderRadius:11,cursor:"pointer",marginBottom:5,border:`1px solid ${active?col:cMatch?`${col}44`:"rgba(255,255,255,.07)"}`,background:active?`${col}12`:cMatch?`${col}07`:"transparent",opacity:locked&&!active?.42:1}}>
              <div style={{width:38,height:38,borderRadius:9,background:`${col}16`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:10,fontWeight:500,color:col}}>{t.hz}</span>
                <span style={{fontSize:7,color:`${col}88`}}>Hz</span>
              </div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontSize:13,color:active?col:"rgba(255,255,255,.82)"}}>{t.n}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.38)",marginTop:1}}>{t.d} · {t.dur}</div>
              </div>
              {cMatch&&selectedKey&&<span style={{fontSize:9,color:col}}>✓</span>}
              {locked&&<LockIcon/>}
            </button>
          );
        })}
        {baseSec==="nature"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {NAT.map(n=>{
              const locked=!n.free&&!pro,active=!!layers[n.id];
              return(
                <button key={n.id} onClick={()=>locked?setShowPro(true):handleToggle(n)}
                  style={{...card({padding:"11px 9px",cursor:"pointer",textAlign:"center",border:`1px solid ${active?MNT:"rgba(255,255,255,.07)"}`,background:active?`${MNT}10`:"rgba(255,255,255,.02)"}),opacity:locked&&!active?.42:1}}>
                  <div style={{marginBottom:5}}><svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M10 2 Q14 2 16 6 Q18 10 10 14 Q2 10 4 6 Q6 2 10 2Z" stroke={active?MNT:"rgba(255,255,255,.4)"} strokeWidth="1.2" fill={active?`${MNT}18`:"none"}/></svg></div>
                  <div style={{fontSize:12,color:active?MNT:"rgba(255,255,255,.7)"}}>{n.n}</div>
                  {locked&&<div style={{display:"flex",justifyContent:"center",marginTop:3}}><LockIcon/></div>}
                  {active&&<div style={{width:5,height:5,borderRadius:"50%",background:MNT,margin:"4px auto 0"}}/>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Instruments */}
      <div style={{...card({padding:13,marginBottom:13})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em"}}>ШАГ 3 · ИНСТРУМЕНТЫ</div>
          <Tip text="Открой группу — выбери вариант в нужной тональности. Зелёные совпадают с твоим ключом."/>
        </div>
        {selectedKey?<div style={{fontSize:10,color:"rgba(255,255,255,.28)",marginBottom:9}}>✓ Зелёные — {selectedKey} Hz · ⚠ остальные потребуют подтверждения</div>
          :<div style={{fontSize:10,color:"rgba(255,255,255,.28)",marginBottom:9}}>Выбери ключ выше, чтобы видеть совместимые инструменты</div>}
        {IG.map(g=><InstGroup key={g.id} group={g} selectedKey={selectedKey} layers={layers} onToggle={handleToggle} pro={pro}/>)}
      </div>

      {/* Binaural */}
      <div style={{...card({padding:13,marginBottom:13})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em"}}>БИНАУРАЛЬНЫЕ РИТМЫ</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:9,color:"rgba(255,255,255,.22)"}}>🎧 наушники</span><Tip text="Разные частоты в каждое ухо создают третью частоту. Совместимы с любой тональностью."/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {BIN.map(b=>{
            const locked=!b.free&&!pro,active=!!layers[b.id];
            return(
              <button key={b.id} onClick={()=>locked?setShowPro(true):handleToggle(b)}
                style={{...card({padding:"10px 9px",cursor:"pointer",textAlign:"center",border:`1px solid ${active?LAV:"rgba(255,255,255,.07)"}`,background:active?`${LAV}10`:"rgba(255,255,255,.02)"}),opacity:locked&&!active?.42:1}}>
                <div style={{fontSize:13,fontWeight:400,color:active?LAV:"rgba(255,255,255,.82)"}}>{b.n}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.37)",marginTop:2}}>{b.d}</div>
                {locked&&<div style={{display:"flex",justifyContent:"center",marginTop:3}}><LockIcon/></div>}
                {active&&<div style={{width:5,height:5,borderRadius:"50%",background:LAV,margin:"4px auto 0"}}/>}
              </button>
            );
          })}
        </div>
      </div>

      {conflict&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:18}}>
          <div style={{...card({padding:22,width:"100%",maxWidth:320}),background:"#0A1628"}}>
            <div style={{fontSize:14,color:"#fff",marginBottom:7}}>Разные тональности</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.55)",lineHeight:1.75,marginBottom:18}}>
              <span style={{color:SOL.find(s=>s.hz===conflict.hz)?.c||CYN}}>{conflict.n}</span> — {conflict.hz} Hz,<br/>твой ключ — {selectedKey} Hz.<br/>Возможна дисгармония. Добавить?
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{toggleLayer(conflict.id,true,conflict);setConflict(null);}} style={{...pill(true,LIL),flex:1,textAlign:"center",padding:"10px 0"}}>Добавить</button>
              <button onClick={()=>setConflict(null)} style={{...pill(false),flex:1,textAlign:"center",padding:"10px 0"}}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── OTHER SCREENS ── */
function HomeScreen({pro,mood,setMood,streak,setTab}){
  return(
    <div style={{padding:"50px 15px 20px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <AionWordmark size={18}/>
        <div style={{...card({padding:"8px 12px",borderRadius:12,textAlign:"center"})}}>
          <div style={{width:18,height:18,margin:"0 auto 2px"}}><svg viewBox="0 0 20 22" fill="none"><path d="M10 1L13 8H20L14.5 12.5L16.5 20L10 15.5L3.5 20L5.5 12.5L0 8H7Z" stroke={AQU} strokeWidth="1.3" fill={`${AQU}20`}/></svg></div>
          <div style={{fontSize:13,fontWeight:600,color:AQU}}>{streak}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,.35)",letterSpacing:".5px"}}>ДНЕЙ</div>
        </div>
      </div>
      <div style={{...card({padding:15,marginBottom:14})}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.35)",letterSpacing:"0.2em",marginBottom:12}}>КАК ТЫ СЕЙЧАС?</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {MOODS.map(m=>{const on=mood===m.id;const col=on?CYN:"rgba(255,255,255,.45)";return(
            <button key={m.id} onClick={()=>setMood(m.id)} style={{...pill(on,CYN),display:"flex",alignItems:"center",gap:7}}>
              <MoodIcon type={m.icon} col={col}/><span>{m.l}</span>
            </button>
          );})}
        </div>
        {mood&&<div style={{marginTop:11,padding:"8px 12px",background:`${CYN}0C`,borderRadius:9,fontSize:11,color:CYN}}>↗ {MOODS.find(m=>m.id===mood)?.r}</div>}
      </div>
      <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em",marginBottom:9}}>БЫСТРЫЙ СТАРТ</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>
        {[{label:"Studio",sub:"Собери свой звук",tab:"studio",c:CYN},{label:"Медитации",sub:"Практики AION Vi",tab:"meditate",c:LAV},{label:"Библиотека",sub:"Мои миксы",tab:"library",c:MNT},{label:"Профиль",sub:pro?"Premium ✦":"Бесплатно",tab:"profile",c:LIL}].map(x=>(
          <button key={x.tab} onClick={()=>setTab(x.tab)} style={{...card({padding:"13px 11px",cursor:"pointer",border:`1px solid ${x.c}1A`,textAlign:"left"})}}>
            <div style={{marginBottom:7}}><TabIcon type={x.tab==="profile"?"profile":x.tab==="meditate"?"meditate":x.tab==="library"?"library":"studio"} active={false}/></div>
            <div style={{fontSize:13,color:"#fff"}}>{x.label}</div>
            <div style={{fontSize:10,color:x.c,marginTop:2}}>{x.sub}</div>
          </button>
        ))}
      </div>
      <div style={{...card({padding:13,background:"rgba(179,136,255,0.05)",border:`1px solid ${LAV}28`})}}>
        <div style={{fontSize:9,color:LAV,letterSpacing:"0.2em",marginBottom:5}}>КОД ЖИЗНИ</div>
        <div style={{fontSize:13,color:"#fff",marginBottom:3}}>Персональная звуковая матрица</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>VIP-сессия с автором · по имени и дате рождения</div>
      </div>
    </div>
  );
}

function MeditateScreen({pro,setShowPro}){
  const [sel,setSel]=useState(null);const [mPlay,setMPlay]=useState(false);const [mTime,setMT]=useState(0);const [cat,setCat]=useState("Все");
  const tRef=useRef(null);
  useEffect(()=>{if(mPlay){tRef.current=setInterval(()=>setMT(t=>t+1),1000);}else clearInterval(tRef.current);return()=>clearInterval(tRef.current);},[mPlay]);
  const cats=["Все",...[...new Set(MEDS.map(m=>m.cat))]];
  const list=cat==="Все"?MEDS:MEDS.filter(m=>m.cat===cat);
  if(sel){const med=MEDS.find(m=>m.id===sel);return(
    <div style={{padding:"50px 15px 20px",position:"relative",zIndex:1}}>
      <button onClick={()=>{setSel(null);setMPlay(false);setMT(0);}} style={{...pill(false),marginBottom:18}}>← Назад</button>
      <div style={{...card({padding:22,textAlign:"center"})}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><MandalaViz playing={mPlay} color={med.c} size={120}/></div>
        <div style={{fontSize:9,color:med.c,letterSpacing:"0.2em",marginBottom:6}}>{med.cat.toUpperCase()}</div>
        <div style={{fontSize:18,fontWeight:300,color:"#fff",marginBottom:4}}>{med.t}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginBottom:18}}>{med.d}</div>
        {!pro&&<div style={{fontSize:10,color:"rgba(255,255,255,.28)",marginBottom:18}}>Версия: {med.s} · Полная {med.f} — Premium</div>}
        <div style={{position:"relative",width:100,height:100,margin:"0 auto 20px"}}>
          <CircleTimer cur={mTime} max={pro?parseInt(med.f)*60:parseInt(med.s)*60} size={100} color={med.c}/>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:18,fontWeight:200,color:"#fff"}}>{fmt(mTime)}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:2}}>из {pro?med.f:med.s}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={()=>setMPlay(p=>!p)} style={{padding:"10px 26px",borderRadius:24,background:`${med.c}18`,border:`1px solid ${med.c}55`,color:med.c,fontSize:13,cursor:"pointer"}}>{mPlay?"⏸ Пауза":"▶ Играть"}</button>
          {mPlay&&<button onClick={()=>{setMT(0);setMPlay(false);}} style={{padding:"10px 16px",borderRadius:24,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.14)",color:"rgba(255,255,255,.5)",fontSize:13,cursor:"pointer"}}>↺</button>}
        </div>
        <div style={{marginTop:13,fontSize:10,color:"rgba(255,255,255,.25)",letterSpacing:".5px"}}>🎧 Рекомендуются наушники</div>
      </div>
    </div>
  );}
  return(
    <div style={{padding:"50px 15px 20px",position:"relative",zIndex:1}}>
      <div style={{fontSize:18,fontWeight:200,letterSpacing:"0.15em",color:"#fff",marginBottom:14}}>МЕДИТАЦИИ</div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:7,marginBottom:14}}>{cats.map(c=><button key={c} onClick={()=>setCat(c)} style={pill(cat===c,LAV)}>{c}</button>)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {list.map(m=>{const locked=!m.free&&!pro;return(
          <button key={m.id} onClick={()=>locked?setShowPro(true):setSel(m.id)} style={{...card({padding:13,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:11})}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`${m.c}14`,border:`1px solid ${m.c}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.5" stroke={m.c} strokeWidth="1.2"/><circle cx="10" cy="10" r="6.5" stroke={m.c} strokeWidth=".7" strokeDasharray="2 2" opacity=".4"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13,color:"#fff"}}>{m.t}</span>{locked&&<LockIcon/>}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:2}}>{m.d}</div>
              <div style={{fontSize:10,color:m.c,marginTop:3}}>{m.cat} · {m.free||pro?m.f:m.s+" (пробная)"}</div>
            </div>
            <div style={{fontSize:15,color:"rgba(255,255,255,.18)"}}>›</div>
          </button>
        );})}
      </div>
    </div>
  );
}

function LibraryScreen({saved,setSaved}){
  return(
    <div style={{padding:"50px 15px 20px",position:"relative",zIndex:1}}>
      <div style={{fontSize:18,fontWeight:200,letterSpacing:"0.15em",color:"#fff",marginBottom:14}}>БИБЛИОТЕКА</div>
      {saved.length===0&&<div style={{...card({padding:30,textAlign:"center"})}}>
        <div style={{marginBottom:9,opacity:.4,display:"flex",justifyContent:"center"}}><TabIcon type="library" active={false}/></div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.35)"}}>Сохранённые миксы появятся здесь</div>
      </div>}
      {saved.map(mix=>(
        <div key={mix.id} style={{...card({padding:13,marginBottom:9})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:14,color:"#fff",marginBottom:3}}>{mix.name}</div>
              {mix.key&&<div style={{fontSize:9,color:SOL.find(s=>s.hz===mix.key)?.c||CYN,marginBottom:3,letterSpacing:1}}>{mix.key} Hz ✦</div>}
              <div style={{fontSize:10,color:CYN}}>{mix.layers?.length||0} слоёв · {mix.date}</div>
              {mix.names&&<div style={{fontSize:9,color:"rgba(255,255,255,.28)",marginTop:3}}>{mix.names?.slice(0,3).join(" + ")}{mix.names?.length>3?" ···":""}</div>}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button style={{...pill(false,MNT),fontSize:10}}>▶</button>
              <button onClick={()=>setSaved(p=>p.filter(m=>m.id!==mix.id))} style={{width:26,height:26,borderRadius:"50%",border:"none",background:"rgba(255,80,80,.12)",color:"rgba(255,120,120,.7)",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({pro,setPro,streak}){
  const [lang,setLang]=useState("RU");
  return(
    <div style={{padding:"50px 15px 20px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:22}}>
        <div style={{width:50,height:50,borderRadius:"50%",background:`${CYN}10`,border:`1.5px solid ${CYN}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><AionLogo size={30}/></div>
        <div><div style={{fontSize:16,fontWeight:200,letterSpacing:"0.15em",color:"#fff"}}>AION VI</div><div style={{fontSize:11,color:pro?CYN:"rgba(255,255,255,.35)"}}>{pro?"✦ Premium":"Бесплатный аккаунт"}</div></div>
      </div>
      <div style={{...card({padding:13,marginBottom:11,display:"flex",justifyContent:"space-between",alignItems:"center"})}}>
        <div><div style={{fontSize:13,color:"#fff"}}>Premium</div><div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>Всё открыто · 25 мин+ · ∞ слоёв</div></div>
        <div onClick={()=>setPro(p=>!p)} style={{width:44,height:24,borderRadius:12,background:pro?CYN:"rgba(255,255,255,.1)",cursor:"pointer",position:"relative",transition:"background .2s"}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:pro?22:2,transition:"left .2s"}}/>
        </div>
      </div>
      <div style={{...card({padding:13,marginBottom:11})}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em",marginBottom:9}}>СТАТИСТИКА</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["Серия",`${streak} дней`,CYN],["Сессий","24",LAV],["Часов","12.5",MNT],["Миксов","8",LIL]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:10,padding:"10px 11px"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:".5px"}}>{l}</div>
              <div style={{fontSize:18,fontWeight:200,color:c,marginTop:3}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{...card({padding:13,marginBottom:11})}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.2em",marginBottom:9}}>ЯЗЫК</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["EN","ES","DE","FR","ZH","JA","RU","UA"].map(l=><button key={l} onClick={()=>setLang(l)} style={pill(lang===l,CYN)}>{l}</button>)}</div>
      </div>
      <div style={{...card({padding:12,background:"rgba(128,222,234,0.05)",border:"1px solid rgba(128,222,234,0.18)"})}}>
        <div style={{fontSize:9,color:AQU,letterSpacing:"0.2em",marginBottom:3}}>ВАЖНО</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>Бинауральные ритмы не рекомендованы людям с эпилепсией. Используйте наушники.</div>
      </div>
    </div>
  );
}

function PremiumModal({onClose,onUpgrade}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300}}>
      <div style={{...card({padding:24,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:430}),background:"#08152A"}}>
        <div style={{textAlign:"center",marginBottom:18}}><AionLogo size={44} animated/><div style={{marginTop:11}}><AionWordmark size={18}/></div></div>
        {[[`∞ слоёв · все тональности`,CYN],[`Все инструменты и варианты`,LAV],[`Медитации 25 мин+`,MNT],[`Sleep Timer · 8 языков`,LIL]].map(([t,c])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
            <div style={{width:16,height:16,borderRadius:"50%",background:`${c}14`,border:`1px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:c,flexShrink:0}}>✓</div>
            <span style={{fontSize:12,color:"rgba(255,255,255,.75)"}}>{t}</span>
          </div>
        ))}
        <button onClick={onUpgrade} style={{width:"100%",padding:14,borderRadius:13,background:CYN,border:"none",color:"#000",fontSize:14,fontWeight:600,cursor:"pointer",letterSpacing:"0.1em",marginTop:10}}>АКТИВИРОВАТЬ PREMIUM ✦</button>
        <button onClick={onClose} style={{width:"100%",padding:10,borderRadius:13,background:"transparent",border:"none",color:"rgba(255,255,255,.35)",fontSize:12,cursor:"pointer",marginTop:5}}>Продолжить бесплатно</button>
      </div>
    </div>
  );
}

function ShareModal({onClose,layerIds}){
  const names=layerIds.map(id=>ALL_ITEMS[id]?.n||id);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:15}}>
      <div style={{...card({padding:18,width:"100%",maxWidth:340}),background:"#08152A"}}>
        <div style={{textAlign:"center",padding:20,background:BG,borderRadius:13,marginBottom:14}}>
          <AionLogo size={38}/><div style={{marginTop:9}}><AionWordmark size={15}/></div>
          <div style={{fontSize:9,color:CYN,marginTop:10,letterSpacing:"0.2em"}}>МОЯ МУЗЫКА ДУШИ</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:7,lineHeight:1.7}}>{names.slice(0,4).join(" · ")||"Персональный микс"}</div>
          <div style={{marginTop:11,display:"inline-block",padding:"4px 13px",background:`${CYN}0E`,borderRadius:7,border:`1px solid ${CYN}25`}}><div style={{fontSize:9,color:CYN,letterSpacing:1}}>aionvi.app</div></div>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.4)",textAlign:"center",marginBottom:13,letterSpacing:".5px"}}>ПОДЕЛИТЬСЯ В INSTAGRAM / TIKTOK</div>
        <button onClick={onClose} style={{width:"100%",padding:10,borderRadius:10,background:`${CYN}12`,border:`1px solid ${CYN}44`,color:CYN,fontSize:12,cursor:"pointer"}}>Скопировать карточку</button>
        <button onClick={onClose} style={{width:"100%",padding:8,borderRadius:10,background:"transparent",border:"none",color:"rgba(255,255,255,.3)",fontSize:11,cursor:"pointer",marginTop:5}}>Закрыть</button>
      </div>
    </div>
  );
}

function TabBar({tab,setTab,playing}){
  const tabs=[{id:"home",t:"home",l:"Главная"},{id:"studio",t:"studio",l:"Studio"},{id:"meditate",t:"meditate",l:"Медитации"},{id:"library",t:"library",l:"Библиотека"},{id:"profile",t:"profile",l:"Профиль"}];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(3,10,20,.97)",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-around",padding:"8px 0 14px",zIndex:50}}>
      {tabs.map(tb=>{const active=tab===tb.id;const pulse=tb.id==="studio"&&playing;return(
        <button key={tb.id} onClick={()=>setTab(tb.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"3px 8px",position:"relative"}}>
          <TabIcon type={tb.t} active={active}/>
          {pulse&&<div style={{position:"absolute",top:1,right:5,width:5,height:5,borderRadius:"50%",background:CYN}}/>}
          <div style={{fontSize:8,color:active?CYN:"rgba(255,255,255,.28)",letterSpacing:".5px",textTransform:"uppercase"}}>{tb.l}</div>
        </button>
      );})}
    </div>
  );
}

/* ── AUDIO ENGINE ── */
function makeNoise(ctx,kind){
  const sr=ctx.sampleRate,buf=ctx.createBuffer(2,sr*3,sr);
  for(let ch=0;ch<2;ch++){
    const d=buf.getChannelData(ch);let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(let i=0;i<d.length;i++){
      const w=Math.random()*2-1;
      if(kind==="pink"){b0=.99886*b0+w*.0555;b1=.99332*b1+w*.0751;b2=.969*b2+w*.1539;b3=.8665*b3+w*.3105;b4=.55*b4+w*.5330;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.09;b5=w*.0169;b6=w*.1159;}
      else d[i]=w*.06;
    }
    if(kind==="ocean"||kind==="rain")for(let i=0;i<d.length;i++)d[i]*=.5+.5*Math.sin(2*Math.PI*(kind==="rain"?.15:.07)*i/sr);
    if(kind==="forest")for(let i=0;i<d.length;i++)d[i]*=.5+.5*Math.sin(2*Math.PI*.03*i/sr);
  }
  return buf;
}

/* ── MAIN ── */
export default function AionVi(){
  const [splash,setSplash]=useState(true);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [tab,setTab]=useState("home");
  const [pro,setPro]=useState(false);
  const [mood,setMood]=useState(null);
  const [layers,setLayers]=useState({});
  const [playing,setPlaying]=useState(false);
  const [sTime,setSTime]=useState(0);
  const [saved,setSaved]=useState([{id:1,name:"Вечерняя медитация",layers:["theta","bo_432","ocean"],names:["Theta","Чаша 432","Океан"],key:432,date:"17.05"}]);
  const [showPro,setShowPro]=useState(false);
  const [showShare,setShowShare]=useState(false);
  const [showSavePrompt,setShowSavePrompt]=useState(false);
  const [selectedKey,setSelectedKey]=useState(null);
  const [sleepSec,setSleepSec]=useState(0);
  const [sleepActive,setSleepActive]=useState(false);
  const actx=useRef(null),nodes=useRef({});
  const timerRef=useRef(null),sleepRef=useRef(null);

  useEffect(()=>{if(playing){timerRef.current=setInterval(()=>setSTime(t=>t+1),1000);}else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[playing]);

  useEffect(()=>{
    if(sleepActive&&sleepSec>0){
      sleepRef.current=setInterval(()=>{
        setSleepSec(s=>{
          if(s<=1){setSleepActive(false);setTimeout(()=>doStop(false),0);return 0;}
          // Fade out in last 30s
          if(s<=30&&actx.current){Object.values(nodes.current).forEach(n=>{if(n?.gain)n.gain.gain.value=Math.max(0,(s/30)*.5);});}
          return s-1;
        });
      },1000);
    }else clearInterval(sleepRef.current);
    return()=>clearInterval(sleepRef.current);
  },[sleepActive]);

  const getCtx=()=>{if(!actx.current)actx.current=new(window.AudioContext||window.webkitAudioContext)();if(actx.current.state==="suspended")actx.current.resume();return actx.current;};

  const startNode=(id,item,vol)=>{
    const ctx=getCtx();const g=ctx.createGain();g.gain.value=vol||.5;g.connect(ctx.destination);
    const t=item.type,hz=item.hz||432;
    if(t==="binaural"){const base=selectedKey||180,beat=item.bHz||6;const pL=ctx.createStereoPanner(),pR=ctx.createStereoPanner();pL.pan.value=-1;pR.pan.value=1;const oL=ctx.createOscillator(),oR=ctx.createOscillator();oL.frequency.value=base;oR.frequency.value=base+beat;oL.connect(pL);oR.connect(pR);pL.connect(g);pR.connect(g);oL.start();oR.start();nodes.current[id]={oL,oR,pL,pR,gain:g};}
    else if(t==="nature"){const src=ctx.createBufferSource();src.buffer=makeNoise(ctx,id);src.loop=true;src.connect(g);src.start();nodes.current[id]={src,gain:g};}
    else if(t==="track"){nodes.current[id]={gain:g,type:"placeholder"};}
    else if(t==="bowl"||t==="crystal"){const play=()=>{const now=ctx.currentTime;[1,2.756,5.404].forEach((r,i)=>{if(hz*r>18000)return;const o=ctx.createOscillator(),eg=ctx.createGain();o.type="sine";o.frequency.value=hz*r;const v=(nodes.current[id]?.gainVal||.5)*[.4,.2,.1][i];eg.gain.setValueAtTime(v,now);eg.gain.exponentialRampToValueAtTime(.0001,now+9);o.connect(eg);eg.connect(ctx.destination);o.start(now);o.stop(now+9.1);});};play();const tid=setInterval(play,12000);nodes.current[id]={tid,gainVal:vol||.5,gain:g,type:"interval"};}
    else if(t==="vargan"){const oscs=[];[1,2,3,4].forEach(n=>{if(hz*n>16000)return;const o=ctx.createOscillator(),eg=ctx.createGain();o.type=n===1?"sawtooth":"sine";o.frequency.value=hz*n;eg.gain.value=(vol||.5)/n*.22;o.connect(eg);eg.connect(g);o.start();oscs.push({o,eg});});nodes.current[id]={oscs,gain:g};}
    else if(t==="handpan"){const play=()=>{const now=ctx.currentTime;[[1,.33],[1.5,.14],[2,.09],[2.756,.06]].forEach(([r,a])=>{if(hz*r>14000)return;const o=ctx.createOscillator(),eg=ctx.createGain();o.type="sine";o.frequency.value=hz*r;const v=(nodes.current[id]?.gainVal||.5)*a;eg.gain.setValueAtTime(v,now);eg.gain.exponentialRampToValueAtTime(.0001,now+3.5);o.connect(eg);eg.connect(ctx.destination);o.start(now);o.stop(now+3.6);});};play();const tid=setInterval(play,4000+Math.random()*2000);nodes.current[id]={tid,gainVal:vol||.5,gain:g,type:"interval"};}
    else if(t==="panflute"){const o=ctx.createOscillator(),vib=ctx.createOscillator(),vg=ctx.createGain();o.type="sine";o.frequency.value=hz;vib.frequency.value=5;vg.gain.value=3;vib.connect(vg);vg.connect(o.frequency);o.connect(g);o.start();vib.start();nodes.current[id]={o,vib,vg,gain:g};}
    else if(t==="drum"){const play=()=>{const now=ctx.currentTime;const o=ctx.createOscillator(),eg=ctx.createGain();o.type="sine";o.frequency.value=hz*.4;const v=nodes.current[id]?.gainVal||.5;eg.gain.setValueAtTime(v,now);eg.gain.exponentialRampToValueAtTime(.0001,now+.5);o.connect(eg);eg.connect(ctx.destination);o.start(now);o.stop(now+.6);const buf=ctx.createBuffer(1,ctx.sampleRate*.12,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*.025));const src=ctx.createBufferSource();src.buffer=buf;const ng=ctx.createGain();ng.gain.value=v*.7;src.connect(ng);ng.connect(ctx.destination);src.start(now);};play();const tid=setInterval(play,1100+Math.random()*500);nodes.current[id]={tid,gainVal:vol||.5,gain:g,type:"interval"};}
    else if(t==="gong"){const play=()=>{const now=ctx.currentTime;[[1,.43],[1.41,.17],[2,.11],[2.756,.07]].forEach(([r,a])=>{if(hz*r>16000)return;const o=ctx.createOscillator(),eg=ctx.createGain();o.type="sine";o.frequency.value=hz*r;const v=(nodes.current[id]?.gainVal||.5)*a;eg.gain.setValueAtTime(0,now);eg.gain.linearRampToValueAtTime(v,now+.1);eg.gain.exponentialRampToValueAtTime(.0001,now+14);o.connect(eg);eg.connect(ctx.destination);o.start(now);o.stop(now+14.1);});};play();const tid=setInterval(play,18000);nodes.current[id]={tid,gainVal:vol||.5,gain:g,type:"interval"};}
    else if(t==="kalimba"){const play=()=>{const now=ctx.currentTime;[1,2,3].forEach((n,i)=>{if(hz*n>14000)return;const o=ctx.createOscillator(),eg=ctx.createGain();o.type="sine";o.frequency.value=hz*n;const v=(nodes.current[id]?.gainVal||.5)*[.33,.13,.07][i];eg.gain.setValueAtTime(v,now+i*.02);eg.gain.exponentialRampToValueAtTime(.0001,now+1.8);o.connect(eg);eg.connect(ctx.destination);o.start(now+i*.02);o.stop(now+1.9);});};play();const tid=setInterval(play,2800+Math.random()*1400);nodes.current[id]={tid,gainVal:vol||.5,gain:g,type:"interval"};}
  };

  const stopNode=id=>{const n=nodes.current[id];if(!n)return;if(n.tid)clearInterval(n.tid);if(n.oscs)n.oscs.forEach(({o,eg})=>{try{o.stop();o.disconnect();eg.disconnect();}catch(e){}});["oL","oR","o","vib","src"].forEach(k=>{try{n[k]?.stop();n[k]?.disconnect();}catch(e){}});["pL","pR","vg","gain"].forEach(k=>{try{n[k]?.disconnect();}catch(e){}});delete nodes.current[id];};

  const freeLimit=2,activeCount=Object.keys(layers).length;

  const toggleLayer=(id,_free,item)=>{
    if(layers[id]){stopNode(id);setLayers(p=>{const n={...p};delete n[id];return n;});if(Object.keys(layers).length===1){setPlaying(false);setSTime(0);}}
    else{if(item)startNode(id,item,.5);setLayers(p=>({...p,[id]:{vol:.5}}));setPlaying(true);}
  };

  const updateVol=(id,vol)=>{setLayers(p=>({...p,[id]:{vol}}));const n=nodes.current[id];if(n?.gain)n.gain.gain.value=vol;if(n?.gainVal!==undefined)n.gainVal=vol;};

  const doStop=(withPrompt=true)=>{
    if(withPrompt&&activeCount>0){setShowSavePrompt(true);return;}
    Object.keys(nodes.current).forEach(stopNode);setLayers({});setPlaying(false);setSTime(0);setSleepActive(false);setSleepSec(0);setShowSavePrompt(false);
  };

  const saveMix=()=>{
    const lkeys=Object.keys(layers);if(!lkeys.length)return;
    const names=lkeys.map(k=>ALL_ITEMS[k]?.n||k);
    setSaved(p=>[{id:Date.now(),name:`Микс ${p.length+1}`,layers:lkeys,names,key:selectedKey,date:new Date().toLocaleDateString("ru-RU",{day:"2-digit",month:"2-digit"})},...p]);
  };

  if(splash)return <div style={{background:BG,minHeight:"100vh",fontFamily:"-apple-system,sans-serif"}}><Splash onDone={()=>{setSplash(false);setShowOnboarding(true);}}/></div>;
  if(showOnboarding)return <Onboarding onDone={()=>setShowOnboarding(false)}/>;

  return(
    <div style={{background:BG,minHeight:"100vh",color:"#fff",fontFamily:"-apple-system,sans-serif",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden"}}>
      <FogBackground/>
      <div style={{paddingBottom:80}}>
        {tab==="home"&&<HomeScreen pro={pro} mood={mood} setMood={setMood} streak={7} setTab={setTab}/>}
        {tab==="studio"&&<StudioScreen pro={pro} layers={layers} toggleLayer={toggleLayer} updateVol={updateVol} playing={playing} sTime={sTime} onStop={doStop} saveMix={saveMix} setShowPro={setShowPro} setShowShare={setShowShare} activeCount={activeCount} freeLimit={freeLimit} selectedKey={selectedKey} setSelectedKey={setSelectedKey} sleepSec={sleepSec} setSleepSec={setSleepSec} sleepActive={sleepActive} setSleepActive={setSleepActive}/>}
        {tab==="meditate"&&<MeditateScreen pro={pro} setShowPro={setShowPro}/>}
        {tab==="library"&&<LibraryScreen saved={saved} setSaved={setSaved}/>}
        {tab==="profile"&&<ProfileScreen pro={pro} setPro={setPro} streak={7}/>}
      </div>
      <TabBar tab={tab} setTab={setTab} playing={playing}/>
      {showPro&&<PremiumModal onClose={()=>setShowPro(false)} onUpgrade={()=>{setPro(true);setShowPro(false);}}/>}
      {showShare&&<ShareModal onClose={()=>setShowShare(false)} layerIds={Object.keys(layers)}/>}
      {showSavePrompt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}>
          <div style={{...card({padding:24,width:"100%",maxWidth:320}),background:"#08152A"}}>
            <div style={{fontSize:15,color:"#fff",marginBottom:6}}>Сохранить микс?</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginBottom:20,lineHeight:1.75}}>
              {activeCount} слоёв{selectedKey?` · ${selectedKey} Hz`:""}<br/>Сохрани, чтобы вернуться к этому миксу позже.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button onClick={()=>{saveMix();doStop(false);}} style={{padding:"12px 0",borderRadius:12,background:`${MNT}18`,border:`1px solid ${MNT}44`,color:MNT,fontSize:13,cursor:"pointer"}}>Сохранить и остановить</button>
              <button onClick={()=>doStop(false)} style={{padding:"12px 0",borderRadius:12,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.6)",fontSize:13,cursor:"pointer"}}>Остановить без сохранения</button>
              <button onClick={()=>setShowSavePrompt(false)} style={{padding:"10px 0",borderRadius:12,background:"transparent",border:"none",color:"rgba(255,255,255,.3)",fontSize:12,cursor:"pointer"}}>Продолжить слушать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
