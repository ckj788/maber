import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { usePostHog } from "@posthog/react";

const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Report = lazy(() => import("./pages/Report"));

// Automatically capture pageviews on React Router route changes
function PostHogPageviewTracker() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: location.pathname,
      });
    }
  }, [location, posthog]);

  return null;
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <PostHogPageviewTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay" element={<Checkout />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Suspense>
  );
}
