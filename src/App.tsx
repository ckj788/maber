import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Report = lazy(() => import("./pages/Report"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay" element={<Checkout />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Suspense>
  );
}
