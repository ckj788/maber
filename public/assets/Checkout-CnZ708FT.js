import{b as z,a as W,r as p,j as a}from"./index-FOzBzI_E.js";const F="/api/stripe/create-intent",H="/api/stripe/config",K="/api/report/save",E="/report";function q(){const O=z(),[S]=W(),[c,R]=p.useState("buyer@omniora13.com"),[j,I]=p.useState(""),[N,y]=p.useState(""),[T,m]=p.useState("loading…"),[v,u]=p.useState(!0),P=p.useRef(null),C=p.useRef(null),x=p.useRef("");p.useEffect(()=>{let e="buyer@omniora13.com";try{e=localStorage.getItem("omniora:email")||"buyer@omniora13.com"}catch{}const o=S.get("email")||e;return R(o),f(o),()=>{window.__payInitLock=!1}},[S]);function w(){const e=S.get("ref")||"";return String(e).slice(0,40)}function U(){var e,o,t,s,r;try{const n=JSON.parse(localStorage.getItem("omniora:payload")||"{}");return{name:((e=n.form)==null?void 0:e.name)||"",gender:((o=n.form)==null?void 0:o.gender)||"",dob:((t=n.form)==null?void 0:t.dob)||"",tob:((s=n.form)==null?void 0:s.tob)||"",address:((r=n.form)==null?void 0:r.address)||"",persona:n.persona||"",tri:n.tri||null,early:n.early||null,mid:n.mid||null,late:n.late||null,codes:n.codes||null}}catch{return{}}}function L(e,o){const t=new URL("/report-print.html",window.location.origin);e&&t.searchParams.set("orderID",e),o&&t.searchParams.set("email",o);const s=w();return s&&t.searchParams.set("ref",s),t.pathname+t.search}async function $(e,o=800){var t;try{if(!e)return"";if(typeof e=="string"&&e.startsWith("data:image/png"))return e;let s="";if(typeof e=="string"&&e.trim().startsWith("<svg")){const h=new Blob([e],{type:"image/svg+xml"});s=URL.createObjectURL(h)}else if(typeof e=="string"&&e.startsWith("data:image/svg+xml"))s=e;else if(typeof e=="string"&&e.startsWith("http"))s=e;else return"";const r=new Image;r.crossOrigin="anonymous",await new Promise((h,d)=>{r.onload=h,r.onerror=d,r.src=s});const n=r.height/Math.max(1,r.width),i=o,g=Math.max(1,Math.round(i*n)),l=document.createElement("canvas");l.width=i,l.height=g,(t=l.getContext("2d"))==null||t.drawImage(r,0,0,i,g);try{s.startsWith("blob:")&&URL.revokeObjectURL(s)}catch{}return l.toDataURL("image/png")}catch{return""}}async function B(){window.Stripe||await new Promise((e,o)=>{const t=document.createElement("script");t.src="https://js.stripe.com/v3",t.async=!0,t.crossOrigin="anonymous",t.onload=()=>e(),t.onerror=()=>o(new Error("Stripe.js load failed")),document.head.appendChild(t)})}function k(e,o){console.warn("[stripe:init] ",e),I(e+'  Click "Re-initialize" to retry.'),u(!1),m("pay now");const t=document.getElementById("retry");t&&(t.onclick=o)}async function f(e,o=!1){if(!(window.__payInitLock&&!o)){window.__payInitLock=!0,I("Initializing Stripe…"),y(""),u(!0),m("loading…");try{await B();const t=await fetch(H),s=await t.text();let r;try{r=JSON.parse(s)}catch{}if(!t.ok||!(r!=null&&r.publishableKey))return k("Stripe config error: "+s,()=>f(e,!0));const n=window.Stripe(r.publishableKey);C.current=n,console.log("[stripe] pk ok");const i=U(),g={email:e,fname:"",lname:"",addr1:"",city:"",state:"",zip:"",country:"US"},l=await fetch(F,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:"",metadata:{name:i.name||"",gender:i.gender||"",dob:i.dob||"",tob:i.tob||"",persona:i.persona||"",ref:w(),...g}})}),h=await l.text();let d;try{d=JSON.parse(h)}catch{}if(!l.ok||!(d!=null&&d.clientSecret))return k("Create intent failed: "+h,()=>f(e,!0));const J=d.clientSecret;x.current=d.id,console.log("[stripe] intent ok",d.id);try{const b=n.elements({clientSecret:J,locale:"en"});P.current=b;const A=b.create("payment",{fields:{billingDetails:{address:"never"}}}),_=document.getElementById("payment-element-mount");_&&(_.innerHTML="",A.mount("#payment-element-mount")),console.log("[stripe] element mounted"),I(""),u(!1),m("pay now")}catch(b){return k("Mount payment element error: "+(b.message||b),()=>f(e,!0))}}catch(t){k("Init failed: "+((t==null?void 0:t.message)||t),()=>f(e,!0))}finally{window.__payInitLock=!1}}}const D=async()=>{if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.trim())){alert("Please provide a valid email address.");return}u(!0),m("Please wait patiently while the page is redirecting..."),y("");try{const e=w();let o=`${window.location.origin}${E}?orderID=${encodeURIComponent(x.current)}&email=${encodeURIComponent(c)}`;e&&(o+=`&ref=${encodeURIComponent(e)}`);const{error:t}=await C.current.confirmPayment({elements:P.current,confirmParams:{return_url:o,receipt_email:c,payment_method_data:{billing_details:{email:c,address:{line1:"123 Main Street",city:"New York",state:"NY",postal_code:"10001",country:"US"}}}},redirect:"if_required"});if(t){console.warn("[stripe] confirm error:",t.message),y(t.message||"Payment confirmation failed"),u(!1),m("pay now");return}try{const r=U();let n=localStorage.getItem("omniora:trianglePng")||"";if(!n||!n.startsWith("data:image/png")){const l=localStorage.getItem("omniora:triangle")||"";n=await $(l),n&&localStorage.setItem("omniora:trianglePng",n)}const i=L(x.current,c),g=w();await fetch(K,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:x.current,email:c,url:i,name:r.name,gender:r.gender,dob:r.dob,tob:r.tob,address:r.address||"",persona:r.persona||r.tri&&r.tri.O,tri:r.tri,early:r.early,mid:r.mid,late:r.late,codes:r.codes,ref:g,trianglePng:n})})}catch(r){console.warn("[report/save] warn:",r)}let s=`${E}?orderID=${encodeURIComponent(x.current)}&email=${encodeURIComponent(c)}`;e&&(s+=`&ref=${encodeURIComponent(e)}`),O(s)}catch(e){console.error("[stripe] click exception:",e),y(e.message||String(e)),u(!1),m("pay now")}};return a.jsxs("div",{className:"min-h-screen bg-black text-[#f3f3f1] font-sans overflow-y-auto py-20 px-6",children:[a.jsx("style",{children:`
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
      `}),a.jsxs("div",{className:"checkout-wrap",children:[a.jsx("h1",{className:"font-serif text-center mb-6 text-2xl md:text-3xl tracking-wide text-shadow",children:"Complete your purchase"}),a.jsxs("div",{className:"checkout-card",children:[a.jsxs("div",{className:"grid gap-3",children:[a.jsxs("div",{className:"flex justify-between items-center mb-2",children:[a.jsx("span",{className:"text-sm text-[#b8b8b8]",children:"OMNIORA Detailed Report"}),a.jsxs("span",{className:"text-lg font-bold text-white",children:["$19.90"," ",a.jsx("span",{className:"text-xs text-decoration-line-through text-[#b8b8b8] font-normal ml-1",children:"$39.90"})]})]}),a.jsx("div",{className:"checkout-divider"}),a.jsx("input",{type:"hidden",value:c,onChange:e=>R(e.target.value)})]}),a.jsx("div",{className:"checkout-divider"}),a.jsxs("div",{className:"grid gap-2 mt-2",children:[a.jsx("div",{className:"marks",id:"paypal-marks"}),a.jsxs("div",{className:"grid gap-3",children:[a.jsx("div",{id:"payment-element-mount"}),a.jsx("button",{id:"stripe-pay-btn",type:"button",disabled:v,onClick:D,style:{width:"100%",padding:"12px 14px",borderRadius:"12px",border:"1px solid #2a2a2a",background:"#0e0e10",color:"#fff",cursor:v?"not-allowed":"pointer"},children:T})]}),j&&a.jsx("div",{className:"text-xs text-[#b8b8b8] opacity-90 mt-2 text-center",children:j}),N&&a.jsx("div",{id:"payError",className:"p-3 bg-[#2a1a1a] border border-[#5b2f2f] text-[#ff8a8a] rounded-xl text-xs mt-3 leading-relaxed",children:N}),a.jsx("button",{id:"retry",className:"checkout-btn-ghost",type:"button",onClick:()=>f(c,!0),children:"🔄 Re-initialize"})]}),a.jsx("div",{className:"checkout-foot text-neutral-400",children:"We use Stripe for secure payments. After your purchase, you can view your report immediately and download the PDF. Having trouble? Please contact support."})]})]})]})}export{q as default};
