import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/* ====== Constants ====== */
const API_CREATE_INTENT = "/api/stripe/create-intent";
const API_CONFIG = "/api/stripe/config";
const API_SAVE = "/api/report/save";
const REDIRECT_REPORT = "/report";

// Declaring global Stripe variable
declare global {
  interface Window {
    Stripe: any;
    __payInitLock?: boolean;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState("buyer@omniora13.com");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [payBtnText, setPayBtnText] = useState("loading…");
  const [payBtnDisabled, setPayBtnDisabled] = useState(true);

  const elementsRef = useRef<any>(null);
  const stripeRef = useRef<any>(null);
  const paymentIntentIdRef = useRef<string>("");

  useEffect(() => {
    // Read email from URL or local storage
    let lsEmail = "buyer@omniora13.com";
    try {
      lsEmail = localStorage.getItem("omniora:email") || "buyer@omniora13.com";
    } catch {}
    const urlEmail = searchParams.get("email") || lsEmail;
    setEmail(urlEmail);

    // Initialize Pay UI
    initPayUI(urlEmail);

    return () => {
      window.__payInitLock = false;
    };
  }, [searchParams]);

  function getRefSafe() {
    const raw = searchParams.get("ref") || "";
    return String(raw).slice(0, 40);
  }

  function readSeeds() {
    try {
      const payload = JSON.parse(localStorage.getItem("omniora:payload") || "{}");
      return {
        name: payload.form?.name || "",
        gender: payload.form?.gender || "",
        dob: payload.form?.dob || "",
        tob: payload.form?.tob || "",
        address: payload.form?.address || "",
        persona: payload.persona || "",
        tri: payload.tri || null,
        early: payload.early || null,
        mid: payload.mid || null,
        late: payload.late || null,
        codes: payload.codes || null,
      };
    } catch {
      return {};
    }
  }

  function makeReportUrl(orderID: string, buyerEmail: string) {
    const u = new URL("/report-print.html", window.location.origin);
    if (orderID) u.searchParams.set("orderID", orderID);
    if (buyerEmail) u.searchParams.set("email", buyerEmail);
    const ref = getRefSafe();
    if (ref) u.searchParams.set("ref", ref);
    return u.pathname + u.search;
  }

  async function svgAnyToPngDataURL(svgMaybe: string, outW = 800) {
    try {
      if (!svgMaybe) return "";
      if (typeof svgMaybe === "string" && svgMaybe.startsWith("data:image/png")) return svgMaybe;

      let svgUrl = "";
      if (typeof svgMaybe === "string" && svgMaybe.trim().startsWith("<svg")) {
        const blob = new Blob([svgMaybe], { type: "image/svg+xml" });
        svgUrl = URL.createObjectURL(blob);
      } else if (typeof svgMaybe === "string" && svgMaybe.startsWith("data:image/svg+xml")) {
        svgUrl = svgMaybe;
      } else if (typeof svgMaybe === "string" && svgMaybe.startsWith("http")) {
        svgUrl = svgMaybe;
      } else {
        return "";
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = svgUrl;
      });

      const ratio = img.height / Math.max(1, img.width);
      const w = outW, h = Math.max(1, Math.round(w * ratio));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      try {
        if (svgUrl.startsWith("blob:")) URL.revokeObjectURL(svgUrl);
      } catch {}
      return canvas.toDataURL("image/png");
    } catch {
      return "";
    }
  }

  async function ensureStripeJs() {
    if (window.Stripe) return;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://js.stripe.com/v3";
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Stripe.js load failed"));
      document.head.appendChild(s);
    });
  }

  function panic(msg: string, retryFn: () => void) {
    console.warn("[stripe:init] ", msg);
    setStatusMsg(msg + '  Click "Re-initialize" to retry.');
    setPayBtnDisabled(false);
    setPayBtnText("pay now");
    
    const retryBtn = document.getElementById("retry");
    if (retryBtn) {
      retryBtn.onclick = retryFn;
    }
  }

  async function initPayUI(currentEmail: string, force = false) {
    if (window.__payInitLock && !force) return;
    window.__payInitLock = true;

    setStatusMsg("Initializing Stripe…");
    setErrorMsg("");
    setPayBtnDisabled(true);
    setPayBtnText("loading…");

    try {
      await ensureStripeJs();

      // 1) publishable key
      const cfgRes = await fetch(API_CONFIG);
      const cfgTxt = await cfgRes.text();
      let cfg: any;
      try {
        cfg = JSON.parse(cfgTxt);
      } catch {}
      if (!cfgRes.ok || !cfg?.publishableKey) {
        return panic("Stripe config error: " + cfgTxt, () => initPayUI(currentEmail, true));
      }
      const stripe = window.Stripe(cfg.publishableKey);
      stripeRef.current = stripe;
      console.log("[stripe] pk ok");

      // 2) Create PaymentIntent
      const seeds = readSeeds();
      const payload = {
        email: currentEmail,
        fname: "",
        lname: "",
        addr1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
      };
      
      const intentRes = await fetch(API_CREATE_INTENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "",
          metadata: {
            name: seeds.name || "",
            gender: seeds.gender || "",
            dob: seeds.dob || "",
            tob: seeds.tob || "",
            persona: seeds.persona || "",
            ref: getRefSafe(),
            ...payload,
          },
        }),
      });
      const intentTxt = await intentRes.text();
      let intent: any;
      try {
        intent = JSON.parse(intentTxt);
      } catch {}
      if (!intentRes.ok || !intent?.clientSecret) {
        return panic("Create intent failed: " + intentTxt, () => initPayUI(currentEmail, true));
      }
      const clientSecret = intent.clientSecret;
      paymentIntentIdRef.current = intent.id;
      console.log("[stripe] intent ok", intent.id);

      // 3) Mount Payment Element
      try {
        const elements = stripe.elements({
          clientSecret: clientSecret,
          locale: "en",
        });
        elementsRef.current = elements;

        const paymentElement = elements.create("payment", {
          fields: {
            billingDetails: {
              address: "never",
            },
          },
        });
        
        const elContainer = document.getElementById("payment-element-mount");
        if (elContainer) {
          elContainer.innerHTML = "";
          paymentElement.mount("#payment-element-mount");
        }
        
        console.log("[stripe] element mounted");
        setStatusMsg("");

        // 4) Enable button
        setPayBtnDisabled(false);
        setPayBtnText("pay now");
      } catch (mountErr: any) {
        return panic("Mount payment element error: " + (mountErr.message || mountErr), () =>
          initPayUI(currentEmail, true)
        );
      }
    } catch (e: any) {
      panic("Init failed: " + (e?.message || e), () => initPayUI(currentEmail, true));
    } finally {
      window.__payInitLock = false;
    }
  }

  const handlePayClick = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert("Please provide a valid email address.");
      return;
    }

    setPayBtnDisabled(true);
    setPayBtnText("Please wait patiently while the page is redirecting...");
    setErrorMsg("");

    try {
      const refForJump = getRefSafe();
      let returnUrl = `${window.location.origin}${REDIRECT_REPORT}?orderID=${encodeURIComponent(
        paymentIntentIdRef.current
      )}&email=${encodeURIComponent(email)}`;
      if (refForJump) returnUrl += `&ref=${encodeURIComponent(refForJump)}`;

      const { error } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: returnUrl,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              email: email,
              address: {
                line1: "123 Main Street",
                city: "New York",
                state: "NY",
                postal_code: "10001",
                country: "US",
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        console.warn("[stripe] confirm error:", error.message);
        setErrorMsg(error.message || "Payment confirmation failed");
        setPayBtnDisabled(false);
        setPayBtnText("pay now");
        return;
      }

      // Success -> Save and redirect
      try {
        const seeds2 = readSeeds();
        let trianglePng = localStorage.getItem("omniora:trianglePng") || "";
        if (!trianglePng || !trianglePng.startsWith("data:image/png")) {
          const triSvg = localStorage.getItem("omniora:triangle") || "";
          trianglePng = await svgAnyToPngDataURL(triSvg);
          if (trianglePng) localStorage.setItem("omniora:trianglePng", trianglePng);
        }
        const reportUrl = makeReportUrl(paymentIntentIdRef.current, email);
        const ref = getRefSafe();
        await fetch(API_SAVE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: paymentIntentIdRef.current,
            email: email,
            url: reportUrl,
            name: seeds2.name,
            gender: seeds2.gender,
            dob: seeds2.dob,
            tob: seeds2.tob,
            address: seeds2.address || "",
            persona: seeds2.persona || (seeds2.tri && seeds2.tri.O),
            tri: seeds2.tri,
            early: seeds2.early,
            mid: seeds2.mid,
            late: seeds2.late,
            codes: seeds2.codes,
            ref,
            trianglePng,
          }),
        });
      } catch (e) {
        console.warn("[report/save] warn:", e);
      }

      let next = `${REDIRECT_REPORT}?orderID=${encodeURIComponent(
        paymentIntentIdRef.current
      )}&email=${encodeURIComponent(email)}`;
      if (refForJump) next += `&ref=${encodeURIComponent(refForJump)}`;
      navigate(next);
    } catch (e: any) {
      console.error("[stripe] click exception:", e);
      setErrorMsg(e.message || String(e));
      setPayBtnDisabled(false);
      setPayBtnText("pay now");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f3f3f1] font-sans overflow-y-auto py-20 px-6">
      {/* Scope Styles */}
      <style>{`
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
      `}</style>

      <div className="checkout-wrap">
        <h1 className="font-serif text-center mb-6 text-2xl md:text-3xl tracking-wide text-shadow">
          Complete your purchase
        </h1>
        
        <div className="checkout-card">
          <div className="grid gap-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#b8b8b8]">OMNIORA Detailed Report</span>
              <span className="text-lg font-bold text-white">
                $19.90{" "}
                <span className="text-xs text-decoration-line-through text-[#b8b8b8] font-normal ml-1">
                  $39.90
                </span>
              </span>
            </div>
            <div className="checkout-divider"></div>
            <input
              type="hidden"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="checkout-divider"></div>

          <div className="grid gap-2 mt-2">
            <div className="marks" id="paypal-marks"></div>
            <div className="grid gap-3">
              <div id="payment-element-mount"></div>
              
              <button
                id="stripe-pay-btn"
                type="button"
                disabled={payBtnDisabled}
                onClick={handlePayClick}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #2a2a2a",
                  background: "#0e0e10",
                  color: "#fff",
                  cursor: payBtnDisabled ? "not-allowed" : "pointer",
                }}
              >
                {payBtnText}
              </button>
            </div>

            {statusMsg && (
              <div className="text-xs text-[#b8b8b8] opacity-90 mt-2 text-center">
                {statusMsg}
              </div>
            )}

            {errorMsg && (
              <div
                id="payError"
                className="p-3 bg-[#2a1a1a] border border-[#5b2f2f] text-[#ff8a8a] rounded-xl text-xs mt-3 leading-relaxed"
              >
                {errorMsg}
              </div>
            )}

            <button
              id="retry"
              className="checkout-btn-ghost"
              type="button"
              onClick={() => initPayUI(email, true)}
            >
              🔄 Re-initialize
            </button>
          </div>

          <div className="checkout-foot text-neutral-400">
            We use Stripe for secure payments. After your purchase, you can view your report immediately and download the PDF. Having trouble? Please contact support.
          </div>
        </div>
      </div>
    </div>
  );
}
