import React, { useState } from 'react';
import Intro from '../Intro/intro';
import Experience from '../Experience/experience';
import Skills from '../Skills/skills';
import Images from '../Images/images';
import Education from '../Education/education';
import Personal from '../Personal/personal';
import Footer from '../Footer/footer';
import '../styles/main.css';
import VisibilitySensor from 'react-visibility-sensor';

const HomePage = () => {
    const [isVisibleExperience, setIsVisibleExperience] = useState(false);
    const [isVisibleEducation, setIsVisibleEducation] = useState(false);
    const [isVisiblePersonal, setIsVisiblePersonal] = useState(false);

    return (
        <div>
            <div className='page-container'>
                <Intro />
                <VisibilitySensor
                    partialVisibility
                    offset={{ top: 1550 }}
                    active={!isVisibleExperience}
                    onChange={(isVisible) => setIsVisibleExperience(isVisible)}
                >
                    <div className={`fade-in-section ${isVisibleExperience ? 'is-visible' : ''}`}>
                        <Experience />
                        <Skills />
                        <Images />
                    </div>
                </VisibilitySensor>
                <VisibilitySensor
                    partialVisibility
                    offset={{ top: 50 }}
                    active={!isVisibleEducation}
                    onChange={(isVisible) => setIsVisibleEducation(isVisible)}
                >
                    <div className={`fade-in-section ${isVisibleEducation ? 'is-visible' : ''}`}>
                        <Education />
                    </div>
                </VisibilitySensor>
                <VisibilitySensor
                    partialVisibility
                    offset={{ top: 50 }}
                    active={!isVisiblePersonal}
                    onChange={(isVisible) => setIsVisiblePersonal(isVisible)}>
                    <div className={`fade-in-section ${isVisiblePersonal ? 'is-visible' : ''}`}>
                        <Personal />
                    </div>
                </VisibilitySensor>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;