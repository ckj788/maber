import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Report = lazy(() => import("./pages/Report"));

// A subtle luxury dark loading placeholder matching the OMNIORA theme
const LoadingPlaceholder = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 select-none">
    <div className="w-6 h-6 rounded-full border border-white/20 animate-spin" style={{ borderTopColor: "#c5a880" }} />
    <span className="text-[10px] tracking-[0.3em] text-[#c5a880] uppercase font-mono">
      Initializing Axis...
    </span>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay" element={<Checkout />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Suspense>
  );
}
