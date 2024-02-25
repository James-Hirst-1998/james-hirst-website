import React from 'react';
import { Link } from 'react-router-dom';
import BowlOfFish from '../Coding/BowlOfFish/Controller';

const BowlOfFishPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Link to="/" style={{ marginBottom: '20px' }}>
                Home
            </Link>
            <BowlOfFish />
        </div>
    );
}

export default BowlOfFishPage;