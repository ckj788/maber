import{a as U,r as n,j as e,L as z}from"./index--wDjqjv1.js";function $(){const[m]=U(),[u,C]=n.useState(""),[g,D]=n.useState(""),[E,y]=n.useState(""),[L,w]=n.useState(!1),[v,M]=n.useState(""),[O,j]=n.useState(!0),k=n.useRef(null);n.useEffect(()=>{let d="",c="";try{d=localStorage.getItem("omniora:orderId")||"",c=localStorage.getItem("omniora:email")||""}catch{}const s=m.get("orderID")||d,t=m.get("email")||c;C(s),D(t);const p=new URL("/report-print.html",window.location.origin);s&&p.searchParams.set("orderID",s),t&&p.searchParams.set("email",t);const N=m.get("ref");N&&p.searchParams.set("ref",N);const A=p.pathname+p.search;M(A),t&&t!=="buyer@omniora13.com"?(y(`A link to your report has been emailed to: ${t}.<br><br><em>If you do not see the email in your inbox, please check your <strong>spam or junk folder</strong>.</em>`),w(!0)):(y("You can view your report immediately. Make sure to bookmark this page."),w(!1)),j(!s);const o=k.current;if(o){const i=o.getContext("2d");if(i){let h=o.width=window.innerWidth*Math.min(window.devicePixelRatio||1,2),x=o.height=window.innerHeight*Math.min(window.devicePixelRatio||1,2);o.style.width=window.innerWidth+"px",o.style.height=window.innerHeight+"px";const I=[],H=120,a=(r,f)=>r+Math.random()*(f-r);for(let r=0;r<H;r++)I.push({x:a(0,h),y:a(-x*.2,x*.2),vx:a(-.6,.6),vy:a(1.2,2.6),r:a(1,3),a:a(.4,.9)});let b;const P=()=>{i.clearRect(0,0,h,x);for(const r of I){r.x+=r.vx,r.y+=r.vy,r.vy+=.008,r.y>x&&(r.y=a(-80,-10),r.x=a(0,h),r.vy=a(1.2,2.6)),i.globalAlpha=r.a;const f=["#fff","#c8ffe2","#ffd6e7","#e0d6ff","#f7ffd1"];i.fillStyle=f[(r.r|0)%f.length],i.beginPath(),i.arc(r.x,r.y,r.r*Math.min(window.devicePixelRatio||1,2),0,Math.PI*2),i.fill()}i.globalAlpha=1,b=requestAnimationFrame(P)};P();const R=()=>{h=o.width=window.innerWidth*Math.min(window.devicePixelRatio||1,2),x=o.height=window.innerHeight*Math.min(window.devicePixelRatio||1,2),o.style.width=window.innerWidth+"px",o.style.height=window.innerHeight+"px"};window.addEventListener("resize",R);const F=setTimeout(()=>{cancelAnimationFrame(b),o.remove()},4e3);return()=>{cancelAnimationFrame(b),window.removeEventListener("resize",R),clearTimeout(F)}}}},[m]);function l(d,c=!1,s=2500){const t=document.createElement("div");t.textContent=d,t.style.cssText=`
      position:fixed; left:50%; top:24px; transform:translateX(-50%);
      background:${c?"#2a0000":"#0f2716"}; color:${c?"#ff9292":"#caffd8"};
      border:1px solid ${c?"#5b1f1f":"#2f7a46"}; padding:10px 14px; border-radius:12px; z-index:20;
      box-shadow:0 10px 30px rgba(0,0,0,.45); font-size:14px; letter-spacing:.01em`,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",t.style.transition="opacity .35s"},s),setTimeout(()=>t.remove(),s+500)}const S=async()=>{try{const d=window.location.origin+v;await navigator.clipboard.writeText(d),l("Report link copied")}catch{l("Copy failed",!0)}},T=async()=>{try{await navigator.clipboard.writeText(u),l("Order ID copied")}catch{l("Copy failed",!0)}},B=async()=>{try{await navigator.clipboard.writeText(g),l("Email copied")}catch{l("Copy failed",!0)}};return e.jsxs("div",{className:"min-h-screen bg-[#000000] text-[#f3f3f1] font-sans py-20 px-6 overflow-y-auto",children:[e.jsx("canvas",{ref:k,id:"confetti",className:"fixed inset-0 pointer-events-none z-5"}),e.jsx("style",{children:`
        .report-wrap { max-width: 960px; margin: 0 auto; display: grid; gap: 20px; }
        .report-hero {
          display: grid; gap: 14px; justify-items: center; text-align: center;
          padding: 26px 20px 8px;
        }
        .report-title {
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(28px, 4.2vw, 42px); margin: 0; line-height: 1.18; letter-spacing: .02em;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
        .report-sub { font-family: 'JetBrains Mono', monospace; color: #b8b8b8; font-size: 14px; }
        .report-cards { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; }
        @media (max-width: 900px) { .report-cards { grid-template-columns: 1fr; } }
        
        .report-card-box {
          padding: 24px; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px;
          background: linear-gradient(180deg, rgba(255, 255, 255, .03), rgba(255, 255, 255, 0));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }
        
        .report-success {
          display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px;
          border-radius: 999px; background: rgba(158, 247, 177, 0.12); color: #c7ffda; border: 1px solid rgba(158, 247, 177, 0.35);
          font-size: 13px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px;
        }
        .report-success-dot { width: 10px; height: 10px; border-radius: 50%; background: #9ef7b1; box-shadow: 0 0 16px rgba(158, 247, 177, 0.8); }
        
        .report-kv { display: grid; gap: 10px; margin-top: 8px; }
        .report-kv-row {
          display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.08); border-radius: 12px;
        }
        .report-kv-label { color: #b8b8b8; font-size: 12px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        
        .report-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px 16px; border-radius: 12px; text-decoration: none; cursor: pointer; user-select: none;
          border: 1px solid #1f1f22; background: #fff; color: #000; font-weight: 600;
          transition: opacity .2s, background .2s, transform 0.1s;
        }
        .report-btn.secondary { background: rgba(255, 255, 255, 0.02); color: #f3f3f1; border-color: rgba(255, 255, 255, 0.1); }
        .report-btn.secondary:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.2); }
        .report-btn.ghost { background: transparent; color: #b8b8b8; border-color: rgba(255, 255, 255, 0.05); }
        .report-btn.ghost:hover { color: #fff; border-color: rgba(255, 255, 255, 0.2); }
        .report-btn.full { width: 100%; }
        .report-btn.icon { padding: 10px 12px; border-radius: 10px; }
        .report-btn.xl { font-size: 16px; padding: 16px 22px; border-radius: 14px; }
        .report-btn:active { transform: translateY(1px); }
        .report-btn.disabled { opacity: .5; pointer-events: none; background: #333; border-color: #222; color: #888; }
        
        .report-hint { color: #b8b8b8; font-size: 13px; }
        .report-actions { display: grid; gap: 12px; }
        .report-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent); margin: 14px 0; }
        .report-badge {
          display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-family: 'JetBrains Mono', monospace;
          padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.1); color: #b8b8b8;
        }
        .report-footer {
          opacity: .8; text-align: center; font-size: 12px; color: #b8b8b8; margin-top: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
      `}),e.jsxs("div",{className:"report-wrap",children:[e.jsxs("div",{className:"report-hero",children:[e.jsxs("span",{className:"report-success",children:[e.jsx("span",{className:"report-success-dot"})," Payment successful"]}),e.jsx("h1",{className:"report-title",children:"Your detailed report is ready"}),e.jsx("p",{className:"report-sub",id:"subcopy",children:"Your personalized blueprint has been successfully generated."}),L&&e.jsxs("div",{className:"report-badge",children:["Email target: ",g]})]}),e.jsxs("div",{className:"report-cards",children:[e.jsxs("section",{className:"report-card-box",children:[e.jsx("h3",{style:{margin:"0 0 10px"},className:"text-lg font-serif",children:"Access Report"}),e.jsx("p",{className:"report-hint",dangerouslySetInnerHTML:{__html:E}}),e.jsxs("div",{className:"report-actions",style:{margin:"12px 0 6px"},children:[e.jsx("a",{id:"previewBtn",className:`report-btn xl full ${O?"disabled":""}`,href:v,target:"_blank",rel:"noopener noreferrer",children:"👀 View Full Report"}),e.jsx("button",{id:"copyLink",className:"report-btn secondary",onClick:S,children:"🔗 Copy Report Link"})]}),e.jsx("p",{className:"report-hint",style:{margin:"4px 0 0"},children:"Open the report to read your reading and download your high-contrast PDF."}),e.jsx("div",{className:"report-divider"}),e.jsxs("div",{className:"report-kv",children:[e.jsxs("div",{className:"report-kv-row",children:[e.jsxs("div",{children:[e.jsx("div",{className:"report-kv-label",children:"Order ID"}),e.jsx("div",{className:"font-mono text-white",style:{fontSize:"13px"},children:u||"—"})]}),e.jsx("button",{id:"copyOID",className:"report-btn icon ghost",title:"Copy Order ID",onClick:T,children:"📋"})]}),e.jsxs("div",{className:"report-kv-row",style:{display:"none"},children:[e.jsxs("div",{children:[e.jsx("div",{className:"report-kv-label",children:"Email"}),e.jsx("div",{className:"font-mono text-white",style:{fontSize:"13px"},children:g||"—"})]}),e.jsx("button",{id:"copyEmail",className:"report-btn icon ghost",title:"Copy email",onClick:B,children:"📋"})]})]}),e.jsxs("p",{className:"text-xs text-neutral-500 leading-relaxed",style:{marginTop:"12px"},children:["Please bookmark this page or copy the report link to access it later. Need help? Please"," ",e.jsx(z,{to:"/contact",style:{textDecoration:"underline"},className:"hover:text-white transition-colors",children:"contact us"})," ","with your Order ID."]})]}),e.jsxs("aside",{className:"report-card-box",style:{display:"grid",gap:"10px",alignContent:"start"},children:[e.jsx("h3",{style:{margin:"0 0 6px"},className:"text-lg font-serif",children:"Next steps"}),e.jsx(z,{className:"report-btn secondary full",to:"/",children:"🏠 Back to Home"}),e.jsx("div",{className:"report-divider"}),e.jsx("p",{className:"report-hint leading-relaxed",children:"Open your report online to view your interactive reading and download the high-contrast PDF. If you do not see the email, please check your spam folder."})]})]}),e.jsx("div",{className:"report-footer",children:"© 2025 OMNIORA"})]})]})}export{$ as default};
