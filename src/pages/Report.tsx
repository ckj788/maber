import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Report() {
  const [searchParams] = useSearchParams();
  const [orderID, setOrderID] = useState("");
  const [email, setEmail] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [showEmailBadge, setShowEmailBadge] = useState(false);
  const [previewURL, setPreviewURL] = useState("");
  const [previewBtnDisabled, setPreviewBtnDisabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let lsOrderID = "";
    let lsEmail = "";
    try {
      lsOrderID = localStorage.getItem("omniora:orderId") || "";
      lsEmail = localStorage.getItem("omniora:email") || "";
    } catch {}

    const currentOrderID = searchParams.get("orderID") || lsOrderID;
    const currentEmail = searchParams.get("email") || lsEmail;

    setOrderID(currentOrderID);
    setEmail(currentEmail);

    const printURL = new URL("/report-print.html", window.location.origin);
    if (currentOrderID) printURL.searchParams.set("orderID", currentOrderID);
    if (currentEmail) printURL.searchParams.set("email", currentEmail);
    const ref = searchParams.get("ref");
    if (ref) printURL.searchParams.set("ref", ref);
    
    const calculatedPreviewURL = printURL.pathname + printURL.search;
    setPreviewURL(calculatedPreviewURL);

    if (currentEmail && currentEmail !== "buyer@omniora13.com") {
      setEmailHint(
        `A link to your report has been emailed to: ${currentEmail}.<br><br><em>If you do not see the email in your inbox, please check your <strong>spam or junk folder</strong>.</em>`
      );
      setShowEmailBadge(true);
    } else {
      setEmailHint(`You can view your report immediately. Make sure to bookmark this page.`);
      setShowEmailBadge(false);
    }

    if (currentOrderID) {
      setPreviewBtnDisabled(false);
    } else {
      setPreviewBtnDisabled(true);
    }

    // Confetti animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let w = (canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2));
        let h = (canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2));
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        const P: any[] = [];
        const COUNT = 120;
        const rnd = (a: number, b: number) => a + Math.random() * (b - a);

        for (let i = 0; i < COUNT; i++) {
          P.push({
            x: rnd(0, w),
            y: rnd(-h * 0.2, h * 0.2),
            vx: rnd(-0.6, 0.6),
            vy: rnd(1.2, 2.6),
            r: rnd(1, 3),
            a: rnd(0.4, 0.9),
          });
        }

        let animationFrameId: number;
        const draw = () => {
          ctx.clearRect(0, 0, w, h);
          for (const p of P) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.008;
            if (p.y > h) {
              p.y = rnd(-80, -10);
              p.x = rnd(0, w);
              p.vy = rnd(1.2, 2.6);
            }
            ctx.globalAlpha = p.a;
            const palette = ["#fff", "#c8ffe2", "#ffd6e7", "#e0d6ff", "#f7ffd1"];
            ctx.fillStyle = palette[(p.r | 0) % palette.length];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * Math.min(window.devicePixelRatio || 1, 2), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
          w = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
          h = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
          canvas.style.width = window.innerWidth + "px";
          canvas.style.height = window.innerHeight + "px";
        };

        window.addEventListener("resize", handleResize);

        const fadeTimeout = setTimeout(() => {
          cancelAnimationFrame(animationFrameId);
          canvas.remove();
        }, 4000);

        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener("resize", handleResize);
          clearTimeout(fadeTimeout);
        };
      }
    }
  }, [searchParams]);

  function toast(msg: string, isErr = false, holdMs = 2500) {
    const n = document.createElement("div");
    n.textContent = msg;
    n.style.cssText = `
      position:fixed; left:50%; top:24px; transform:translateX(-50%);
      background:${isErr ? "#2a0000" : "#0f2716"}; color:${isErr ? "#ff9292" : "#caffd8"};
      border:1px solid ${isErr ? "#5b1f1f" : "#2f7a46"}; padding:10px 14px; border-radius:12px; z-index:20;
      box-shadow:0 10px 30px rgba(0,0,0,.45); font-size:14px; letter-spacing:.01em`;
    document.body.appendChild(n);
    setTimeout(() => {
      n.style.opacity = "0";
      n.style.transition = "opacity .35s";
    }, holdMs);
    setTimeout(() => n.remove(), holdMs + 500);
  }

  const handleCopyLink = async () => {
    try {
      const fullLink = window.location.origin + previewURL;
      await navigator.clipboard.writeText(fullLink);
      toast("Report link copied");
    } catch {
      toast("Copy failed", true);
    }
  };

  const handleCopyOID = async () => {
    try {
      await navigator.clipboard.writeText(orderID);
      toast("Order ID copied");
    } catch {
      toast("Copy failed", true);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copied");
    } catch {
      toast("Copy failed", true);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f3f3f1] font-sans py-20 px-6 overflow-y-auto">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} id="confetti" className="fixed inset-0 pointer-events-none z-5" />

      {/* Scope Styles */}
      <style>{`
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
      `}</style>

      <div className="report-wrap">
        <div className="report-hero">
          <span className="report-success">
            <span className="report-success-dot"></span> Payment successful
          </span>
          <h1 className="report-title">Your detailed report is ready</h1>
          <p className="report-sub" id="subcopy">
            Your personalized blueprint has been successfully generated.
          </p>
          {showEmailBadge && (
            <div className="report-badge">
              Email target: {email}
            </div>
          )}
        </div>

        <div className="report-cards">
          <section className="report-card-box">
            <h3 style={{ margin: "0 0 10px" }} className="text-lg font-serif">
              Access Report
            </h3>
            <p className="report-hint" dangerouslySetInnerHTML={{ __html: emailHint }} />

            <div className="report-actions" style={{ margin: "12px 0 6px" }}>
              <a
                id="previewBtn"
                className={`report-btn xl full ${previewBtnDisabled ? "disabled" : ""}`}
                href={previewURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                👀 View Full Report
              </a>
              <button id="copyLink" className="report-btn secondary" onClick={handleCopyLink}>
                🔗 Copy Report Link
              </button>
            </div>

            <p className="report-hint" style={{ margin: "4px 0 0" }}>
              Open the report to read your reading and download your high-contrast PDF.
            </p>

            <div className="report-divider"></div>

            <div className="report-kv">
              <div className="report-kv-row">
                <div>
                  <div className="report-kv-label">Order ID</div>
                  <div className="font-mono text-white" style={{ fontSize: "13px" }}>
                    {orderID || "—"}
                  </div>
                </div>
                <button
                  id="copyOID"
                  className="report-btn icon ghost"
                  title="Copy Order ID"
                  onClick={handleCopyOID}
                >
                  📋
                </button>
              </div>
              <div className="report-kv-row" style={{ display: "none" }}>
                <div>
                  <div className="report-kv-label">Email</div>
                  <div className="font-mono text-white" style={{ fontSize: "13px" }}>
                    {email || "—"}
                  </div>
                </div>
                <button
                  id="copyEmail"
                  className="report-btn icon ghost"
                  title="Copy email"
                  onClick={handleCopyEmail}
                >
                  📋
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed" style={{ marginTop: "12px" }}>
              Please bookmark this page or copy the report link to access it later. Need help? Please{" "}
              <Link to="/contact" style={{ textDecoration: "underline" }} className="hover:text-white transition-colors">
                contact us
              </Link>{" "}
              with your Order ID.
            </p>
          </section>

          <aside className="report-card-box" style={{ display: "grid", gap: "10px", alignContent: "start" }}>
            <h3 style={{ margin: "0 0 6px" }} className="text-lg font-serif">
              Next steps
            </h3>
            <Link className="report-btn secondary full" to="/">
              🏠 Back to Home
            </Link>
            <div className="report-divider"></div>
            <p className="report-hint leading-relaxed">
              Open your report online to view your interactive reading and download the high-contrast PDF. If you do not see the email, please check your spam folder.
            </p>
          </aside>
        </div>

        <div className="report-footer">© 2025 OMNIORA</div>
      </div>
    </div>
  );
}
