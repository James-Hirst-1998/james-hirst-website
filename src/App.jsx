import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DivePage from "./pages/Dive";
import { trackPageview } from "./analytics";

const BowlOfFishPage = lazy(() => import("./pages/BowlOfFish"));
const CreaturesPage = lazy(() => import("./pages/Creatures"));

// Sends a PostHog $pageview on the initial load and every client navigation.
const RouteAnalytics = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageview();
  }, [location.pathname]);
  return null;
};

const App = () => (
  <Suspense fallback={null}>
    <RouteAnalytics />
    <Routes>
      <Route path="/" element={<DivePage />} />
      <Route path="/BowlOfFish" element={<BowlOfFishPage />} />
      <Route path="/creatures" element={<CreaturesPage />} />
    </Routes>
  </Suspense>
);

export default App;
