import React, { useEffect } from "react";
import { TriangleData } from "../types";

export const PERSONA_TITLES: Record<string, string> = {
  "1": "The Origin",
  "2": "The Mediator",
  "3": "The Muse",
  "4": "The Builder",
  "5": "The Voyager",
  "6": "The Healer",
  "7": "The Sage",
  "8": "The Power",
  "9": "The Empath"
};

export const PERSONA_TEASERS: Record<string, string> = {
  "1": "A born initiator with a clear North Star, you move first, decide fast, and set the weather for everyone else.",
  "2": "You read the room, soften conflict, and make connection feel like home.",
  "3": "You light up spaces with wit and bright ideas. Applause finds you easily; prosperity finds you when play marries practice...",
  "4": "You turn chaos into systems, deadlines into deliveries, and promises into ledgers.",
  "5": "You learn by living, persuade by experience, and blossom when horizons stay open.",
  "6": "You stabilize teams, beautify spaces, and keep promises long after the applause.",
  "7": "You hunt the pattern under the pattern, trust evidence, and speak only when it counts.",
  "8": "You orchestrate resources, hold pressure, and deliver outcomes with receipts.",
  "9": "You dream of a kinder world and move people through meaning."
};

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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all duration-300">
      <div 
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl md:p-8 p-6 shadow-2xl transition-transform transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-3xl font-light focus:outline-none transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-serif tracking-wider text-[#ecebe7] mb-1">
            Your Personalized Report Structure
          </h3>
          <p className="text-xs text-neutral-400 font-mono">
            CALCULATED STRUCTURAL MAPPING FOR CODES
          </p>
        </div>

        <div className="space-y-6">
          {/* Chapter 1 */}
          <div className="border-b border-neutral-900 pb-5 text-left">
            <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
              <span className="font-semibold text-sm text-[#dedcd7]">
                Chapter 1: Core Archetype — The {archetypeTitle} (Number {archetypeNumber})
              </span>
              <span className="text-[11px] text-red-400 bg-red-400/5 border border-red-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                🔒 Locked
              </span>
            </div>
            <p className="text-sm text-neutral-400 italic mb-2 leading-relaxed">
              {archetypeTeaser}
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              [Contains: Career alignment, relationship psychology, shadow work & self-sabotage loops, destiny coordinates]
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="border-b border-neutral-900 pb-5 text-left">
            <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
              <span className="font-semibold text-sm text-[#dedcd7]">
                Chapter 2: Early Life-Phase (Ages 21–40)
              </span>
              <span className="text-[11px] text-red-400 bg-red-400/5 border border-red-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                🔒 Locked
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-3 leading-relaxed">
              Governed by your foundational development energy and early redirection codes.
            </p>
            <div className="flex flex-wrap gap-2">
              {earlyCodes.map((code, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono">
                  {code} — {CODE_TITLES[code] || "Core Vibration"}
                </span>
              ))}
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="border-b border-neutral-900 pb-5 text-left">
            <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
              <span className="font-semibold text-sm text-[#dedcd7]">
                Chapter 3: Mid Life-Phase (Ages 41–60)
              </span>
              <span className="text-[11px] text-red-400 bg-red-400/5 border border-red-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                🔒 Locked
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-3 leading-relaxed">
              Governed by your career-peak, financial accumulation, and stability cycles.
            </p>
            <div className="flex flex-wrap gap-2">
              {midCodes.map((code, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono">
                  {code} — {CODE_TITLES[code] || "Core Vibration"}
                </span>
              ))}
            </div>
          </div>

          {/* Chapter 4 */}
          <div className="border-b border-neutral-900 pb-1 text-left">
            <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
              <span className="font-semibold text-sm text-[#dedcd7]">
                Chapter 4: Late Life-Phase (Ages 61–80)
              </span>
              <span className="text-[11px] text-red-400 bg-red-400/5 border border-red-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                🔒 Locked
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-3 leading-relaxed">
              Governed by your harvest, wisdom sharing, and legacy completion blueprint.
            </p>
            <div className="flex flex-wrap gap-2">
              {lateCodes.map((code, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono">
                  {code} — {CODE_TITLES[code] || "Core Vibration"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            className="px-6 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white rounded-xl transition-all duration-300 text-sm font-medium"
            onClick={onClose}
          >
            Close Structure Preview
          </button>
        </div>
      </div>
    </div>
  );
};
