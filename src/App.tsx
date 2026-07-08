import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Report from "./pages/Report";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pay" element={<Checkout />} />
      <Route path="/report" element={<Report />} />
    </Routes>
  );
}
