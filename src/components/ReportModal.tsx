import React, { useEffect } from "react";
import { TriangleData } from "../types";
import { Link } from "react-router-dom";

export const PERSONA_MAP: Record<string, { title: string; text: string }> = {
  "1": {
    "title": "The Origin",
    "text": "A born initiator with a clear North Star, you move first, decide fast, and set the weather for everyone else. People follow because your clarity cuts through noise; your real mastery begins when you trade control for clean boundaries and transform raw drive into leadership others can trust for the long run. You don’t just win—you define the game and invite others into a field you’ve designed with intention.\n\nLead with questions that enroll ownership (“How would you do it?”), choose one audacious priority per cycle, and slow pivotal decisions by a single breath so wisdom can catch up to will. Practice delegation as energetic hygiene: hand off what doesn’t need your signature touch and set acceptance criteria so standards stay high. In love, signal safety through clarity rather than pressure; at work, convert quick wins into assets—documentation, brand equity, repeatable funnels.\n\nMorning intent: hand on heart—“I create safety through clarity, not control.”\nAffirmation: I lead with courage and clarity, and I welcome support."
  },
  "2": {
    "title": "The Mediator",
    "text": "You read the room, soften conflict, and make connection feel like home. Your kindness isn’t weakness—it’s architecture for trust—but it turns heavy when you trade your needs for harmony. Balance, in your code, isn’t 50/50; it’s honest and mutual. When you include yourself in the circle of care, your presence becomes both gentle and powerful.\n\nName your need first, then collaborate; your “no” protects the sanctity of your “yes.” Co-design agreements in love (how we argue, how we repair, alone time) and price invisible labor at work—your care creates value and should be valued. Build a weekly “decision solo”—two quiet hours where you choose without polling the room; then tell the room.\n\nAn evening ritual—shoulders soft, jaw unclenched, one clear boundary spoken aloud—resets your field.\nAffirmation: My compassion includes me; my boundaries are love in action."
  },
  "3": {
    "title": "The Muse",
    "text": "You light up spaces with wit and bright ideas. Applause finds you easily; prosperity finds you when play marries practice and inspiration learns to land. You’re the natural broadcaster—stories become momentum, and momentum becomes culture when your spark is shaped into finished work.\n\nChoose one “canon project” for 90 days and make it unmissable: daily protected creation time before metrics or messages; a public shipping cadence so ideas harden into artifacts—videos, designs, courses. Schedule novelty instead of chasing it (exploration days, travel sprints) so freshness and commitment can co-exist. In love, keep the spark by creating together; at work, turn heat into long-tail assets (evergreen content, licensing, memberships).\n\nA three-minute free-write before drafting turns static into signal.\nAffirmation: My inspiration is steady; my creations land and last."
  },
  "4": {
    "title": "The Builder",
    "text": "You turn chaos into systems, deadlines into deliveries, and promises into ledgers. People relax around you because things get finished. Yet safety isn’t stasis; growth begins where your structure meets smart risk and a little play. Order, in your world, isn’t a cage—it’s the runway for bigger flights.\n\nKeep your engine steady while piloting small, asymmetric bets: reserve 5% of time or budget for high-potential experiments and run a 90-day SOP audit to prevent calcification. Make progress visible—roadmaps, Kanban, working demos—so influence grows with reliability. In love, ritualize romance (predictable rhythms plus tiny surprises); in money, upgrade “saving” into allocation—emergency, growth, joy.\n\nWeekly close: two lists—what shipped, what to simplify—so order stays alive.\nAffirmation: I create freedom through structure and grow safely through smart risk."
  },
  "5": {
    "title": "The Voyager",
    "text": "You learn by living, persuade by experience, and blossom when horizons stay open. The medicine is paradoxical: design freedom into your commitments so adventure fuels mastery instead of escaping it. When choice is honored on purpose, you become consistent without feeling confined.\n\nCap open projects at three and refuse a fourth until one lands clean. Write “adventure clauses” into life and love—solo days, personal quests, latitude to roam—so intimacy breathes. Swap impulse spending for an “experience investment ledger”: trips and trainings that expand skills, stories, and status. Movement is your reset button—walks, dance, travel sprints—so restlessness turns into renewal. At work, you’re a market scout; ship recaps and frameworks so exploration compounds.\n\nAffirmation: Freedom is my responsibility; I choose and I complete."
  },
  "6": {
    "title": "The Healer",
    "text": "You stabilize teams, beautify spaces, and keep promises long after the applause. Your love multiplies when generosity stands beside boundaries and worth meets pricing—care is not free; it’s priceless and therefore must be priced. When you protect your energy, your nurture becomes renewable.\n\nRetire the inner ledger for a week and notice where help turns into a hidden invoice; then craft boundary scripts that are kind and clear. In partnership, make invisible labor visible—co-create a “home & emotional workload” map and rebalance seasonally. Professionally, charge for outcomes, not hours, and design packages that include care without burning you out.\n\nMorning rule: one act of self-nourishment before serving anyone else.\nAffirmation: I nourish the world and protect myself with clear, loving limits."
  },
  "7": {
    "title": "The Sage",
    "text": "You hunt the pattern under the pattern, trust evidence, and speak only when it counts. Insight is your currency; action is your amplifier. Perfection delays impact—truth wants a body. When you give your conclusions legs, your accuracy becomes influence.\n\nAdopt the 72-hour rule: any conclusion must trigger one smallest executable next step within three days. Keep an Evidence Journal separating data from hunch so your intuition gets cleaner, not colder. Alternate “debate days” with “no-analysis days” in love so hearts get equal airtime. Professionally, design controlled experiments—pilot, measure, iterate—and publish your frameworks; authority accrues to those who share their method.\n\nNight ritual: write three questions, sleep on them, let the subconscious compute.\nAffirmation: I honor evidence and act before perfection is required."
  },
  "8": {
    "title": "The Power",
    "text": "You orchestrate resources, hold pressure, and deliver outcomes with receipts. Control is a fine starter; trust is the only finisher. You scale when you share power and build assets that work while you rest. Lead like an engine room: steady, precise, and designed for endurance.\n\nSet a quarterly failure budget and run experiments bold enough to teach. Delegate 30% with crisp standards and review cadence; your job becomes orchestration, not constant intervention. Hold one weekly meeting about people, not metrics—safety is the soil of performance. Move from income to assets: equity, brand, media, systems, and leaders you’ve grown. In love, codify shared goals and money rhythms; sovereignty plus alliance beats dominance every time.\n\nAffirmation: I create value with power and multiply it by trust."
  },
  "9": {
    "title": "The Empath",
    "text": "You dream of a kinder world and move people through meaning. The work is loving without leaking. Your heart becomes inexhaustible when your edges are honored and your giving is structured to sustain you too. Compassion expands when it’s carried by design.\n\nTranslate ideals into three executable steps and one metric; swap one unpaid obligation for one paid, values-aligned service. In relationships, write boundaries into the bond—help limits, alone time, emotional budgets—and let repair be a practice, not a punishment. Professionally, choose impact fields but refuse “discounts in the name of love”; charge fairly, deliver deeply, and build coalitions that share the load. Evening ritual: gratitude, release, recommit—three lines, then rest.\n\nAffirmation: My heart is vast, and my boundaries make it sustainable."
  }
};

export const PERSONA_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(PERSONA_MAP).map(([id, p]) => [id, p.title])
);

export const PERSONA_TEASERS: Record<string, string> = Object.fromEntries(
  Object.entries(PERSONA_MAP).map(([id, p]) => [id, p.text.split("\n")[0]])
);

export const CODE_TITLES: Record<string, string> = {
  "112": "Execution & Communication",
  "123": "Expression & Authority",
  "134": "Creativity & Synthesis",
  "145": "Stability & Goals",
  "156": "Wealth Through Expansion",
  "167": "Wisdom & Charisma",
  "178": "Leadership & Responsibility",
  "189": "Responsibility & Results",
  "191": "Achievement & Independence",
  "213": "Expression & Leadership",
  "224": "Patience & Planning",
  "235": "Goals & Communication",
  "246": "Oratory & Wealth",
  "257": "Principles & Popularity",
  "268": "Wisdom & Career",
  "279": "Initiative & Benefactors",
  "281": "Pressure & Achievement",
  "292": "Wisdom & Strategy",
  "314": "Action & Reflection",
  "325": "Passion & Communication",
  "336": "Action & Wealth",
  "347": "Leadership & Action",
  "358": "Negotiation & Goals",
  "369": "Intelligence & Wealth",
  "371": "Talent & Connections",
  "382": "Responsibility & Communication",
  "393": "Talent & Practice",
  "415": "Thinking & Planning",
  "426": "Expression & Wealth",
  "437": "Strategy & Action",
  "448": "Flexibility & Wisdom",
  "459": "Direction & Results",
  "461": "Wealth & Wisdom",
  "472": "Strategy & Support",
  "483": "Execution & Responsibility",
  "494": "Strategy & Achievement",
  "516": "Diligence & Exploration",
  "527": "Goals & Expression",
  "538": "Action & Influence",
  "549": "Thoroughness & Results",
  "551": "Independence & Achievement",
  "562": "Wealth & Value",
  "573": "Benefactors & Opportunities",
  "584": "Mission & Planning",
  "595": "Courage & Breakthrough",
  "617": "Wisdom & Perception",
  "628": "Oratory & Wealth",
  "639": "Investment & Adventure",
  "641": "Planning & High Standards",
  "652": "Caution & Preservation",
  "663": "Investment & Risk",
  "674": "Generosity & Benefactors",
  "685": "Effort & Virtue",
  "696": "Investment & Adventure",
  "718": "Independence & Leadership",
  "729": "Attraction & Benefactors",
  "731": "Creativity & Connections",
  "742": "Wisdom & Strategy",
  "753": "Connections & Trials",
  "764": "Benefactors & Wisdom",
  "775": "Giving & Return",
  "786": "Responsibility & Challenge",
  "797": "Charisma & Confidence",
  "819": "Pressure & Responsibility",
  "821": "Pressure & Expression",
  "832": "Pressure & Emotion",
  "843": "Pressure & the Second-in-Command",
  "854": "Pressure & Vision",
  "865": "Wisdom & Pressure",
  "876": "Pressure & Opposite-Sex Support",
  "887": "Pressure & Emotional Management",
  "898": "Pressure & Power",
  "911": "Opportunity & Independence",
  "922": "Opportunity & Communication",
  "933": "Opportunity & Action",
  "944": "Planning & Opportunity",
  "955": "Direction & Stubbornness",
  "966": "Wisdom & Wealth",
  "977": "Connections & Opportunity",
  "988": "Opportunity & Pressure",
  "999": "Opportunity & Extremes"
};

// Simple reducer to single digit (1 to 9, maintaining 0 if input details allow, but strictly reduce to single digit)
export const reduceToOneDigit = (n: number): number => {
  let val = Math.abs(Math.floor(n));
  while (val > 9) {
    val = String(val)
      .split("")
      .reduce((acc, curr) => acc + Number(curr), 0);
  }
  return val;
};

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tri: TriangleData | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, tri }) => {
  // Handle escape key listener for standard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const archetypeNumber = tri ? tri.O : 7;
  const archetypeTitle = PERSONA_TITLES[String(archetypeNumber)] || "The Sage";
  const archetypeTeaser = PERSONA_TEASERS[String(archetypeNumber)] || "You hunt the pattern under the pattern, trust evidence, and speak only when it counts.";

  // Compute actual dynamic codes if tri is loaded
  const getCodeStr = (k1: keyof TriangleData, k2: keyof TriangleData, k3: keyof TriangleData) => {
    if (!tri) return "786"; // fallback mock
    return `${reduceToOneDigit(tri[k1])}${reduceToOneDigit(tri[k2])}${reduceToOneDigit(tri[k3])}`;
  };

  const earlyTriplets = ["IJM", "IMT", "JMS", "TSU"];
  const midTriplets = ["MNO", "MOP", "NOQ", "QPR"];
  const lateTriplets = ["KLN", "KNV", "LNW", "VWX"];

  const earlyCodes = tri ? [
    getCodeStr("I", "J", "M"),
    getCodeStr("I", "M", "T"),
    getCodeStr("J", "M", "S"),
    getCodeStr("T", "S", "U")
  ] : ["786", "911", "123", "234"];

  const midCodes = tri ? [
    getCodeStr("M", "N", "O"),
    getCodeStr("M", "O", "P"),
    getCodeStr("N", "O", "Q"),
    getCodeStr("Q", "P", "R")
  ] : ["345", "456", "567", "678"];

  const lateCodes = tri ? [
    getCodeStr("K", "L", "N"),
    getCodeStr("K", "N", "V"),
    getCodeStr("L", "N", "W"),
    getCodeStr("V", "W", "X")
  ] : ["112", "145", "167", "189"];

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl transition-all duration-300 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-[88%] sm:w-full max-w-[350px] sm:max-w-xl max-h-[68vh] sm:max-h-[85vh] overflow-y-auto overflow-x-hidden bg-[#09080e] border border-[#c5a880]/40 rounded-2xl sm:rounded-3xl md:p-8 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] transition-transform transform duration-300 scale-100 box-border mx-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-neutral-400 hover:text-white text-xl sm:text-3xl font-light focus:outline-none transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="text-center mb-3 sm:mb-6 pr-5 sm:pr-0">
          <h3 className="text-sm sm:text-xl font-serif tracking-wider text-[#ecebe7] mb-1 break-words">
            Your Personalized Report Structure
          </h3>
          <p className="text-[8px] sm:text-xs text-[#c5a880] font-mono tracking-widest uppercase">
            ✦ CALCULATED STRUCTURAL MAPPING FOR CODES ✦
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {/* Chapter 1 */}
          <div className="border-b border-neutral-900 pb-4 sm:pb-5 text-left w-full">
            <div className="flex justify-between items-start gap-2.5 mb-2 flex-wrap w-full">
              <span className="font-semibold text-xs sm:text-sm text-[#dedcd7] break-words max-w-[75%] sm:max-w-none">
                Chapter 1: Core Archetype — {archetypeTitle.startsWith("The ") ? archetypeTitle : `The ${archetypeTitle}`} (Number {archetypeNumber})
              </span>
              <span className="text-[10px] sm:text-[11px] text-red-400 bg-red-400/10 border border-red-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1 shrink-0">
                🔒 Locked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 italic mb-2 leading-relaxed break-words">
              {archetypeTeaser}
            </p>
            <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed break-words">
              [Contains: Career alignment, relationship psychology, shadow work & self-sabotage loops, destiny coordinates]
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="border-b border-neutral-900 pb-4 sm:pb-5 text-left w-full">
            <div className="flex justify-between items-start gap-2.5 mb-2 flex-wrap w-full">
              <span className="font-semibold text-xs sm:text-sm text-[#dedcd7] break-words">
                Chapter 2: Early Life-Phase (Ages 21–40)
              </span>
              <span className="text-[10px] sm:text-[11px] text-red-400 bg-red-400/10 border border-red-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1 shrink-0">
                🔒 Locked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mb-3 leading-relaxed break-words">
              Governed by your foundational development energy and early redirection codes.
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {earlyCodes.map((code, idx) => (
                <span key={idx} className="text-[11px] sm:text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono break-words">
                  {code} — {CODE_TITLES[code] || "Core Vibration"}
                </span>
              ))}
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="border-b border-neutral-900 pb-4 sm:pb-5 text-left w-full">
            <div className="flex justify-between items-start gap-2.5 mb-2 flex-wrap w-full">
              <span className="font-semibold text-xs sm:text-sm text-[#dedcd7] break-words">
                Chapter 3: Mid Life-Phase (Ages 41–60)
              </span>
              <span className="text-[10px] sm:text-[11px] text-red-400 bg-red-400/10 border border-red-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1 shrink-0">
                🔒 Locked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mb-3 leading-relaxed break-words">
              Governed by your career-peak, financial accumulation, and stability cycles.
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {midCodes.map((code, idx) => (
                <span key={idx} className="text-[11px] sm:text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono break-words">
                  {code} — {CODE_TITLES[code] || "Core Vibration"}
                </span>
              ))}
            </div>
          </div>

          {/* Chapter 4 */}
          <div className="border-b border-neutral-900 pb-1 text-left w-full">
            <div className="flex justify-between items-start gap-2.5 mb-2 flex-wrap w-full">
              <span className="font-semibold text-xs sm:text-sm text-[#dedcd7] break-words">
                Chapter 4: Late Life-Phase (Ages 61–80)
              </span>
              <span className="text-[10px] sm:text-[11px] text-red-400 bg-red-400/10 border border-red-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1 shrink-0">
                🔒 Locked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mb-3 leading-relaxed break-words">
              Governed by your harvest, wisdom sharing, and legacy completion blueprint.
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {lateCodes.map((code, idx) => (
                <span key={idx} className="text-[11px] sm:text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono break-words">
                  {code} — {CODE_TITLES[code] || "Core Vibration"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            className="w-full sm:w-auto px-5 py-2.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white rounded-xl transition-all duration-300 text-xs font-mono uppercase tracking-wider cursor-pointer"
            onClick={onClose}
          >
            Close Preview
          </button>
          <Link
            to="/pay"
            className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-[#dedcd7] transition-all duration-300 text-xs font-mono uppercase tracking-wider text-center shadow-lg cursor-pointer"
          >
            Reveal My Full Shadow & Gifts — $9.90
          </Link>
        </div>
      </div>
    </div>
  );
};
