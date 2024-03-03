import React from 'react';
import './personal.css';

const Personal = () => {
    return (
        <div className="personal">
            <div className="box skiing">
                <h2>Skiing</h2>
                <p>One of my passions is skiing <span role="img" aria-label="skiing">⛷️</span> and I completed a ski season working as a restaurant manager in Val D'isere in 2017/18. I spent my days enjoying the mountains and I created a 'short' <a href="https://www.youtube.com/watch?v=wZfKq0VAW_E">edit</a> to show some of the highlights of this adventure.</p>
            </div>
            <div className="box conservation">
                <h2>Conservation</h2>
                <p>I am hugely passionate about the environment and the natural world. I'm particularly invested in marine animals, having completed my PADI open water qualification. If you have any conservation opportunities please contact me as I would love to get involved.</p>
            </div>
        </div>
    );
}

export default Personal;