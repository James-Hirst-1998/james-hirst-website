// Info1.js
import React from "react";
import { Link } from "react-router-dom";
import "../InfoSlider/infoslider.css";

export const Mozaic = () => (
  <div className="info-content">
    <div className="subtitle">Mozaic Earth</div>
    <p>
      I am a founding engineer at&nbsp;
      <a href="https://www.mozaic.earth/">Mozaic Earth</a>, an early-stage
      startup building a platform that enables anyone with a mobile phone to
      collect biodiversity data through our intuitive app. This data is then
      interpreted by ecologist on our web platform who are super-charged by our
      AI tools. We're gaining momentum quickly, which you can follow on
      our&nbsp;
      <a href="https://www.linkedin.com/company/mozaicearth/posts/?feedView=all">
        LinkedIn.
      </a>
    </p>
    <p>My responsibilities:</p>
    <ul>
      <li>
        Architecting and managing the Supabase database, including functions,
        triggers, and edge functions
      </li>
      <li>
        Leading the design and development of the web platform, including
        overseeing a small team to define, scope, and review work
      </li>
      <li>
        Owning all AI initiatives—building models and data pipelines, and
        researching new technologies
      </li>
      <li>
        Delivering full-stack features across Figma, Supabase, React (web),
        Flutter (mobile), and Retool (internal tools)
      </li>
      <li>
        Collaborating with clients on project delivery and producing
        insight-rich reports using custom SQL workflows
      </li>
    </ul>
  </div>
);

export const Microsoft = () => (
  <div className="info-content">
    <div className="subtitle">Microsoft</div>
    <p>
      I developed a Rust based solution for configuration translation to be used
      in a session border controller at the edge of telco networks. It included
      an extensive testing framework that had automated mechanisms for
      overwriting the test cases expected output as the translation expands.
      Prior to that, I worked on implementing a highly reliable voicemail
      solution in Azure. I used Kubernetes for resource management and
      interacted with popular tools such as Grafana, Prometheus, and Terraform.
      I also spearheaded initiatives to reduce the ongoing costs of the product
      and designed and owned a security bot to combat threats.
    </p>
    <p>Other experiences:</p>
    <ul>
      <li>
        GitHub Copilot Champion, educating other engineers on features and best
        practices
      </li>
      <li>Redesigning CI and solution architecture</li>
      <li>Scrum master for a team of 10 people</li>
      <li>Maintaining a message app using React front-end and java back-end</li>
      <li>
        Running a sustainability series, personally giving talks on fishing and
        carbon removal companies
      </li>
    </ul>
  </div>
);

export const Cambridge = () => (
  <div className="info-content">
    <div className="subtitle">Cambridge</div>
    <p>
      I applied machine learning techniques on a study with the Plant Science
      department at the University of Cambridge to improve forest carbon storage
      estimates. I utilised Facebook's Detectron2 model on diverse forest
      datasets to delineate tree crowns from drone images. The results were
      published in the paper{" "}
      <a href="https://www.biorxiv.org/content/10.1101/2022.07.10.499480v1.full.pdf">
        Tree Crown Delineation
      </a>{" "}
      and enhance current landmass-based methods.
    </p>
    <p>I also developed Python scripts to:</p>
    <ul>
      <li>Partition drone images into training and testing sets</li>
      <li>Compare manually and AI-delineated crowns, providing F1 scores</li>
      <li>
        Use LiDAR data to calculate crown heights and filter F1 scores for tall
        tree prediction accuracy
      </li>
    </ul>
  </div>
);

export const SharkTrust = () => (
  <div className="info-content">
    <div className="subtitle">Shark Trust</div>
    <p>
      As a passionate conservationist, I volunteer my technical skills to aid
      environmental protection. I am doing a project using Convolutional Neural
      Networks (CNNs) to automate shark and ray species classification from
      eggcases, contributing to the{" "}
      <a href="https://www.sharktrust.org/greateggcasehunt">
        Great Eggcase Hunt
      </a>{" "}
      by the Shark Trust.
    </p>
    <p>
      My role involves model training, data collection and data cleaning.
      Despite being in its infancy, the project has had good results. We aim to
      integrate this model into the app for efficient image classification,
      facilitating global expansion while maintaining manageable workloads for
      the Trust.
    </p>
  </div>
);

export const Personal = () => (
  <div className="info-content">
    <div className="subtitle">Personal Projects</div>
    <p>
      During my university years, I undertook several projects using MATLAB. I
      analyzed gravitational radiation from black holes modeled as point masses
      and produced projections for the three-body orbit problem.
    </p>
    <p>
      I'm also a fan of the game <Link to="/BowlOfFish">Bowl of Fish</Link>, and
      I have included a version here which you can test out and play around
      with. If you encounter any bugs, feel free to email me and I'll address
      them promptly.
    </p>
    <p>
      As a testament to my interest in front-end development and React, I built
      this website from scratch. I hope you enjoy it!
    </p>
  </div>
);
