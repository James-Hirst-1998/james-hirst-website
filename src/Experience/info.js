// Info1.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../InfoSlider/infoslider.css';

export const Microsoft = () => (
    <div className='info-content'>
        <div className="subtitle">Microsoft</div>
        <p>I work on implementing a highly reliable voicemail solution in Azure, achieving five 9s (99.999%) uptime, which translates to less than 5 minutes of downtime per year. I use Kubernetes for resource management and interact with popular tools such as Grafana, Prometheus, and Terraform. I spearhead initiatives to reduce the ongoing costs of the product and I have designed and currently maintain a security bot to combat security threats.</p>
        <p>Other experiences:</p>
        <ul>
            <li>Copilot champ, educating other engineers on features and best practices</li>
            <li>End to end testing in QA</li>
            <li>Redesigning CI and solution architecture</li>
            <li>Scrum master for a team of 10 people</li>
            <li>Maintaining a message app using React front-end and java back-end</li>
        </ul>
    </div>
);

export const Cambridge = () => (
    <div className='info-content'>
        <div className="subtitle">Cambridge</div>
        <p>
            I applied machine learning techniques on a study with the Plant Science department at the University of Cambridge to improve forest carbon storage estimates. I utilised Facebook's Detectron2 model on diverse forest datasets to delineate tree crowns from drone images. The results were published in the paper <a href="https://www.biorxiv.org/content/10.1101/2022.07.10.499480v1.full.pdf">Tree Crown Delineation</a> and enhance current landmass-based methods.
        </p>
        <p>
            I also developed Python scripts to:
        </p>
        <ul>
            <li>Partition drone images into training and testing sets</li>
            <li>Compare manually and AI-delineated crowns, providing F1 scores</li>
            <li>Use LiDAR data to calculate crown heights and filter F1 scores for tall tree prediction accuracy</li>
        </ul>
    </div >
);

export const SharkTrust = () => (
    <div className='info-content'>
        <div className="subtitle">Shark Trust</div>
        <p>
            As a passionate conservationist, I volunteer my technical skills to aid environmental protection. I completed a project using Convolutional Neural Networks (CNNs) to automate shark species identification from eggcases, contributing to the <a href="https://www.sharktrust.org/greateggcasehunt">Great Eggcase Hunt</a> by the Shark Trust.
        </p>
        <p>
            My role involves data collection, data cleaning and model training. Despite being in its infancy, the project has had good results. We aim to integrate this model into the app for efficient image classification, facilitating global expansion while maintaining manageable workloads for the Trust.
        </p>
    </div>
);

export const Personal = () => (
    <div className='info-content'>
        <div className="subtitle">Personal Projects</div>
        <p>
            During my university years, I undertook several projects using MATLAB. I analyzed gravitational radiation from black holes modeled as point masses and produced projections for the three-body orbit problem.
        </p>
        <p>
            I'm also a fan of the game <Link to="/BowlOfFish">Bowl of Fish</Link>, and I have included a version here which you can test out and play around with. If you encounter any bugs, feel free to email me and I'll address them promptly.
        </p>
        <p>
            As a testament to my interest in front-end development and React, I built this website from scratch. I hope you enjoy it!
        </p>
    </div>
);
