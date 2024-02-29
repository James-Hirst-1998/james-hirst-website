import React from 'react';
import '../InfoSlider/infoslider.css';

export const University = () => (
    <div className='info-content'>
        <div className="subtitle">Degree</div>
        <p>
            <strong>Masters:</strong>
            <ul>
                <li>MMath Mathematics Degree from Cambridge (2021-22)</li>
                <ul>
                    <li>Pass with Distinction (79%)</li>
                </ul>
            </ul>
            <strong>BA:</strong>
            <ul>
                <li>BA Mathematics Degree from Cambridge (2018-2021)</li>
                <ul>
                    <li>1st Class in third year (position: 14/222, percentage: 86%)</li>
                    <li>1st Class in second year and Jesus College Mathematics Award as I was the college top performer</li>
                    <li>1st Class in first year</li>
                </ul>
            </ul>
        </p>
        <p>
            <strong>Extras:</strong><br />
            During my four years at Jesus College, I was involved in college rugby, football, and lacrosse. I also captained the University Freestyle Team for the ski club (CUSSC) for two years. I was responsible for organising regular trips to snow domes and coordinating screenings of ski films. For this, I set up a partnership with the ski company <a href='https://factionskis.com/?gclid=EAIaIQobChMIjs3Y_4GY_QIVgdPtCh1NJggMEAAYASAAEgKrgfD_BwE'>Faction</a> to premiere a film which they had produced.
        </p>
    </div>
);

export const School = () => (
    <div className='info-content'>
        <div className="subtitle">School</div>
        <p>
            <strong>Grades</strong>
            <ul>
                <li>5 A*'s at A-Level in Mathematics, Further Mathematics, Additional Further Maths, Physics and Chemistry</li>
                <li>1 A in Economics AS Level</li>
                <li>14 A*'s and an A at GCSE</li>
            </ul>
        </p>
        <p>
            <strong>Extras:</strong><br />
            In my final year at Sixth Form, I served as Head Boy, representing the school in talks and assisting in event organization. I also led the Physics and Maths society, honing my presentation skills through regular research and discussion sessions. I was a member of the school rugby 1st XV, earning colours for my contributions to the team, and I represented the school in local and county level athletic events in the 800m.
        </p>
    </div>
);

export const CERN = () => (
    <div className='info-content'>
        <div className="subtitle">CERN</div>
        <p>
            I co-led a team to win a global physics competition, Beamline for Schools (<a href='https://beamlineforschools.cern/'>BL4S</a>). I organized a team of 17 students to design an experiment using a particle accelerator. Our winning prize was the opportunity to carry out our proposed experiment with CERN's third biggest particle accelerator. It aimed to validate Einstein's Theory of Special Relativity by measuring the time of flight of various particles and comparing the results to the calculated Lorentz factor predicted by the theory (spoiler, his theory is still correct!). We published a <a href="https://iopscience.iop.org/article/10.1088/1361-6552/aaccdb">paper</a> on our results and the overall experience in IOP Science.
        </p>
    </div>
);

export const Tutoring = () => (
    <div className='info-content'>
        <div className="subtitle">Tutoring</div>
        <p>
            I have tutored people of many ages in a variety of subjects. I have helped students with A-Level Maths, A-Level Physics, secondary school entrance exams and maths skills for an MBA. I also worked for Explore Learning in Colchester as a tutor during my gap year. I am open to taking on new students so please drop me an email if you are interested or would like to find out more.
        </p>
    </div>
);