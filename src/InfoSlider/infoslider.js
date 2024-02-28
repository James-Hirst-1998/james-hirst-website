// InfoSlider.js
import React, { useState } from 'react';
import './infoslider.css';
import leftArrow from '../styles/angle-left-solid.svg';
import rightArrow from '../styles/angle-right-solid.svg';

const InfoSlider = ({ info, title }) => {
    const [currentInfo, setCurrentInfo] = useState(0);

    const handleArrowClick = (direction) => {
        if (direction === 'left') {
            setCurrentInfo(currentInfo === 0 ? info.length - 1 : currentInfo - 1);
        } else {
            setCurrentInfo(currentInfo === info.length - 1 ? 0 : currentInfo + 1);
        }
    };

    return (
        <div className="info-slider">
            <div className='title'>{title}</div>
            <div className="info-box">
                <img src={leftArrow} alt="Left arrow" onClick={() => handleArrowClick('left')} />
                <p>{info[currentInfo]}</p>
                <img src={rightArrow} alt="Right arrow" onClick={() => handleArrowClick('right')} />
            </div>
            <div className="circles">
                {info.map((_, index) => (
                    <div className={`circle ${currentInfo === index ? 'active' : ''}`} key={index} />
                ))}
            </div>
        </div>
    );
};

export default InfoSlider;