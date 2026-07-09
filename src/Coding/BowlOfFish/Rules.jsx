import React from "react";

const Rules = ({ onExitClick }) => {
    return (
        <div className="bof-panel bof-panel--wide">
            <div className="bof-panel__header">
                <div>
                    <p className="bof-kicker">The seabed arcade</p>
                    <h2>How to play</h2>
                </div>
                <button className="bof-close" onClick={() => onExitClick()} aria-label="Close rules">
                    ×
                </button>
            </div>
            <p>
                Bowl of Fish is a fast-paced team guessing game which relies on how well you can describe, act,
                and remember the words that come up. A typical game lasts around one hour but times may vary
                depending on how many words you choose and how good you are at guessing. You'll need at least 4 players,
                divided into equal size teams (if possible).
            </p>
            <p>
                Each player is allowed to choose an equal number of words to put into the bowl. If a player tries to add a word
                to the bowl that is already in there it will not be added. A round consists
                of all the words being guessed correctly from the bowl and after it is completed all the words go back into
                the bowl for the next round (so if you remember what they are it makes the next round easier). A
                turn in a round consists of one member completing the round theme to try and get their team to guess the word
                they have. If the team guesses a word correctly the player gets a new word and this is repeated until their time is up.
                The round themes are:
            </p>
            <ol className="bof-rules-list">
                <li><b>Describe</b> — you can use any words (except the word you have) to try to get your team to guess</li>
                <li><b>Act</b> — try to act out the word this time</li>
                <li><b>Single word</b> — you can only use one word to hint at what your team needs to guess</li>
                <li><b>Be creative</b> — think of any theme you want</li>
            </ol>
            <p>
                During your turn you can skip as many times as you like, but any that you do skip will go back into the bowl at the
                end of your turn, so they will still be played in the current round.
            </p>
            <h3>Set up</h3>
            <p>
                Divide yourselves into two teams, then pass round the device and begin to enter the words that will be used
                in the game (note there are up to 60 words allowed so divide it equally between the players). The words can be
                whatever you like — dog, the Eiffel Tower, collywobbles… Remember at some point you
                may be the one describing the word, so maybe don't make them too unusual on your first game.
            </p>
            <p>
                Finally select your settings — the default values are 30 second turns and 3 rounds, but feel free to change it around.
                You'll need to input at least 10 words before you can start the game and there is a maximum of 60 allowed.
                Now close these instructions and go have some fun <span role="img" aria-label="smile">😊</span>
            </p>
            <button className="bof-btn bof-btn--solid bof-btn--full" onClick={() => onExitClick()}>
                Got it — set up the game
            </button>
        </div>
    );
};

export default Rules;
