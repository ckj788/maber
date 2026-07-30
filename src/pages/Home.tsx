import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpaceBackground } from "../components/SpaceBackground";
import { PyramidSvg } from "../components/PyramidSvg";
import { ReportModal, PERSONA_TITLES, PERSONA_TEASERS } from "../components/ReportModal";
import { HeroGeometry, CosmicHarmony, NumerologyMap, ReportMockup } from "../components/DecorativeGraphics";
import { TriangleData, BirthFormData } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { usePostHog } from "@posthog/react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const posthog = usePostHog();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<BirthFormData>({
    name: "",
    email: "",
    dob: "",
    tob: "",
    address: "",
  });

  // Recognize leadID parameter from email recovery links
  useEffect(() => {
    const leadID = searchParams.get("leadID") || searchParams.get("leadId");
    if (leadID) {
      fetch(`/api/lead/get?leadID=${leadID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.lead) {
            const lead = data.lead;
            setFormData({
              name: lead.name || "",
              email: lead.email || "",
              dob: lead.dob || "",
              tob: lead.tob || "",
              address: lead.address || "",
            });
            if (lead.dob) {
              const calculated = computeTriangle(lead.dob);
              if (calculated) {
                setTriangleData(calculated);
                setIsModalOpen(true); // Auto-open locked chapter preview modal with $19.90 buy button!
              }
            }
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  const [triangleData, setTriangleData] = useState<TriangleData | null>(null);
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [ritualRoman, setRitualRoman] = useState("I");
  const [ritualText, setRitualText] = useState("Invoking pattern…");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showResultSection, setShowResultSection] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [ritualProgress, setRitualProgress] = useState(0);

  const [showResultFooter, setShowResultFooter] = useState(false);
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [liveLeadCount, setLiveLeadCount] = useState<number | null>(() => {
    try {
      const cached = localStorage.getItem("omniora_lead_count");
      return cached ? parseInt(cached, 10) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    fetch('/api/lead/count')
      .then(res => res.json())
      .then(data => {
        if (data?.total) {
          setLiveLeadCount(data.total);
          try {
            localStorage.setItem("omniora_lead_count", String(data.total));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isRitualActive || showResultSection) {
      setShowStickyBtn(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBtn(true);
      } else {
        setShowStickyBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRitualActive, showResultSection]);

  const [isStaticBtnReached, setIsStaticBtnReached] = useState(false);

  useEffect(() => {
    if (!showResultSection) return;

    const checkOverlap = () => {
      const el = document.getElementById("static-pay-button");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight - 30 && rect.bottom >= 0) {
        setIsStaticBtnReached(true);
      } else {
        setIsStaticBtnReached(false);
      }
    };

    window.addEventListener("scroll", checkOverlap, { passive: true });
    checkOverlap();
    return () => window.removeEventListener("scroll", checkOverlap);
  }, [showResultSection]);

  useEffect(() => {
    if (showResultSection) {
      window.scrollTo({ top: 0, behavior: "instant" });
      
      const scrollTimer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100);

      const scrollTimer2 = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 600);

      const footerTimer = setTimeout(() => {
        setShowResultFooter(true);
      }, 1200);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(scrollTimer2);
        clearTimeout(footerTimer);
      };
    } else {
      setShowResultFooter(false);
    }
  }, [showResultSection]);

  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ page: "form" }, "");
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page === "form" || !e.state) {
        setShowResultSection(false);
        setTriangleData(null);
      } else if (e.state?.page === "result") {
        setShowResultSection(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useGSAP(() => {
    if (showResultSection || isRitualActive) return;

    // 1. Hero Content Entrance Animations
    gsap.from(".hero-title", {
      y: 35,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out"
    });
    gsap.from(".hero-subcopy", {
      y: 15,
      opacity: 0,
      duration: 1.0,
      delay: 0.15,
      ease: "power3.out"
    });
    gsap.from(".hero-form-container", {
      y: 20,
      opacity: 0,
      duration: 1.0,
      delay: 0.3,
      ease: "power3.out"
    });
    gsap.from(".hero-extra", {
      y: 10,
      opacity: 0,
      duration: 1.0,
      delay: 0.6,
      ease: "power3.out"
    });
    gsap.from(".hero-visual", {
      scale: 0.97,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: "power3.out"
    });

    // 2. Section 2: Story Reveal
    gsap.from("#story-section .story-visual", {
      scrollTrigger: {
        trigger: "#story-section",
        start: "top 85%",
      },
      x: -40,
      opacity: 0,
      duration: 1.0,
      ease: "power2.out"
    });
    gsap.from("#story-section .story-text", {
      scrollTrigger: {
        trigger: "#story-section",
        start: "top 85%",
      },
      x: 40,
      opacity: 0,
      duration: 1.0,
      ease: "power2.out"
    });

    // 3. Section 3: Theory/Promise Reveal
    gsap.from("#theory-section .theory-text", {
      scrollTrigger: {
        trigger: "#theory-section",
        start: "top 85%",
      },
      x: -40,
      opacity: 0,
      duration: 1.0,
      ease: "power2.out"
    });
    gsap.from("#theory-section .theory-visual", {
      scrollTrigger: {
        trigger: "#theory-section",
        start: "top 85%",
      },
      x: 40,
      opacity: 0,
      duration: 1.0,
      ease: "power2.out"
    });

    // 4. Section 4: Ritual Form Reveal (Removed scrollTrigger since form is now in hero)

    // 5. Section 6: Client Voices Cards Stagger
    gsap.from("#voices-section .voice-card", {
      scrollTrigger: {
        trigger: "#voices-section",
        start: "top 85%",
      },
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out"
    });
  }, { dependencies: [showResultSection, isRitualActive] });

  const renderFooter = () => (
    <footer className="border-t border-white/5 py-16 bg-[#030304] relative z-10 text-neutral-400">
      <div className="w-full max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-5 h-5 rounded-full border border-white/20"
              style={{
                background: `radial-gradient(circle at 35% 35%, #fff 0, #f4f4f4 16%, transparent 38%)`
              }}
            />
            <span className="font-serif text-white text-lg tracking-wider font-semibold">OMNIORA</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm font-light">
            We translate ancient Eastern & Western numerology principles into precise minimalist geometric signatures and comprehensive PDF blueprints.
          </p>
          <a 
            href="https://www.instagram.com/omnioraxyz/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mt-2"
          >
            Instagram @omnioraxyz
          </a>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
          <span className="text-neutral-600 mb-1 text-[10px]">Navigation</span>
          <a href="./about.html" className="hover:text-white transition-colors">About</a>
          <a href="./faq.html" className="hover:text-white transition-colors">FAQ</a>
          <a href="./contact.html" className="hover:text-white transition-colors">Contact</a>
          <a href="./privacy.html" className="hover:text-white transition-colors">Privacy</a>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider md:items-end">
          <span className="text-neutral-600 mb-1 text-[10px] md:text-right">Copyright</span>
          <span className="text-neutral-500 text-xs md:text-right">© 2026 OMNIORA</span>
          <span className="text-neutral-600 text-[10px] md:text-right">ESTABLISHED 2025</span>
        </div>
      </div>
    </footer>
  );

  // Do not auto-load or pre-fill on mount, keeping input fields fresh and empty for the user

  // Single digit reduction logic for OMNIORA Pythagorean math
  const reduceToOneDigit = (n: number): number => {
    let val = Math.abs(Math.floor(n));
    while (val > 9) {
      val = String(val)
        .split("")
        .reduce((acc, curr) => acc + Number(curr), 0);
    }
    return val;
  };

  const computeTriangle = (dobString: string): TriangleData | null => {
    // Standardize input string: replace slashes and spaces with hyphens
    const cleanDob = dobString.trim().replace(/[\/\s]+/g, "-");
    const match = cleanDob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    const [_, y, m, d] = match;
    const pad = (s: string, len: number) => String(s).padStart(len, "0");
    const Y = pad(y, 4);
    const M = pad(m, 2);
    const D = pad(d, 2);

    const b = {
      A: Number(D[0]),
      B: Number(D[1]),
      C: Number(M[0]),
      Dd: Number(M[1]),
      E: Number(Y[0]),
      F: Number(Y[1]),
      G: Number(Y[2]),
      H: Number(Y[3]),
    };

    const I = reduceToOneDigit(b.A + b.B);
    const J = reduceToOneDigit(b.C + b.Dd);
    const K = reduceToOneDigit(b.E + b.F);
    const L = reduceToOneDigit(b.G + b.H);

    const M_val = reduceToOneDigit(I + J);
    const N = reduceToOneDigit(K + L);
    const O = reduceToOneDigit(M_val + N);

    const Q = reduceToOneDigit(N + O);
    const P = reduceToOneDigit(M_val + O);
    const R = reduceToOneDigit(Q + P);

    const T = reduceToOneDigit(I + M_val);
    const S = reduceToOneDigit(J + M_val);
    const U = reduceToOneDigit(T + S);

    const V = reduceToOneDigit(K + N);
    const W = reduceToOneDigit(L + N);
    const X = reduceToOneDigit(V + W);

    return { I, J, K, L, M: M_val, N, O, Q, P, R, T, S, U, V, W, X };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorText("");
  };

  const handleBeginRitual = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, dob, tob, address } = formData;

    if (!name.trim() || !dob.trim() || !email.trim()) {
      setErrorText("Please fill out your full name, email, and date of birth.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorText("Please provide a valid email address.");
      return;
    }

    const calculated = computeTriangle(dob);
    if (!calculated) {
      setErrorText("Please enter a valid Date of Birth (YYYY / MM / DD).");
      return;
    }

    // Trigger loading ritual sequences
    setErrorText("");
    setIsRitualActive(true);
    setRitualProgress(0);

    if (posthog) {
      posthog.capture("calculate_coordinates", {
        email: email
      });
    }

    // Trigger background lead capture for automated 1-minute recovery email
    try {
      console.log("🚀 [Lead Capture] Sending lead payload to /api/lead/capture...", { name, email, dob, tob, address });
      fetch("/api/lead/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          dob: dob,
          tob: tob,
          address: address,
          persona: calculated.O,
          tri: calculated,
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          console.log("✅ [Lead Capture Response]:", res);
          setLiveLeadCount((prev) => prev + 1);
        })
        .catch((err) => console.error("❌ [Lead Capture Fetch Error]:", err));
    } catch (err) {
      console.error("❌ [Lead Capture Outer Error]:", err);
    }

    const ROMAN_MAP: Record<number, string> = {
      1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
      7: "VII", 8: "VIII", 9: "IX", 11: "XI", 22: "XXII", 33: "XXXIII"
    };

    const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

    const startTime = performance.now();
    const totalDuration = 5000; // 5 seconds loading animation

    let animationFrameId: number;
    let lastRomanUpdate = 0;
    let romanIdx = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const pct = progress * 100;
      
      setRitualProgress(Math.min(pct, 99.9));

      // Roman numerals cycle updates every 80ms
      if (currentTime - lastRomanUpdate >= 80) {
        const idx = romanIdx % sequence.length;
        const num = sequence[idx];
        setRitualRoman(ROMAN_MAP[num] || String(num));
        romanIdx++;
        lastRomanUpdate = currentTime;
      }

      // Dynamic cinematic phrases based on exact elapsed time (1000ms steps)
      if (elapsed < 1000) {
        setRitualText("1. Aligning Pythagorean axis coordinates…");
      } else if (elapsed < 2000) {
        setRitualText("2. Decoding birth coordinate variations…");
      } else if (elapsed < 3000) {
        setRitualText("3. Synthesizing triadic destiny signatures…");
      } else if (elapsed < 4000) {
        setRitualText("4. Forging active shadow medicine frequencies…");
      } else {
        setRitualText("5. Generating your 4-page cosmic vector map…");
      }

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Completed!
        setRitualProgress(100);
        const finalCoreNum = calculated.O || 7;
        setRitualRoman(ROMAN_MAP[finalCoreNum] || String(finalCoreNum));

        setTimeout(() => {
          setIsRitualActive(false);
          setTriangleData(calculated);
          setShowResultSection(true);

          if (posthog) {
            posthog.capture("result_page_viewed", {
              archetype_node: finalCoreNum
            });
          }

          try {
            const early = ['IJM', 'IMT', 'JMS', 'TSU'];
            const mid = ['MNO', 'MOP', 'NOQ', 'QPR'];
            const late = ['KLN', 'KNV', 'LNW', 'VWX'];
            
            const tripletToCode = (trip: string) => {
              const a = calculated[trip[0] as keyof TriangleData];
              const b = calculated[trip[1] as keyof TriangleData];
              const c = calculated[trip[2] as keyof TriangleData];
              return '' + reduceToOneDigit(a) + reduceToOneDigit(b) + reduceToOneDigit(c);
            };
            const codes = [...early, ...mid, ...late].map(tripletToCode);

            const payload = {
              v: 1,
              ts: Date.now(),
              form: {
                ...formData,
                gender: 'male'
              },
              tri: calculated,
              persona: finalCoreNum,
              early,
              mid,
              late,
              codes
            };
            localStorage.setItem("omniora:payload", JSON.stringify(payload));
            localStorage.setItem("omniora:name", formData.name);
            localStorage.setItem("omniora:email", formData.email);
            localStorage.setItem("omniora:dob", formData.dob);
            localStorage.setItem("omniora:tob", formData.tob);
            localStorage.setItem("omniora:address", formData.address);
            localStorage.setItem("omniora:gender", "male");
          } catch (err) {
            console.warn("Storage save failed:", err);
          }

          // Push result page state to history
          window.history.pushState({ page: "result" }, "");

          // Instantly scroll to the top
          window.scrollTo({ top: 0, behavior: "instant" });
        }, 150);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      dob: "",
      tob: "",
      address: "",
    });
    setTriangleData(null);
    setShowResultSection(false);
    window.scrollTo({ top: 0, behavior: "instant" });

    if (window.history.state?.page === "result") {
      window.history.back();
    }
  };

  // Get current active archetype titles
  const coreArchetypeNum = triangleData?.O || 7;
  const coreArchetypeTitle = PERSONA_TITLES[String(coreArchetypeNum)] || "The Sage";
  const coreArchetypeTeaser = PERSONA_TEASERS[String(coreArchetypeNum)] || "You hunt the pattern under the pattern, trust evidence, and speak only when it counts.";

  return (
    <div className="min-h-screen text-[#f3f3f1] font-sans selection:bg-neutral-800 selection:text-white bg-black relative overflow-x-hidden">
      {/* Background canvas stars element */}
      <SpaceBackground />

      {/* FIXED NAVIGATION */}
      {!isRitualActive && (
        <nav className="fixed inset-x-0 top-0 h-[60px] z-[50] flex items-center border-b border-white/5 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-[1120px] mx-auto px-6 flex items-center justify-between">
            <button 
              onClick={handleReset}
              className="flex items-center gap-3 cursor-pointer group text-left hover:opacity-90 transition-opacity"
            >
              {/* Logo Orbit Node Circle */}
              <div 
                className="w-[26px] h-[26px] rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_18px_rgba(255,255,255,0.12)]"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #fff 0, #f4f4f4 16%, transparent 38%), conic-gradient(from 220deg, rgba(255,255,255,0.6), rgba(255,255,255,0.15), rgba(255,255,255,0))`
                }}
                aria-hidden="true"
              />
              <span className="font-serif text-lg tracking-wider font-semibold">OMNIORA</span>
            </button>
            
            <div className="flex items-center gap-6">
              <a 
                href="./what-is-omniora.html" 
                className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                What is OMNIORA
              </a>
              <a 
                href="./shop.html" 
                className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Shop
              </a>
            </div>
          </div>
        </nav>
      )}

      {/* MAIN CONTAINER */}
      <main className="relative z-10 pt-[60px]">
        <AnimatePresence mode="wait">
          {!showResultSection && !isRitualActive && (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, filter: "blur(6px)", y: 15 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* HERO HEADER VIEW */}
              <section className="relative min-h-[92vh] flex items-center justify-center py-16 overflow-hidden">
          {/* Subtle cosmic radial backdrop gradient */}
          <div className="absolute inset-0 top-0 h-[85vh] bg-radial-gradient from-white/[0.04] via-transparent to-transparent pointer-events-none select-none z-0" />
          
          <div className="w-full max-w-[1120px] mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              {/* Hero details */}
              <div className="md:col-span-7 flex flex-col items-start gap-5 text-left">

                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wide leading-[1.1] font-bold hero-title">
                    Your <span className="text-gradient-cosmic">Life Path</span>, Decoded in 30 Seconds
                  </h1>
                  <p className="text-xs tracking-[0.16em] uppercase text-neutral-400 font-mono mt-1 hero-subcopy">
                    A personal cosmic blueprint, mapped from your exact birth entry coordinates
                  </p>
                </div>

                {/* ERROR FRAME */}
                {errorText && (
                  <div className="w-full p-4 bg-red-950/40 border border-red-900/50 rounded-xl text-red-300 text-xs font-medium text-left mt-2 hero-form-error">
                    ⚠️ {errorText}
                  </div>
                )}

                {/* FORM CONTAINER - SINGLE CARD HIGH CONVERSION LAYOUT */}
                <form 
                  id="ritual-form-anchor"
                  onSubmit={handleBeginRitual}
                  autoComplete="off"
                  noValidate
                  className="w-full mt-4 bg-neutral-950/40 backdrop-blur-md border border-neutral-900/60 rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hero-form-container"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        FULL NAME
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Ava Morgan"
                        className="w-full bg-[#0a0a0c] text-[#f3f3f1] border border-neutral-900 rounded-xl p-3 placeholder:text-neutral-700 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs font-mono"
                        autoComplete="off"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="w-full bg-[#0a0a0c] text-[#f3f3f1] border border-neutral-900 rounded-xl p-3 placeholder:text-neutral-700 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs font-mono"
                        autoComplete="off"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        DATE OF BIRTH
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        placeholder="YYYY / MM / DD"
                        className={`w-full bg-[#0a0a0c] text-[#f3f3f1] border border-neutral-900 rounded-xl p-3 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs font-mono ${formData.dob ? "has-value" : ""}`}
                        autoComplete="off"
                        lang="en-US"
                      />
                    </div>

                    {/* Time of Birth */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        TIME OF BIRTH <span className="text-neutral-600">(OPTIONAL)</span>
                      </label>
                      <input
                        type="time"
                        name="tob"
                        value={formData.tob}
                        onChange={handleInputChange}
                        placeholder="HH : MM (e.g., 14:30)"
                        className={`w-full bg-[#0a0a0c] text-[#f3f3f1] border border-neutral-900 rounded-xl p-3 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs font-mono ${formData.tob ? "has-value" : ""}`}
                        autoComplete="off"
                        lang="en-US"
                      />
                    </div>

                    {/* Birthplace */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        BIRTHPLACE <span className="text-neutral-600">(CITY, COUNTRY — FOR LOCAL MAGNETIC & TIMEZONE CALIBRATION)</span>
                      </label>
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g., London, UK"
                        className="w-full bg-[#0a0a0c] text-[#f3f3f1] border border-neutral-900 rounded-xl p-3 placeholder:text-neutral-700 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs font-mono"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-900 pt-4 mt-2">
                    <span className="text-[10px] text-neutral-500 font-mono text-left flex items-center gap-1.5">
                      🔒 We respect your privacy. No data is sold or stored.
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto p-3.5 px-8 border border-neutral-700 hover:border-neutral-400 bg-neutral-950 text-white rounded-xl hover:bg-white hover:text-black transition-all duration-300 font-semibold cursor-pointer text-center text-xs"
                    >
                      Decode My Coordinates
                    </button>
                  </div>
                </form>

                <div className="flex flex-col gap-1 mt-2 hero-extra">
                  <p className="text-xs text-neutral-500 font-mono">
                    ✦ High-contrast structured report · Instant secure calculations
                  </p>
                  <p className="text-[11px] text-neutral-500 italic">
                    Inspired by classical Pythagorean math & ancient geometric harmony
                  </p>
                </div>
              </div>

              {/* Decorative premium stellar diagram */}
              <div className="md:col-span-5 w-full hero-visual">
                <HeroGeometry />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: STORY (The Harmony of the Cosmos) */}
        <section id="story-section" className="py-24 border-t border-neutral-900/60 bg-black/20">
          <div className="w-full max-w-[1120px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual decoration */}
              <div className="order-2 md:order-1 md:col-span-5 story-visual">
                <CosmicHarmony />
              </div>

              {/* Right Column: Text content */}
              <div className="order-1 md:order-2 md:col-span-12 lg:col-span-7 flex flex-col items-start text-left gap-5 story-text">

                <h2 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-wide">
                  The <span className="text-gradient-cosmic">Harmony</span> of the Cosmos
                </h2>
                <div className="w-16 h-[1px] bg-neutral-800" />
                <p className="text-neutral-400 font-light leading-relaxed text-base">
                  Long ago, ancient mystics and philosophers realized that the universe speaks in code. They saw not chaos, but harmony. Not stars, but a silent rhythm. Everything in existence vibrates to a specific frequency.
                </p>
                <p className="text-neutral-400 font-light leading-relaxed text-base">
                  Numbers aren't just for math—they are the underlying pulse of your energetic blueprint. Omniora bridges classical wisdom with digital minimal design to turn your birth coordinates into a clear, stunning map. It translates ancient geometry into coordinate alignments you can feel in your bones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROMISE - Not prophecy. Coordinates. */}
        <section id="theory-section" className="py-24 border-t border-neutral-900/60 bg-black/40">
          <div className="w-full max-w-[1120px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              {/* Left Column: Text content */}
              <div className="md:col-span-7 flex flex-col items-start text-left gap-5 theory-text">

                <h2 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-wide">
                  Not prophecy. <span className="text-gradient-cosmic">Coordinates.</span>
                </h2>
                <div className="w-16 h-[1px] bg-neutral-800" />
                <p className="text-neutral-400 font-light leading-relaxed text-base">
                  From Pythagoras’ whisper to your desktop, numbers shift from folklore to modern directions. Here, the mathematics becomes a pure reflecting mirror.
                </p>
                <p className="text-neutral-400 font-light leading-relaxed text-base">
                  Nine unique archetypes sit as nodes. They don't label you; they locate you. How you begin, belong, speak, build, change, care, know, lead, and complete. You’ll receive a clean, high-contrast matrix map detailing exactly where you stand in this cosmic symmetry.
                </p>
              </div>

              {/* Right Column: Visual decoration */}
              <div className="md:col-span-5 theory-visual">
                <NumerologyMap />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: RITUAL FORM REMOVED (INTEGRATED INTO HERO ABOVE THE FOLD) */}

        {/* SECTION 6: CLIENT VOICES FEEDBACKS */}
        <section id="voices-section" className="py-24 border-t border-neutral-900/60 bg-[#060608]/40">
          <div className="w-full max-w-[1120px] mx-auto px-6">
            <div className="flex flex-col items-start gap-4 mb-12 text-left">
              <span className="text-xs tracking-widest text-[#c9c9c5] uppercase font-mono bg-white/[0.02] px-3 py-1 border border-white/5 rounded-full">
                WHAT PEOPLE SAY
              </span>
              <h2 className="text-3xl font-serif text-white font-bold">
                Voices from the field
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-neutral-900 rounded-2xl bg-gradient-to-tr from-neutral-950 to-neutral-950/40 text-left flex flex-col justify-between voice-card">
                <p className="text-neutral-300 font-light text-sm leading-relaxed">
                  "This feels creepily accurate. I actually had to close my laptop for a minute after reading the specific section about career redirection loops and shadows."
                </p>
                <div className="text-xs text-neutral-500 font-mono mt-6 uppercase tracking-wider">
                  — A., 23 · London
                </div>
              </div>

              <div className="p-6 border border-neutral-900 rounded-2xl bg-gradient-to-tr from-neutral-950 to-neutral-950/40 text-left flex flex-col justify-between voice-card">
                <p className="text-neutral-300 font-light text-sm leading-relaxed">
                  "It’s like Co–Star but only about my specific birth node calculations. The geometry and pyramid image are outstanding. I have it saved as my active lockscreen."
                </p>
                <div className="text-xs text-neutral-500 font-mono mt-6 uppercase tracking-wider">
                  — J., 21 · New York
                </div>
              </div>

              <div className="p-6 border border-neutral-900 rounded-2xl bg-gradient-to-tr from-neutral-950 to-neutral-900 bg-neutral-950 text-left flex flex-col justify-between voice-card">
                <p className="text-neutral-300 font-light text-sm leading-relaxed">
                  "I am typically skeptical about numerical systems, but OMNIORA gave extremely clear language to repeating life patterns I have been circling for the past decade."
                </p>
                <div className="text-xs text-neutral-500 font-mono mt-6 uppercase tracking-wider">
                  — M., 25 · Melbourne
                </div>
              </div>
            </div>
          </div>
        </section>
        {renderFooter()}
            </motion.div>
          )}

          {/* INVOCATION RITUAL FULL SCREEN LOADING PROCESS OVERLAY */}
          {isRitualActive && (
            <motion.div
              key="ritual-loading"
              initial={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[99999] bg-[#060609] flex flex-col items-center justify-center gap-10 md:gap-14 pointer-events-auto select-none p-6 md:p-12 overflow-hidden text-[#ecebe7]"
            >
              {/* Cosmic Ambient Background Glows */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-neutral-950 to-black pointer-events-none z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[#c5a880]/10 via-transparent to-transparent pointer-events-none z-0" />
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ecebe7] via-transparent to-transparent pointer-events-none select-none z-0" />

              {/* Shimmering floaty stardust particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {Array.from({ length: 24 }).map((_, i) => {
                  const top = `${5 + (i * 13) % 90}%`;
                  const left = `${4 + (i * 19) % 92}%`;
                  const delay = `${(i * 0.15).toFixed(2)}s`;
                  const duration = `${(4 + (i % 3) * 2)}s`;
                  return (
                    <div
                      key={i}
                      className="absolute w-[1.5px] h-[1.5px] rounded-full bg-[#ecebe7]"
                      style={{
                        top,
                        left,
                        animation: `pulse ${duration} infinite ease-in-out ${delay}`,
                        boxShadow: "0 0 8px 1.5px rgba(236,235,231,0.6)",
                      }}
                    />
                  );
                })}
              </div>

              {/* TOP CELESTIAL HEADER */}
              <div className="relative z-10 text-center flex flex-col items-center gap-2 pt-4">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-[1px] bg-[#c5a880]/40" />
                  <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-mono font-medium">
                    Sovereign Matrix Synthesis
                  </span>
                  <span className="w-1.5 h-[1px] bg-[#c5a880]/40" />
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-light tracking-[0.15em] text-[#f4f3f1] mt-1">
                  ALIGNING DESTINY AXIS
                </h2>
                <div className="w-8 h-[1px] bg-neutral-800 my-1" />
                <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
                  Phase IV • System Coordinates Active
                </span>
              </div>

              {/* CINEMATIC SVG ASTROLABE COMPASS ENGINE */}
              <div className="relative z-10 w-full max-w-[360px] aspect-square flex items-center justify-center my-4">
                {/* Concentric spin-circles */}
                <div className="absolute inset-0 rounded-full border border-neutral-900/40 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-[#c5a880]/10 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-neutral-800/80" />

                {/* Luxurious celestial SVG compass overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(197,168,128,0.08)]" viewBox="0 0 200 200">
                  {/* Outer compass degree lines */}
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const angle = (idx * 360) / 24;
                    return (
                      <line
                        key={idx}
                        x1="100"
                        y1="5"
                        x2="100"
                        y2="10"
                        transform={`rotate(${angle} 100 100)`}
                        stroke="#c5a880"
                        strokeWidth="0.4"
                        strokeOpacity={idx % 6 === 0 ? "0.6" : "0.2"}
                      />
                    );
                  })}
                  
                  {/* Intersecting constellation vector guidelines */}
                  <line x1="100" y1="10" x2="100" y2="190" stroke="#c5a880" strokeWidth="0.2" strokeOpacity="0.15" />
                  <line x1="10" y1="100" x2="190" y2="100" stroke="#c5a880" strokeWidth="0.2" strokeOpacity="0.15" />
                  <circle cx="100" cy="100" r="82" stroke="#c5a880" strokeWidth="0.3" strokeOpacity="0.25" fill="none" />
                  <circle cx="100" cy="100" r="64" stroke="#c5a880" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3,3" fill="none" />

                  {/* Orbiting star node */}
                  <g transform={`rotate(${(ritualProgress * 3.6).toFixed(1)} 100 100)`}>
                    <circle cx="100" cy="18" r="3" fill="#c5a880" opacity="0.8" />
                    <line x1="100" y1="18" x2="100" y2="100" stroke="#c5a880" strokeWidth="0.3" strokeOpacity="0.3" strokeDasharray="1,2" />
                  </g>

                  {/* Harmonic diamond construct */}
                  <polygon
                    points="100,34 166,100 100,166 34,100"
                    stroke="#c5a880"
                    strokeWidth="0.3"
                    strokeOpacity="0.2"
                    fill="none"
                    transform={`rotate(${(-ritualProgress * 0.72).toFixed(1)} 100 100)`}
                  />
                </svg>

                {/* Glowing Golden Aura Circle behind numeral */}
                <div className="absolute w-36 h-36 rounded-full bg-radial-gradient from-[#c5a880]/15 via-transparent to-transparent blur-xl animate-pulse" />

                {/* Floating Central Matrix Lens */}
                <div className="relative flex flex-col items-center justify-center w-40 h-40 rounded-full border border-[#c5a880]/20 bg-[#060609]/90 backdrop-blur-md shadow-[0_0_50px_rgba(197,168,128,0.12)]">
                  {/* Spinning progress trace ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      transform="translate(20,20)"
                      fill="none"
                      stroke="#c5a880"
                      strokeWidth="1.2"
                      strokeOpacity="0.75"
                      strokeDasharray={`${(2 * Math.PI * 74).toFixed(1)}`}
                      strokeDashoffset={`${((1 - ritualProgress / 100) * (2 * Math.PI * 74)).toFixed(2)}`}
                      className=""
                    />
                  </svg>

                  <span className="text-[10px] tracking-[0.25em] text-[#c5a880]/70 font-mono uppercase mb-1">
                    Axiom
                  </span>
                  <div className="text-5xl font-serif font-bold tracking-[0.05em] text-[#f4f3f1] drop-shadow-[0_0_15px_rgba(255,255,255,0.45)]">
                    {ritualRoman}
                  </div>
                  <span className="text-[11px] tracking-widest text-[#ecebe7]/60 font-mono mt-2">
                    {Math.floor(ritualProgress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        {/* SECTION 5: TRIANGLE & PREVIEW SECTION */}
        {showResultSection && !isRitualActive && (
          <motion.div
            key="result-page"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)", y: 25 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <section id="triangle-section" className="py-12 md:py-20 bg-black relative z-20">
            <div className="w-full max-w-[1120px] mx-auto px-6 flex flex-col gap-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-xs tracking-widest text-neutral-400 uppercase font-mono">
                  Your Signature Revealed
                </span>
                <h2 className="text-4xl font-serif text-white font-bold">
                  Triadic Structure Map
                </h2>
                <p className="text-neutral-400 max-w-lg leading-relaxed text-sm">
                  This geometric matrix maps your inner alignment, calculated specifically from your birth coordinates. Look closely at the calculated nodes.
                </p>
              </div>

              {/* PYRAMID SVG VIEW CONTAINER */}
              <div className="w-full max-w-[850px] mx-auto bg-neutral-950/60 border border-neutral-900/80 rounded-2xl p-4 sm:p-6 md:p-10 shadow-2xl backdrop-blur-md">
                <PyramidSvg data={triangleData} />
              </div>

              {/* DARK CELESTIAL LUXURY RESULT CARD (TAILORED FOR 18-24 FEMALE AUDIENCE) */}
              <div className="w-full max-w-[850px] mx-auto mt-8 bg-gradient-to-b from-[#0a0a0e] via-[#060608] to-[#040406] border border-[#c5a880]/25 rounded-3xl p-6 md:p-12 text-left flex flex-col gap-8 select-none relative overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                
                {/* Background Stardust Aura Glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-radial-gradient from-[#c5a880]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-radial-gradient from-indigo-950/20 via-transparent to-transparent blur-3xl pointer-events-none" />

                {/* Header Celestial Badge (PROMINENT USER NAME) */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5 relative z-10">
                  <div className="flex flex-col text-left gap-0.5">
                    {formData.name ? (
                      <span className="text-lg md:text-xl font-serif font-bold text-[#f4f3f1] tracking-wider uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
                        {formData.name}'S BLUEPRINT
                      </span>
                    ) : null}
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
                      Personal Cosmic Matrix
                    </span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    Node {coreArchetypeNum} Alignment
                  </span>
                </div>

                {/* Free Primary Insight (Poetic & Deep) */}
                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c5a880]/80">
                    Core Persona Unlocked
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl font-normal text-[#f4f3f1] tracking-wide leading-snug">
                    {coreArchetypeTitle}
                  </h3>
                  <p className="text-neutral-300 font-light leading-relaxed text-base md:text-lg italic pt-1 border-l-2 border-[#c5a880]/40 pl-4 my-1">
                    "{coreArchetypeTeaser}"
                  </p>
                </div>

                {/* Subconscious Shadow Gate (Matches 100% Real 4-Chapter Report Structure) */}
                <div className="flex flex-col gap-4 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-7 relative z-10 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between text-xs font-mono text-[#c5a880] uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                      <span>✦</span> Complete Report Structure
                    </span>
                    <span className="text-amber-300/90 font-mono text-[10px] uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      Partial Reveal
                    </span>
                  </div>

                  {/* Real Section 1 - Revealed Core Archetype */}
                  <div className="flex items-start gap-3 text-xs md:text-sm text-[#f4f3f1] font-mono py-2 border-b border-white/5">
                    <span className="text-[#c5a880] font-bold shrink-0">✦</span>
                    <span><strong>Section 1 (Unlocked):</strong> Core Archetype — {coreArchetypeTitle} calibrated.</span>
                  </div>

                  {/* Real Section 2 - Encrypted Ages 21-40 */}
                  <div className="relative py-3 px-3.5 bg-black/40 rounded-xl border border-white/5 overflow-hidden select-none">
                    <div className="flex items-center justify-between text-xs text-neutral-300 font-mono mb-1.5">
                      <span className="font-medium text-[#ecebe7]">Section 2: Decoding Ages 21–40</span>
                      <span className="text-[#c5a880] font-mono text-[10px] uppercase tracking-widest">🔒 Encrypted</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-400 blur-[6px] opacity-30 font-mono leading-relaxed pointer-events-none">
                      Redirection codes, relational alignment windows, and career breakthrough timing calculated from your foundation nodes...
                    </p>
                  </div>

                  {/* Real Section 3 - Encrypted Ages 41-60 */}
                  <div className="relative py-3 px-3.5 bg-black/40 rounded-xl border border-white/5 overflow-hidden select-none">
                    <div className="flex items-center justify-between text-xs text-neutral-300 font-mono mb-1.5">
                      <span className="font-medium text-[#ecebe7]">Section 3: Decoding Ages 41–60</span>
                      <span className="text-[#c5a880] font-mono text-[10px] uppercase tracking-widest">🔒 Encrypted</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-400 blur-[6px] opacity-30 font-mono leading-relaxed pointer-events-none">
                      Peak wealth accumulation cycles, leadership authority codes, and stability milestone coordinates...
                    </p>
                  </div>

                  {/* Real Section 4 - Encrypted Ages 61-80 */}
                  <div className="relative py-3 px-3.5 bg-black/40 rounded-xl border border-white/5 overflow-hidden select-none">
                    <div className="flex items-center justify-between text-xs text-neutral-300 font-mono mb-1.5">
                      <span className="font-medium text-[#ecebe7]">Section 4: Decoding Ages 61–80</span>
                      <span className="text-[#c5a880] font-mono text-[10px] uppercase tracking-widest">🔒 Encrypted</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-400 blur-[6px] opacity-30 font-mono leading-relaxed pointer-events-none">
                      Harvest cycles, legacy completion roadmap, and wisdom sharing codes...
                    </p>
                  </div>
                </div>

                {/* Celestial Luxury CTA Button (Clean Button without Name in Button Text) */}
                <div className="w-full flex flex-col gap-4 pt-2 relative z-10">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
                    <span className="text-[11px] text-[#c5a880] uppercase tracking-widest">
                      Personalized Digital Access
                    </span>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-[11px] text-neutral-400 hover:text-[#c5a880] underline font-mono tracking-wider transition-colors"
                    >
                      View Chapter Breakdown ➔
                    </button>
                  </div>

                  <Link 
                    to="/pay"
                    id="static-pay-button"
                    className="w-full text-center p-4 md:p-5 bg-gradient-to-r from-[#f4f3f1] via-white to-[#ecebe7] text-neutral-950 font-serif font-medium rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-[0_0_35px_rgba(197,168,128,0.25)] text-sm md:text-base tracking-wider uppercase"
                  >
                    Reveal My Full Shadow & Gifts · $9.90 USD
                  </Link>
                  
                  <p className="text-[10px] md:text-[11px] text-neutral-500 text-center uppercase font-mono tracking-widest pt-1">
                    Instant Digital Access · 100% Private & Confidential · Guaranteed Authentic Report
                  </p>
                </div>
              </div>

              {/* ARCHETYPES DIALOG */}
              <div className="w-full max-w-[850px] mx-auto mt-16 border-t border-neutral-900 pt-16">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-serif text-white mb-2">The Nine Primary Archetypes</h3>
                  <p className="text-neutral-400 text-sm font-mono uppercase">
                    THE COMPLETE CIRCLE OF PYTHAGOREAN COORDINATES
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">1 — The Origin</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">A born initiator with a clear North Star, you move first, decide fast, and set the weather for everyone else.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">2 — The Mediator</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You read the room, soften conflict, and make connection feel like home. Kindness is your architecture for trust.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">3 — The Muse</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You light up spaces with wit and bright ideas. Prosperity finds you when play marries practice.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">4 — The Builder</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You turn chaos into systems, deadlines into deliveries, and promises into ledgers.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">5 — The Voyager</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You learn by living, persuade by experience, and blossom when horizons stay open.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">6 — The Healer</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You stabilize teams, beautify spaces, and keep promises long after the applause.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">7 — The Sage</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You hunt the pattern under the pattern, trust evidence, and speak only when it counts.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">8 — The Power</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">You orchestrate resources, hold pressure, and deliver outcomes with receipts.</p>
                  </div>
                  <div className="border border-neutral-900 rounded-xl p-5 bg-neutral-950/20 md:col-span-2">
                    <div className="font-serif text-[#ecebe7] font-semibold text-lg mb-2">9 — The Empath</div>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed col-span-2">You dream of a kinder world and move people through meaning.</p>
                  </div>
                </div>
              </div>

              {/* Reset view back link */}
              <div className="text-center mt-12 pb-6 border-b border-neutral-900">
                <button
                  onClick={handleReset}
                  className="text-sm font-mono text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                >
                  ← Reset form to compute other birthday coordinates
                </button>
              </div>
            </div>
          </section>
          {showResultFooter && renderFooter()}
        </motion.div>
      )}
    </AnimatePresence>
  </main>



      {/* COMPANION CHAPTER PREVIEW DETAIL MODAL */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tri={triangleData}
      />

      {/* MOBILE STICKY FLOATING CTA */}
      {showResultSection ? null : (
        <div 
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[360px] md:hidden transition-all duration-500 ease-in-out ${
            showStickyBtn ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-12 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              const el = document.getElementById("ritual-form-anchor");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full p-4 border border-[#e6e6e2]/20 rounded-xl text-[#000] bg-[#f3f3f1] font-semibold text-center shadow-[0_10px_35px_rgba(0,0,0,0.5)] active:scale-95 transition-all text-xs uppercase tracking-widest cursor-pointer"
          >
            Decode My Coordinates
          </button>
        </div>
      )}
    </div>
  );
}
