import React from "react";

const WinnerStatement = ({ winner }) => {
    if (winner) {
        return (
            <p className="bof-winner">
                <span role="img" aria-label="trophy">🏆</span> The winner is <b>{winner}</b>
            </p>
        );
    }
    return <p className="bof-winner">The game ended in a tie</p>;
};

const Complete = ({ winner, onExitClick }) => {
    return (
        <div className="bof-panel bof-panel--center">
            <p className="bof-kicker">Game over</p>
            <h2>That's the bowl emptied</h2>
            <WinnerStatement winner={winner} />
            <button className="bof-btn bof-btn--solid bof-btn--full" onClick={() => onExitClick()}>
                Play again
            </button>
        </div>
    );
};

export default Complete;
