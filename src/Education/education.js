import React, { useState } from "react";
import { University, School, CERN, Tutoring } from "./info";
import "./education.css";

const Education = () => {
  const [activeSection, setActiveSection] = useState("university");
  const sections = {
    university: { title: "University", content: <University /> },
    school: { title: "School", content: <School /> },
    cern: { title: "CERN", content: <CERN /> },
    tutoring: { title: "Tutoring", content: <Tutoring /> },
  };

  return (
    <div className="education-container">
      <h1 className="title">Academics</h1>
      <div className="education-content">
        <nav className="education-nav">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              className={`nav-item ${activeSection === key ? "active" : ""}`}
              onClick={() => setActiveSection(key)}
            >
              {section.title}
            </button>
          ))}
        </nav>
        <div className="education-display">
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
};

export default Education;
