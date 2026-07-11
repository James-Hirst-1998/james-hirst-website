import React from "react";
import { useState } from "react";

const minNumberOfWords = 10;
const maxNumberOfWords = 60;

const Setup = ({ onStartGameClick }) => {
    const [roundTime, setRoundTime] = useState(30);
    const [numberofRounds, setNumberOfRounds] = useState(3);
    const [listOfWords, setListOfWords] = useState([]);
    const [wordCount, setWordCount] = useState(0);
    const [input, setInput] = useState("");
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");

    const canAddWord = Boolean(input) && wordCount < maxNumberOfWords;
    const canStart = wordCount >= minNumberOfWords;

    const updateWords = () => {
        if (!canAddWord) return;
        if (!listOfWords.includes(input.toLowerCase())) {
            setWordCount(wordCount + 1);
            setListOfWords([...listOfWords, input.toLowerCase()]);
        }
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            updateWords();
        }
    };

    return (
        <div className="bof-panel">
            <div className="bof-panel__header">
                <div>
                    <p className="bof-kicker">Bowl of Fish</p>
                    <h2>Game settings</h2>
                </div>
            </div>

            <div className="bof-field">
                <label htmlFor="Team1">Team 1</label>
                <input
                    className="bof-input"
                    value={team1}
                    type="text"
                    id="Team1"
                    maxLength="20"
                    onChange={(e) => setTeam1(e.target.value)}
                    placeholder="Knot Again…"
                />
            </div>
            <div className="bof-field">
                <label htmlFor="Team2">Team 2</label>
                <input
                    className="bof-input"
                    value={team2}
                    type="text"
                    id="Team2"
                    maxLength="20"
                    onChange={(e) => setTeam2(e.target.value)}
                    placeholder="Reel Naturals…"
                />
            </div>

            <div className="bof-field">
                <label>Turn time</label>
                <div className="bof-toggle-row">
                    {[30, 45, 60].map((t) => (
                        <button
                            key={t}
                            className={`bof-toggle ${roundTime === t ? "is-active" : ""}`}
                            onClick={() => setRoundTime(t)}
                        >
                            {t}s
                        </button>
                    ))}
                </div>
            </div>

            <div className="bof-field">
                <label>Rounds</label>
                <div className="bof-toggle-row">
                    {[3, 4, 5].map((r) => (
                        <button
                            key={r}
                            className={`bof-toggle ${numberofRounds === r ? "is-active" : ""}`}
                            onClick={() => setNumberOfRounds(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bof-field">
                <label htmlFor="WordInput">
                    Words in the bowl
                    <span className="bof-field__count">
                        {wordCount} / {maxNumberOfWords}
                    </span>
                </label>
                <div className="bof-word-row">
                    <input
                        className="bof-input"
                        id="WordInput"
                        value={input}
                        type="text"
                        placeholder="Enter a word…"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="bof-btn" onClick={updateWords} disabled={!canAddWord}>
                        Add
                    </button>
                </div>
                {wordCount === maxNumberOfWords && (
                    <p className="bof-hint">You've hit the word limit - start the game!</p>
                )}
                {!canStart && (
                    <p className="bof-hint bof-hint--muted">
                        Add {minNumberOfWords - wordCount} more word{minNumberOfWords - wordCount === 1 ? "" : "s"} to start.
                    </p>
                )}
            </div>

            <button
                className="bof-btn bof-btn--solid bof-btn--full"
                disabled={!canStart}
                onClick={() =>
                    onStartGameClick({
                        Team1: team1 ? team1 : "Knot Again",
                        Team2: team2 ? team2 : "Reel Naturals",
                        time: roundTime,
                        rounds: numberofRounds,
                        words: listOfWords,
                    })
                }
            >
                Start game
            </button>
        </div>
    );
};

export default Setup;
