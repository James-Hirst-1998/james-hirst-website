import React from "react";
import "./skills.css";

const Skills = () => {
  return (
    <div className="skills-container">
      <div className="skills-grid">
        <div className="skills-column">
          <h2>Coding</h2>
          <ul>
            <li>Python</li>
            <li>TypeScript / React</li>
            <li>Rust</li>
            <li>SQL</li>
            <li>Dart / Flutter</li>
            <li>HTML / CSS</li>
          </ul>
        </div>
        <div className="skills-column">
          <h2>Cloud & DevOps</h2>
          <ul>
            <li>Azure</li>
            <li>Kubernetes</li>
            <li>Terraform</li>
            <li>Docker</li>
            <li>GCP</li>
            <li>CI/CD</li>
          </ul>
        </div>
        <div className="skills-column">
          <h2>Tools & Platforms</h2>
          <ul>
            <li>Supabase</li>
            <li>Retool</li>
            <li>Figma</li>
            <li>ML Model Hosting</li>
            <li>FastAPI</li>
            <li>TensorFlow</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Skills;
