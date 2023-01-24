import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CalculatorPage from "./pages/CalculatorPage";
import EducationPage from "./pages/EducationPage";
import CodingPage from "./pages/CodingPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact={true} path="/james-hirst-website" element={<App />} />
      <Route exact={true} path="/coding" element={<CodingPage />} />
      <Route exact={true} path="/education" element={<EducationPage />} />
      <Route
        exact={true}
        path="/coding/calculator"
        element={<CalculatorPage />}
      />
    </Routes>
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
