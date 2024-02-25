// Intro.js
import React from 'react';
import './intro.css';
import image from './cropped_me.jpg'; // Import the image

const Intro = () => {
    const handleEmail = () => {
        window.location.href = `mailto:hirst.jj@googlemail.com`;
    };

    const calculateAge = (birthDate) => {
        const dob = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="intro">
            <img src={image} alt="Me" />
            <div className="text">
                <div className="greeting">
                    <div className="hi">Hi,</div>
                    <div className="name">I'm James Hirst</div>
                </div>
                <div className="description">I’m a {calculateAge('1998-11-07')} year old Software Engineer working at Microsoft. I have a Masters of Mathematics from Jesus College, Cambridge. I'm passionate about the environment and conservation, and I'm always eager to discover new opportunities to make a positive impact.</div>
                <div className="buttons">
                    <button onClick={() => window.open('./CV.pdf', '_blank')}>CV</button>
                    <button onClick={handleEmail}>Contact Me</button>
                </div>
            </div>
        </div>
    );
}

export default Intro;