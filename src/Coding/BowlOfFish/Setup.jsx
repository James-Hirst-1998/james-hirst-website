import React from "react";
import { useState, useEffect } from "react";
import * as bofStyles from "./styles"

const GameStartButton = (props) => {
    const onStartGameClick = props.onStartGameClick;
    const settings = props.settings;

    return (
        <bofStyles.startGameButton id="StartGameButton"
            onClick={() => onStartGameClick(settings)} style={{ width: "230px" }}>
            Start Game
        </bofStyles.startGameButton>
    )
}


const Setup = ({ onStartGameClick }) => {
    const [roundTime, setRoundTime] = useState(30);
    const [numberofRounds, setNumberOfRounds] = useState(3);
    const [listOfWords, setListOfWords] = useState([]);
    const [wordCount, setWordCount] = useState(0);
    const [input, setInput] = useState("");
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");
    const minNumberOfWords = 10;
    const maxNumberOfWords = 60;


    useEffect(() => {
        if (!input || wordCount === maxNumberOfWords) {
            document.getElementById("AddWordButton").disabled = true;
        }
        else {
            document.getElementById("AddWordButton").disabled = false;
        }

        if (wordCount < minNumberOfWords) {
            document.getElementById("StartGameButton").disabled = true;
        }
        else {
            document.getElementById("StartGameButton").disabled = false;
        }
    })

    const updateWords = () => {
        if (listOfWords.includes(input)) {
        }
        else {
            setWordCount(wordCount + 1)
            setListOfWords([...listOfWords, input.toLowerCase()])
        }
        setInput("")
    }

    const handleWordChange = e => {
        setInput(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            updateWords()
        }
    }

    const handleTeamChange = e => {
        e.target.id === "Team1" ? setTeam1(e.target.value) : setTeam2(e.target.value)
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw"
        }}>
            <bofStyles.mainStyledDiv className="setup" style={{
                borderStyle: "None", fontSize: "17px", maxWidth: "300px", padding: "0px 0px 40px 0px"
            }}>
                <h2>Game Settings</h2>
                <label for="Team 1">Team 1: </label>
                <input value={team1} type="text" id="Team1" maxLength="20" onChange={handleTeamChange} placeholder="Knot Again..."></input>
                <br></br>
                <label for="Team 2">Team 2: </label>
                <input value={team2} type="text" id="Team2" maxLength="20" onChange={handleTeamChange} placeholder="Reel Naturals..."></input>
                <p>
                    Turn Time:&nbsp; {roundTime}s
                    <br></br>
                    <bofStyles.settingsToggleButton onClick={() => setRoundTime(30)}>30s</bofStyles.settingsToggleButton>
                    <bofStyles.settingsToggleButton onClick={() => setRoundTime(45)}>45s</bofStyles.settingsToggleButton>
                    <bofStyles.settingsToggleButton onClick={() => setRoundTime(60)}>60s</bofStyles.settingsToggleButton>
                </p>
                <p>
                    Number of Rounds:&nbsp; {numberofRounds}
                    <br></br>
                    <bofStyles.settingsToggleButton onClick={() => setNumberOfRounds(3)}>3</bofStyles.settingsToggleButton>
                    <bofStyles.settingsToggleButton onClick={() => setNumberOfRounds(4)}>4</bofStyles.settingsToggleButton>
                    <bofStyles.settingsToggleButton onClick={() => setNumberOfRounds(5)}>5</bofStyles.settingsToggleButton>

                </p>
                <p>
                    Words:&nbsp;
                    <input value={input} type="text" placeholder="Enter word..." onChange={handleWordChange} onKeyDown={handleKeyDown} />
                </p>
                <p>
                    <bofStyles.addWordButton id="AddWordButton" onClick={() => updateWords()}>Add Word</bofStyles.addWordButton>&nbsp;
                    Word count:&nbsp; {wordCount}
                    <br />
                    {wordCount === maxNumberOfWords &&
                        <div style={{ fontSize: "12px", color: "red" }}>You've hit the word limit! Start the game.</div>
                    }
                </p>
                <p>
                    <GameStartButton
                        onStartGameClick={onStartGameClick}
                        settings={{
                            Team1: team1 ? team1 : "Knot Again",
                            Team2: team2 ? team2 : "Reel Naturals",
                            time: roundTime,
                            rounds: numberofRounds,
                            words: listOfWords
                        }}
                    ></GameStartButton>
                </p>
            </bofStyles.mainStyledDiv >
        </div >


    )
}



export default Setup