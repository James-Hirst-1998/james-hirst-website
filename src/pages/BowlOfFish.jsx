import React from 'react';
import { Link } from 'react-router-dom';
import BowlOfFish from '../Coding/BowlOfFish/Controller';
import './bowlOfFishPage.css';

// A fishbowl's worth of slowly rising bubbles, purely decorative.
const Bubbles = () => (
    <div className="bof-bubbles" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
            <span
                key={i}
                style={{
                    left: `${(i * 7.3 + 4) % 100}%`,
                    animationDelay: `${(i * 1.7) % 9}s`,
                    animationDuration: `${8 + (i % 5) * 2.2}s`,
                    width: `${6 + (i % 4) * 4}px`,
                    height: `${6 + (i % 4) * 4}px`,
                }}
            />
        ))}
    </div>
);

const BowlOfFishPage = () => {
    return (
        <div className="bof-page">
            <Bubbles />
            <header className="bof-header">
                <Link to="/" className="btn bof-home">
                    ← Back to the dive
                </Link>
            </header>
            <main className="bof-main">
                <BowlOfFish />
            </main>
        </div>
    );
}

export default BowlOfFishPage;
