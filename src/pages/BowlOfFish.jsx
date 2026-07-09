import React from 'react';
import { Link } from 'react-router-dom';
import BowlOfFish from '../Coding/BowlOfFish/Controller';
import './bowlOfFishPage.css';

const BowlOfFishPage = () => {
    return (
        <div className="bof-page-container">
            <Link to="/" className="home-button">
                Home
            </Link>
            <BowlOfFish />
        </div>
    );
}

export default BowlOfFishPage;