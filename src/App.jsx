import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import DivePage from "./pages/Dive";

const BowlOfFishPage = lazy(() => import("./pages/BowlOfFish"));

const App = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<DivePage />} />
      <Route path="/BowlOfFish" element={<BowlOfFishPage />} />
    </Routes>
  </Suspense>
);

export default App;
