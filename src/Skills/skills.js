import React from "react";
import "./skills.css";

const Skills = () => {
  return (
    <div className="skills-container">
      <div className="skills-grid">
        <div className="skills-column">
          <h2>Languages</h2>
          <ul>
            <li>Python</li>
            <li>Rust</li>
            <li>TypeScript</li>
            <li>React</li>
            <li>SQL</li>
          </ul>
        </div>
        <div className="skills-column">
          <h2>Cloud</h2>
          <ul>
            <li>Azure</li>
            <li>Kubernetes</li>
            <li>Terraform</li>
            <li>Docker</li>
            <li>CI integration</li>
          </ul>
        </div>
        <div className="skills-column">
          <h2>Other</h2>
          <ul>
            <li>Copilot</li>
            <li>Supabase</li>
            <li>TensorFlow</li>
            <li>Figma</li>
            <li>HTML/CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Skills;
