import React from 'react';
import './personal.css';

const Personal = () => {
    return (
        <div className="personal">
            <div className="box skiing">
                <h2>Skiing</h2>
                <p>One of my passions is skiing <span role="img" aria-label="skiing">⛷️</span> and I completed a ski season working as a restaurant manager in Val D'isere in 2017/18. I spent my days enjoying the mountains and I created a 'short' <a href="https://www.youtube.com/watch?v=wZfKq0VAW_E">edit</a> to show some of the highlights of this adventure.</p>
            </div>
            <div className="box conversation">
                <h2>Conversation</h2>
                <p>I am hugely passionate about the environment and all animals. I'm particularly captivated by marine animals, having completed my PADI open water qualification. If you have any conversation opportunities please contact me as I would love to be involved.</p>
            </div>
        </div>
    );
}

export default Personal;