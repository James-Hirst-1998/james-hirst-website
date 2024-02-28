import React from 'react';
import './images.css';
import Microsoft from './Microsoft.png';
import Cambridge from './Cambridge.jpg';
import SharkTrust from './Shark_trust.jpg';

const Images = () => {
    return (
        <div className="images-container">
            <img src={Microsoft} alt="Microsoft" className="image" />
            <img src={Cambridge} alt="Cambridge" className="image" />
            <img src={SharkTrust} alt="Shark Trust" className="image" />
        </div>
    );
}

export default Images;