import{b as K,a as H,r as c,j as t}from"./index-BFCOF11Z.js";const G="/api/stripe/create-intent",q="/api/stripe/config",X="/api/report/save",D="/report";function Z(){const $=K(),[S]=H(),[l,I]=c.useState("buyer@omniora13.com"),[P,N]=c.useState(""),[v,b]=c.useState(""),[E,p]=c.useState("loading…"),[C,u]=c.useState(!0),[B,A]=c.useState(899),U=c.useRef(null),L=c.useRef(null),g=c.useRef(""),k=R(),O=k.name?k.name.trim():"",_=k.persona||"";c.useEffect(()=>{const e=setInterval(()=>{A(r=>r>0?r-1:0)},1e3);return()=>clearInterval(e)},[]);const F=e=>{const r=Math.floor(e/60),n=e%60;return`${r.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`};c.useEffect(()=>{let e="buyer@omniora13.com";try{e=localStorage.getItem("omniora:email")||"buyer@omniora13.com"}catch{}const r=S.get("email")||e;return I(r),x(r),()=>{window.__payInitLock=!1}},[S]);function w(){const e=S.get("ref")||"";return String(e).slice(0,40)}function R(){var e,r,n,o,a;try{const s=JSON.parse(localStorage.getItem("omniora:payload")||"{}");return{name:((e=s.form)==null?void 0:e.name)||"",gender:((r=s.form)==null?void 0:r.gender)||"",dob:((n=s.form)==null?void 0:n.dob)||"",tob:((o=s.form)==null?void 0:o.tob)||"",address:((a=s.form)==null?void 0:a.address)||"",persona:s.persona||"",tri:s.tri||null,early:s.early||null,mid:s.mid||null,late:s.late||null,codes:s.codes||null}}catch{return{}}}function J(e,r){const n=new URL("/report-print.html",window.location.origin);e&&n.searchParams.set("orderID",e),r&&n.searchParams.set("email",r);const o=w();return o&&n.searchParams.set("ref",o),n.pathname+n.search}async function z(e,r=800){var n;try{if(!e)return"";if(typeof e=="string"&&e.startsWith("data:image/png"))return e;let o="";if(typeof e=="string"&&e.trim().startsWith("<svg")){const h=new Blob([e],{type:"image/svg+xml"});o=URL.createObjectURL(h)}else if(typeof e=="string"&&e.startsWith("data:image/svg+xml"))o=e;else if(typeof e=="string"&&e.startsWith("http"))o=e;else return"";const a=new Image;a.crossOrigin="anonymous",await new Promise((h,m)=>{a.onload=h,a.onerror=m,a.src=o});const s=a.height/Math.max(1,a.width),i=r,f=Math.max(1,Math.round(i*s)),d=document.createElement("canvas");d.width=i,d.height=f,(n=d.getContext("2d"))==null||n.drawImage(a,0,0,i,f);try{o.startsWith("blob:")&&URL.revokeObjectURL(o)}catch{}return d.toDataURL("image/png")}catch{return""}}async function W(){window.Stripe||await new Promise((e,r)=>{const n=document.createElement("script");n.src="https://js.stripe.com/v3",n.async=!0,n.crossOrigin="anonymous",n.onload=()=>e(),n.onerror=()=>r(new Error("Stripe.js load failed")),document.head.appendChild(n)})}function j(e,r){console.warn("[stripe:init] ",e),N(e+'  Click "Re-initialize" to retry.'),u(!1),p("pay now");const n=document.getElementById("retry");n&&(n.onclick=r)}async function x(e,r=!1){if(!(window.__payInitLock&&!r)){window.__payInitLock=!0,N("Initializing Stripe…"),b(""),u(!0),p("loading…");try{await W();const n=await fetch(q),o=await n.text();let a;try{a=JSON.parse(o)}catch{}if(!n.ok||!(a!=null&&a.publishableKey))return j("Stripe config error: "+o,()=>x(e,!0));const s=window.Stripe(a.publishableKey);L.current=s,console.log("[stripe] pk ok");const i=R(),f={email:e,fname:"",lname:"",addr1:"",city:"",state:"",zip:"",country:"US"},d=await fetch(G,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:"",metadata:{name:i.name||"",gender:i.gender||"",dob:i.dob||"",tob:i.tob||"",persona:i.persona||"",ref:w(),...f}})}),h=await d.text();let m;try{m=JSON.parse(h)}catch{}if(!d.ok||!(m!=null&&m.clientSecret))return j("Create intent failed: "+h,()=>x(e,!0));const Y=m.clientSecret;g.current=m.id,console.log("[stripe] intent ok",m.id);try{const y=s.elements({clientSecret:Y,locale:"en"});U.current=y;const V=y.create("payment",{fields:{billingDetails:{address:"never"}}}),T=document.getElementById("payment-element-mount");T&&(T.innerHTML="",V.mount("#payment-element-mount")),console.log("[stripe] element mounted"),N(""),u(!1),p("pay now")}catch(y){return j("Mount payment element error: "+(y.message||y),()=>x(e,!0))}}catch(n){j("Init failed: "+((n==null?void 0:n.message)||n),()=>x(e,!0))}finally{window.__payInitLock=!1}}}const M=async()=>{if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.trim())){alert("Please provide a valid email address.");return}u(!0),p("Please wait patiently while the page is redirecting..."),b("");try{const e=w();let r=`${window.location.origin}${D}?orderID=${encodeURIComponent(g.current)}&email=${encodeURIComponent(l)}`;e&&(r+=`&ref=${encodeURIComponent(e)}`);const{error:n}=await L.current.confirmPayment({elements:U.current,confirmParams:{return_url:r,receipt_email:l,payment_method_data:{billing_details:{email:l,address:{line1:"123 Main Street",city:"New York",state:"NY",postal_code:"10001",country:"US"}}}},redirect:"if_required"});if(n){console.warn("[stripe] confirm error:",n.message),b(n.message||"Payment confirmation failed"),u(!1),p("pay now");return}try{const a=R();let s=localStorage.getItem("omniora:trianglePng")||"";if(!s||!s.startsWith("data:image/png")){const d=localStorage.getItem("omniora:triangle")||"";s=await z(d),s&&localStorage.setItem("omniora:trianglePng",s)}const i=J(g.current,l),f=w();await fetch(X,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:g.current,email:l,url:i,name:a.name,gender:a.gender,dob:a.dob,tob:a.tob,address:a.address||"",persona:a.persona||a.tri&&a.tri.O,tri:a.tri,early:a.early,mid:a.mid,late:a.late,codes:a.codes,ref:f,trianglePng:s})})}catch(a){console.warn("[report/save] warn:",a)}let o=`${D}?orderID=${encodeURIComponent(g.current)}&email=${encodeURIComponent(l)}`;e&&(o+=`&ref=${encodeURIComponent(e)}`),$(o)}catch(e){console.error("[stripe] click exception:",e),b(e.message||String(e)),u(!1),p("pay now")}};return t.jsxs("div",{className:"min-h-screen bg-black text-[#f3f3f1] font-sans overflow-y-auto py-20 px-6",children:[t.jsx("style",{children:`
        .checkout-wrap { max-width: 760px; margin: 0 auto; }
        .checkout-card {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 24px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
          max-width: 500px;
          margin: 0 auto;
        }
        .checkout-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          margin: 8px 0;
        }
        .checkout-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #b8b8b8;
        }
        .checkout-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #1f1f22;
          background: #060608;
          color: #fff;
          border-radius: 12px;
          outline: none;
          font-family: 'Inter', sans-serif;
        }
        .checkout-input:focus {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.05);
        }
        .checkout-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: #b8b8b8;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          margin-top: 14px;
        }
        .checkout-btn-ghost:hover {
          border-color: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
        .checkout-foot {
          margin-top: 16px;
          color: #b8b8b8;
          font-size: 12px;
          line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 16px;
        }
      `}),t.jsxs("div",{className:"checkout-wrap",children:[t.jsx("h1",{className:"font-serif text-center mb-2 text-2xl md:text-3xl tracking-wide text-shadow uppercase",children:O?`✦ RESERVED FOR ${O}: YOUR DESTINY MAP ✦`:"Complete Your Purchase"}),t.jsxs("p",{className:"text-center text-xs text-[#a1a1aa] font-mono mb-6 tracking-wider",children:["⏱️ SPECIAL RESERVED PRICE EXPIRES IN ",t.jsx("span",{className:"text-white font-bold",children:F(B)})]}),t.jsxs("div",{className:"checkout-card",children:[t.jsxs("div",{className:"grid gap-3",children:[t.jsxs("div",{className:"flex justify-between items-center mb-1",children:[t.jsxs("div",{children:[t.jsx("span",{className:"text-sm font-semibold text-white block",children:"OMNIORA Detailed Report"}),_&&t.jsxs("span",{className:"text-[11px] text-[#a1a1aa] font-mono",children:["Calibrated Code ",_," • 4-Page Print Blueprint"]})]}),t.jsxs("div",{className:"text-right",children:[t.jsxs("span",{className:"text-lg font-bold text-white block",children:["$19.90"," ",t.jsx("span",{className:"text-xs text-decoration-line-through text-[#b8b8b8] font-normal ml-1",children:"$59.90"})]}),t.jsx("span",{className:"text-[10px] text-[#4ade80] font-mono uppercase tracking-wider",children:"70% OFF RESERVED"})]})]}),t.jsx("div",{className:"checkout-divider"}),t.jsxs("div",{className:"space-y-2.5 my-1 text-xs",children:[t.jsxs("div",{className:"flex items-start gap-2 text-neutral-300",children:[t.jsx("span",{className:"text-emerald-400 font-bold",children:"✓"}),t.jsx("span",{children:"Full 4-Page Pythagorean Vector Analysis & Core Archetype"})]}),t.jsxs("div",{className:"flex items-start gap-2 text-neutral-300",children:[t.jsx("span",{className:"text-emerald-400 font-bold",children:"✓"}),t.jsx("span",{children:"Early (0-27), Mid (28-54) & Late Cycle (55+) Code Breakdown"})]}),t.jsxs("div",{className:"flex items-start gap-2 text-neutral-300",children:[t.jsx("span",{className:"text-emerald-400 font-bold",children:"✓"}),t.jsx("span",{children:"Active Shadow Loops, Karmic Patterns & Medicine Practices"})]}),t.jsxs("div",{className:"flex items-start gap-2 text-neutral-300",children:[t.jsx("span",{className:"text-emerald-400 font-bold",children:"✓"}),t.jsx("span",{children:"Instant Online Blueprint Access & High-Res PDF Print Download"})]})]}),t.jsx("input",{type:"hidden",value:l,onChange:e=>I(e.target.value)})]}),t.jsx("div",{className:"checkout-divider"}),t.jsxs("div",{className:"grid gap-2 mt-2",children:[t.jsx("div",{className:"marks",id:"paypal-marks"}),t.jsxs("div",{className:"grid gap-3",children:[t.jsx("div",{id:"payment-element-mount"}),t.jsx("button",{id:"stripe-pay-btn",type:"button",disabled:C,onClick:M,style:{width:"100%",padding:"14px 16px",borderRadius:"12px",border:"1px solid #2a2a2a",background:"#0e0e10",color:"#fff",fontWeight:600,fontSize:"14px",letterSpacing:"0.05em",cursor:C?"not-allowed":"pointer"},children:E==="pay now"?"UNLOCK MY FULL BLUEPRINT — $19.90":E})]}),P&&t.jsx("div",{className:"text-xs text-[#b8b8b8] opacity-90 mt-2 text-center",children:P}),v&&t.jsx("div",{id:"payError",className:"p-3 bg-[#2a1a1a] border border-[#5b2f2f] text-[#ff8a8a] rounded-xl text-xs mt-3 leading-relaxed",children:v}),t.jsx("button",{id:"retry",className:"checkout-btn-ghost",type:"button",onClick:()=>x(l,!0),children:"🔄 Re-initialize"})]}),t.jsxs("div",{className:"checkout-foot text-neutral-400 text-center",children:[t.jsxs("div",{className:"flex items-center justify-center gap-3 text-[11px] text-neutral-400 mb-2 font-mono",children:[t.jsx("span",{children:"🔒 256-Bit Encrypted"}),t.jsx("span",{children:"•"}),t.jsx("span",{children:"🛡️ 30-Day Guarantee"}),t.jsx("span",{children:"•"}),t.jsx("span",{children:"⚡ Instant Delivery"})]}),"We use Stripe for secure payments. After your purchase, you can view your report immediately and download the PDF. Having trouble? Please contact support."]})]})]})]})}export{Z as default};
