import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LIFE_PATH_DIR = path.join(PUBLIC_DIR, 'life-path');

// Complete Persona Map from report-print.html
const PERSONA_MAP = {
  "1": {
    "title": "The Origin",
    "kicker": "Initiator & Leader",
    "text": "A born initiator with a clear North Star, you move first, decide fast, and set the weather for everyone else. People follow because your clarity cuts through noise; your real mastery begins when you trade control for clean boundaries and transform raw drive into leadership others can trust for the long run. You don’t just win—you define the game and invite others into a field you’ve designed with intention.\n\nLead with questions that enroll ownership (“How would you do it?”), choose one audacious priority per cycle, and slow pivotal decisions by a single breath so wisdom can catch up to will. Practice delegation as energetic hygiene: hand off what doesn’t need your signature touch and set acceptance criteria so standards stay high. In love, signal safety through clarity rather than pressure; at work, convert quick wins into assets—documentation, brand equity, repeatable funnels.\n\nMorning intent: hand on heart—“I create safety through clarity, not control.”\nAffirmation: I lead with courage and clarity, and I welcome support."
  },
  "2": {
    "title": "The Mediator",
    "kicker": "Peacemaker & Attuner",
    "text": "You read the room, soften conflict, and make connection feel like home. Your kindness isn’t weakness—it’s architecture for trust—but it turns heavy when you trade your needs for harmony. Balance, in your code, isn’t 50/50; it’s honest and mutual. When you include yourself in the circle of care, your presence becomes both gentle and powerful.\n\nName your need first, then collaborate; your “no” protects the sanctity of your “yes.” Co-design agreements in love (how we argue, how we repair, alone time) and price invisible labor at work—your care creates value and should be valued. Build a weekly “decision solo”—two quiet hours where you choose without polling the room; then tell the room.\n\nAn evening ritual—shoulders soft, jaw clenched, one clear boundary spoken aloud—resets your field.\nAffirmation: My compassion includes me; my boundaries are love in action."
  },
  "3": {
    "title": "The Muse",
    "kicker": "Creator & Broadcaster",
    "text": "You light up spaces with wit and bright ideas. Applause finds you easily; prosperity finds you when play marries practice and inspiration learns to land. You’re the natural broadcaster—stories become momentum, and momentum becomes culture when your spark is shaped into finished work.\n\nChoose one “canon project” for 90 days and make it unmissable: daily protected creation time before metrics or messages; a public shipping cadence so ideas harden into artifacts—videos, designs, courses. Schedule novelty instead of chasing it (exploration days, travel sprints) so freshness and commitment can co-exist. In love, keep the spark by creating together; at work, turn heat into long-tail assets (evergreen content, licensing, memberships).\n\nA three-minute free-write before drafting turns static into signal.\nAffirmation: My inspiration is steady; my creations land and last."
  },
  "4": {
    "title": "The Builder",
    "kicker": "Orchestrator & Founder",
    "text": "You turn chaos into systems, deadlines into deliveries, and promises into ledgers. People relax around you because things get finished. Yet safety isn’t stasis; growth begins where your structure meets smart risk and a little play. Order, in your world, isn’t a cage—it’s the runway for bigger flights.\n\nKeep your engine steady while piloting small, asymmetric bets: reserve 5% of time or budget for high-potential experiments and run a 90-day SOP audit to prevent calcification. Make progress visible—roadmaps, Kanban, working demos—so influence grows with reliability. In love, ritualize romance (predictable rhythms plus tiny surprises); in money, upgrade “saving” into allocation—emergency, growth, joy.\n\nWeekly close: two lists—what shipped, what to simplify—so order stays alive.\nAffirmation: I create freedom through structure and grow safely through smart risk."
  },
  "5": {
    "title": "The Voyager",
    "kicker": "Explorer & Persuader",
    "text": "You learn by living, persuade by experience, and blossom when horizons stay open. The medicine is paradoxical: design freedom into your commitments so adventure fuels mastery instead of escaping it. When choice is honored on purpose, you become consistent without feeling confined.\n\nCap open projects at three and refuse a fourth until one lands clean. Write “adventure clauses” into life and love—solo days, personal quests, latitude to roam—so intimacy breathes. Swap impulse spending for an “experience investment ledger”: trips and trainings that expand skills, stories, and status. Movement is your reset button—walks, dance, travel sprints—so restlessness turns into renewal. At work, you’re a market scout; ship recaps and frameworks so exploration compounds.\n\nAffirmation: Freedom is my responsibility; I choose and I complete."
  },
  "6": {
    "title": "The Healer",
    "kicker": "Protector & Harmonizer",
    "text": "You stabilize teams, beautify spaces, and keep promises long after the applause. Your love multiplies when generosity stands beside boundaries and worth meets pricing—care is not free; it’s priceless and therefore must be priced. When you protect your energy, your nurture becomes renewable.\n\nRetire the inner ledger for a week and notice where help turns into a hidden invoice; then craft boundary scripts that are kind and clear. In partnership, make invisible labor visible—co-create a “home & emotional workload” map and rebalance seasonally. Professionally, charge for outcomes, not hours, and design packages that include care without burning you out.\n\nMorning rule: one act of self-nourishment before serving anyone else.\nAffirmation: I nourish the world and protect myself with clear, loving limits."
  },
  "7": {
    "title": "The Sage",
    "kicker": "Analyst & Intuitive",
    "text": "You hunt the pattern under the pattern, trust evidence, and speak only when it counts. Insight is your currency; action is your amplifier. Perfection delays impact—truth wants a body. When you give your conclusions legs, your accuracy becomes influence.\n\nAdopt the 72-hour rule: any conclusion must trigger one smallest executable next step within three days. Keep an Evidence Journal separating data from hunch so your intuition gets cleaner, not colder. Alternate “debate days” with “no-analysis days” in love so hearts get equal airtime. Professionally, design controlled experiments—pilot, measure, iterate—and publish your frameworks; authority accrues to those who share their method.\n\nNight ritual: write three questions, sleep on them, let the subconscious compute.\nAffirmation: I honor evidence and act before perfection is required."
  },
  "8": {
    "title": "The Power",
    "kicker": "Strategist & Legacy Builder",
    "text": "You orchestrate resources, hold pressure, and deliver outcomes with receipts. Control is a fine starter; trust is the only finisher. You scale when you share power and build assets that work while you rest. Lead like an engine room: steady, precise, and designed for endurance.\n\nSet a quarterly failure budget and run experiments bold enough to teach. Delegate 30% with crisp standards and review cadence; your job becomes orchestration, not constant intervention. Hold one weekly meeting about people, not metrics—safety is the soil of performance. Move from income to assets: equity, brand, media, systems, and leaders you’ve grown. In love, codify shared goals and money rhythms; sovereignty plus alliance beats dominance every time.\n\nAffirmation: I create value with power and multiply it by trust."
  },
  "9": {
    "title": "The Empath",
    "kicker": "Synthesizer & Humanitarian",
    "text": "You dream of a kinder world and move people through meaning. The work is loving without leaking. Your heart becomes inexhaustible when your edges are honored and your giving is structured to sustain you too. Compassion expands when it’s carried by design.\n\nTranslate ideals into three executable steps and one metric; swap one unpaid obligation for one paid, values-aligned service. In relationships, write boundaries into the bond—help limits, alone time, emotional budgets—and let repair be a practice, not a punishment. Professionally, choose impact fields but refuse “discounts in the name of love”; charge fairly, deliver deeply, and build coalitions that share the load. Evening ritual: gratitude, release, recommit—three lines, then rest.\n\nAffirmation: My heart is vast, and my boundaries make it sustainable."
  }
};

function parseText(text) {
  const paragraphs = text.split('\n\n');
  const description = paragraphs[0] || '';
  const advice = [];
  let ritualText = '';
  let affirmationText = '';

  for (let i = 1; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (p.startsWith('Affirmation:')) {
      affirmationText = p.replace('Affirmation:', '').trim();
    } else if (
      p.toLowerCase().includes('intent:') || 
      p.toLowerCase().includes('ritual:') || 
      p.toLowerCase().includes('ritual—') || 
      p.toLowerCase().includes('intent—') ||
      p.toLowerCase().includes('rule:')
    ) {
      ritualText = p;
    } else {
      advice.push(p);
    }
  }

  return {
    description,
    advice: advice.join('\n\n'),
    ritual: ritualText,
    affirmation: affirmationText
  };
}

function generateHTML(num, data) {
  const parsed = parseText(data.text);
  const title = `Life Path Number ${num} Meaning: Core Traits & Career | OMNIORA`;
  const description = `Discover the personality traits, career paths, love compatibility, and daily rituals for Life Path Number ${num} (${data.title}). Unlock your cosmic blueprint.`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="theme-color" content="#0b0b0c" />
  <link rel="canonical" href="https://omniora13.com/life-path/${num}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://omniora13.com/life-path/${num}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://omniora13.com/life-path/${num}" />
  <meta property="twitter:title" content="${title}" />
  <meta property="twitter:description" content="${description}" />

  <style>
    :root {
      --brand: #000000; --bg: #000000; --ink: #f3f3f1; --ink-dim: #c9c9c5;
      --frame: #1b1b1b; --radius: 14px; --shadow: 0 10px 30px rgba(0,0,0,.45); --maxw: 1120px;
      --pearl-1: #f4f3f1; --pearl-2: #e7e5e2; --inkwash-2: #dcd6e8;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; background: var(--bg); color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6; letter-spacing: .01em;
    }
    .serif { font-family: "Iowan Old Style", "Georgia", "Garamond", "Times New Roman", serif; }
    h1, h2, h3 { margin: 0 0 1rem 0; font-weight: 500; letter-spacing: .01em; }
    h1 { font-size: clamp(32px, 5.5vw, 54px); line-height: 1.1; }
    h2 { font-size: clamp(24px, 4vw, 32px); line-height: 1.2; }
    a { color: inherit; text-decoration: none; }
    .container { width: 100%; max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
    
    /* Navigation */
    .nav {
      position: fixed; inset: 0 0 auto 0; height: 60px; z-index: 30;
      display: flex; align-items: center;
      background: linear-gradient(180deg, var(--brand), color-mix(in oklab, var(--brand), #000 35%));
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; gap: 12px; align-items: center; font-variant: small-caps; letter-spacing: .08em; cursor: pointer; }
    .logo {
      width: 26px; height: 26px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fff 0%, #f4f4f4 16%, transparent 38%),
                 conic-gradient(from 220deg, rgba(255,255,255,.6), rgba(255,255,255,.15), rgba(255,255,255,0));
      box-shadow: 0 0 0 1px rgba(255,255,255,.15), inset 0 0 18px rgba(255,255,255,.12);
    }
    .nav-right { display: flex; gap: 16px; align-items: center; }
    .nav-link {
      display: inline-flex; align-items: center; justify-content: center; padding: 8px 10px;
      font-size: 14px; letter-spacing: .05em; transition: .25s;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      text-transform: uppercase;
    }
    .nav-link:hover { transform: translateY(-1px); text-decoration: underline; text-underline-offset: 4px; }
    
    /* Star Canvas */
    canvas#galaxy { position: fixed; inset: 0; z-index: 0; pointer-events: none; filter: contrast(105%) brightness(102%); }
    
    /* Main Layout */
    .main-wrap { position: relative; z-index: 2; min-height: 100vh; padding-top: 100px; padding-bottom: 64px; }
    .content-grid { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 800px; margin: 0 auto; }
    
    .page-head { text-align: center; margin-bottom: 12px; }
    .kicker { font-size: 13px; letter-spacing: .18em; font-variant: small-caps; color: var(--ink-dim); text-transform: uppercase; margin-bottom: 6px; }
    .page-title {
      background: linear-gradient(180deg, var(--pearl-1) 0%, var(--pearl-2) 45%, var(--inkwash-2) 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
      text-shadow: 0 1px 0 rgba(255,255,255,.06), 0 10px 30px rgba(0,0,0,.35);
      margin: 0;
    }
    
    /* Cards */
    .card {
      padding: 28px 32px; border: 1px solid var(--frame); border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0)); box-shadow: var(--shadow);
    }
    .card h2 { font-family: "Iowan Old Style", "Georgia", serif; margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; }
    .number-display {
      display: flex; justify-content: center; align-items: center; margin: 20px 0;
    }
    .big-num {
      font-size: 120px; line-height: 1; font-weight: 900; font-family: "Iowan Old Style", "Georgia", serif;
      background: linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.1) 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    
    .text-block { color: var(--ink-dim); font-size: 16px; line-height: 1.8; margin-bottom: 24px; }
    .text-block p { margin: 0 0 16px 0; }
    .text-block p strong { color: var(--ink); }
    
    .section-title { font-size: 18px; font-weight: 600; color: var(--ink); margin: 28px 0 12px; font-family: "Iowan Old Style", "Georgia", serif; }
    .section-content { color: var(--ink-dim); font-size: 15px; line-height: 1.7; margin-bottom: 20px; white-space: pre-wrap; }
    
    /* Callouts */
    .callout {
      border: 1px dashed rgba(255,255,255,.18); border-radius: 12px; background: rgba(255,255,255,.02);
      padding: 20px; margin-top: 24px;
    }
    .callout-title { font-weight: 700; color: var(--ink); margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .callout-body { color: var(--ink-dim); font-size: 14px; line-height: 1.6; }
    
    /* CTA Card */
    .cta-card {
      text-align: center; border: 1px solid var(--frame); border-radius: var(--radius);
      background: radial-gradient(circle at top, rgba(255,255,255,0.06) 0%, transparent 70%);
      padding: 40px 32px; margin-top: 20px; box-shadow: var(--shadow);
    }
    .cta-title { font-family: "Iowan Old Style", "Georgia", serif; font-size: 24px; margin-bottom: 12px; }
    .cta-desc { color: var(--ink-dim); font-size: 15px; max-width: 500px; margin: 0 auto 28px; }
    
    .btn-group { display: flex; flex-direction: column; gap: 12px; max-width: 380px; margin: 0 auto; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 20px; border-radius: 10px; text-decoration: none; cursor: pointer; user-select: none;
      font-weight: 600; transition: opacity .2s, transform 0.1s; font-size: 15px;
    }
    .btn.primary { background: #ffffff; color: #000000; border: 1px solid #ffffff; }
    .btn.secondary { background: transparent; color: var(--ink); border: 1px solid #3a3a3a; }
    .btn:active { transform: translateY(1px); }
    .btn:hover { opacity: 0.9; }

    /* Footer */
    .footer {
      border-top: 1px solid rgba(255,255,255,.08); padding: 40px 0 30px; margin-top: 80px;
      background: linear-gradient(180deg, color-mix(in oklab, var(--brand), #000 20%), var(--brand));
    }
    .footer .row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; align-items: start; }
    .footer .brand { font-size: 22px; }
    .footer a { color: #fff; text-decoration: none; letter-spacing: .05em; font-size: 14px; }
    .footer a:hover { text-decoration: underline; text-underline-offset: 3px; }
    .footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
    .footer .right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: .08em; }
    @media (max-width: 980px) {
      .footer .row { grid-template-columns: 1fr; }
      .footer .right { align-items: flex-start; }
    }
    .social.icons-only { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; gap: 22px; }
    .social.icons-only a { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; opacity: .9; transition: transform .2s ease, opacity .2s ease; }
    .social.icons-only a:hover { opacity: 1; transform: translateY(-1px) scale(1.05); }
    .social.icons-only svg { width: 24px; height: 24px; display: block; }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="container nav-inner">
      <a class="brand serif" href="/index.html">
        <div class="logo" aria-hidden="true"></div>
        <span>OMNIORA</span>
      </a>
      <div class="nav-right">
        <a class="nav-link" href="/what-is-omniora.html">What is OMNIORA</a>
        <a class="nav-link" href="/shop.html">Shop</a>
      </div>
    </div>
  </nav>

  <canvas id="galaxy" aria-hidden="true"></canvas>

  <main class="main-wrap">
    <div class="container content-grid">
      <header class="page-head">
        <span class="kicker">Life Path Number ${num}</span>
        <h1 class="page-title serif">${data.title}</h1>
      </header>

      <section class="card">
        <div class="number-display">
          <div class="big-num">${num}</div>
        </div>
        
        <h2>The Archetypal Essence</h2>
        <div class="text-block">
          <p>${parsed.description.replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section-title">Practical Guidance & Action Items</div>
        <div class="section-content">${parsed.advice}</div>

        ${parsed.ritual ? `
        <div class="callout">
          <div class="callout-title">Daily Practice / Ritual</div>
          <div class="callout-body">${parsed.ritual}</div>
        </div>
        ` : ''}

        ${parsed.affirmation ? `
        <div class="callout">
          <div class="callout-title">Cosmic Affirmation</div>
          <div class="callout-body">“${parsed.affirmation}”</div>
        </div>
        ` : ''}
      </section>

      <section class="cta-card">
        <h2 class="cta-title">Is this your path?</h2>
        <p class="cta-desc">
          Your core archetype is just the entry point. The OMNIORA Life Code uses your complete date of birth to compile a multi-dimensional blueprint covering early imprints, secondary code frequencies, and relationship compatibility.
        </p>
        <div class="btn-group">
          <a class="btn primary" href="/index.html">🏠 Calculate Your Life Code for Free</a>
          <a class="btn secondary" href="/index.html#unlock">🔒 Unlock Your Complete PDF Report</a>
        </div>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="container row">
      <div>
        <div class="brand serif"><span class="logo" aria-hidden="true"></span><span>OMNIORA</span></div>
        <p style="font-size:13px;color:var(--ink-dim);margin-top:8px;">Numerology & Mysticism<br/>Blending East & West</p>
      </div>
      <div>
        <ul class="mono">
          <li><a href="/about.html">ABOUT</a></li>
          <li><a href="/faq.html">FAQ</a></li>
          <li><a href="/contact.html">CONTACT</a></li>
          <li><a href="/privacy.html">PRIVACY</a></li>
        </ul>
      </div>
      <div class="right mono">
        <div class="social icons-only">
          <a href="https://www.instagram.com/omnioraxyz/" target="_blank" rel="noopener" aria-label="Instagram @omnioraxyz">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
            </svg>
          </a>
          <a href="https://x.com/OmnioraFate" target="_blank" rel="noopener" aria-label="X (Twitter) @OmnioraFate">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18.244 3H21l-6.51 7.438L22.5 21h-5.5l-4.3-5.2L7.5 21H3l6.9-7.88L1.5 3h5.6l3.94 4.77L18.244 3zm-1.006 16h1.4L8.94 5H7.536L17.238 19z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@omniora13.com" target="_blank" rel="noopener" aria-label="TikTok @omniora13.com">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M14.5 3v4.2a6 6 0 0 0 4 1.5v3a9 9 0 0 1-4-1.1V16a5 5 0 1 1-5-5c.34 0 .67.03 1 .1V14a2 2 0 1 0 2 2V3h2z"/>
            </svg>
          </a>
        </div>
        <small style="color:var(--ink-dim);margin-top:8px;">© 2025 OMNIORA</small>
      </div>
    </div>
  </footer>

  <script>
    (function initGalaxy(){
      const c = document.getElementById('galaxy'); if (!c) return;
      const ctx = c.getContext('2d'); let w,h,dpr=Math.min(devicePixelRatio||1,2);
      const stars=[]; const COUNT=180; const R = 400; const ATTRACT_MULT = 3;
      let mouse={x:null,y:null}, Rpx=R*dpr; const rnd=(a,b)=>a+Math.random()*(b-a);
      function resize(){ w=c.width=innerWidth*dpr; h=c.height=innerHeight*dpr; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; Rpx=R*dpr; }
      function init(){ stars.length=0; for(let i=0;i<COUNT;i++){ stars.push({x:rnd(0,w),y:rnd(0,h),r:rnd(.4,1.4)*dpr,a:rnd(.35,.85),z:rnd(.2,1)});} }
      addEventListener('mousemove', e=>{ mouse.x=e.clientX*dpr; mouse.y=e.clientY*dpr; });
      addEventListener('mouseleave', ()=>{ mouse.x=null; mouse.y=null; });
      function draw(){
        ctx.clearRect(0,0,w,h);
        const g=ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.4,Math.max(w,h)*.7);
        g.addColorStop(0,'rgba(255,255,255,0.02)'); g.addColorStop(1,'rgba(0,0,0,0.35)');
        ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
        for(const s of stars){
          const baseV=s.z*0.12; s.y+=baseV; if(s.y>h) s.y-=h;
          if(mouse.x!=null){
            const dx=mouse.x-s.x,dy=mouse.y-s.y,d2=dx*dx+dy*dy;
            if(d2<Rpx*Rpx){ const d=Math.sqrt(d2)||1, inf=1-(d/Rpx), ux=dx/d, uy=dy/d;
              s.x+=ux*baseV*2*ATTRACT_MULT*inf; s.y+=uy*baseV*2*ATTRACT_MULT*inf; }
          }
          if(s.x<0) s.x+=w; if(s.x>w) s.x-=w; if(s.y<0) s.y+=h; if(s.y>h) s.y-=h;
          ctx.globalAlpha=s.a+Math.sin((s.x+s.y)*.0015)*.08;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='#ffffff'; ctx.fill();
          if(s.r>1.2){ ctx.globalAlpha=.25; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*2.2,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.10)'; ctx.fill(); }
        }
        ctx.globalAlpha=1; requestAnimationFrame(draw);
      }
      function onResize(){ resize(); init(); }
      resize(); init(); draw(); addEventListener('resize', onResize);
    })();
  </script>
  <!-- Vercel Web Analytics & Speed Insights -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>
`;
}

// Generate the pages
console.log('Generating Programmatic SEO Pages for OMNIORA...');

for (const [num, data] of Object.entries(PERSONA_MAP)) {
  const dirPath = path.join(LIFE_PATH_DIR, num);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const htmlContent = generateHTML(num, data);
  const filePath = path.join(dirPath, 'index.html');
  fs.writeFileSync(filePath, htmlContent, 'utf8');
  console.log(`Generated: ${filePath}`);
}

// Generate sitemap.xml
const staticPages = [
  '',
  '/about.html',
  '/faq.html',
  '/contact.html',
  '/privacy.html',
  '/what-is-omniora.html',
  '/shop.html'
];

const lifePathPages = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `/life-path/${n}`);

const allUrls = [...staticPages, ...lifePathPages];
const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>https://omniora13.com${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/life-path') ? '0.8' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent, 'utf8');
console.log('Generated: public/sitemap.xml');

// Generate robots.txt
const robotsContent = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: https://omniora13.com/sitemap.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsContent, 'utf8');
console.log('Generated: public/robots.txt');

console.log('Programmatic SEO Page Generation Complete!');
