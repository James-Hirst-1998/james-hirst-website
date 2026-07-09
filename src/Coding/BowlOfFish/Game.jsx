import { useCallback, useState } from "react";
import StopWatch from "./StopWatch";
import { useEffect } from "react";
import React from 'react';

const StartGameButton = ({ stopWatchState, setStopWatchState, handleStart }) => {
    const startClick = () => {
        setStopWatchState(StopWatchModes.Active)
        handleStart();
    }
    switch (stopWatchState) {
        case StopWatchModes.Reset:
            return <button className="bof-btn bof-btn--solid bof-btn--full" onClick={startClick}>Start turn</button>
        case StopWatchModes.Pause:
            return <button className="bof-btn bof-btn--solid bof-btn--full" onClick={startClick}>Resume turn</button>
        case StopWatchModes.Active:
            return <button className="bof-btn bof-btn--full" disabled={true}>Get guessing…</button>
        default:
            return null
    }
}

const StopWatchModes = {
    Active: "active",
    Pause: "pause",
    Reset: "reset"
}

const Game = ({ onExitClick, gameComplete, gameSettings, setWinner }) => {

    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [teamTurn, setTeamTurn] = useState(gameSettings.Team1);
    const [roundNumber, setRoundNumber] = useState(1);
    const [stopWatchState, setStopWatchState] = useState(StopWatchModes.Reset);

    const [currentWord, setCurrentWord] = useState("");
    const [needWord, setNeedWord] = useState(true);

    const [roundWordList, setRoundWordList] = useState(gameSettings.words)
    const [turnSkippedWords, setTurnSkippedWords] = useState([])

    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [pauseLogicHit, setPauseLogicHit] = useState(false); //ensures the pause logic can only be hit once
    const [time, setTime] = useState(gameSettings.time);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
        setPauseLogicHit(false)
        setStopWatchState(StopWatchModes.Active)
    };

    const handlePause = () => {
        setIsPaused(true);
        setStopWatchState(StopWatchModes.Pause)
    };

    const handleReset = useCallback(() => {
        setIsActive(false);
        setIsPaused(true);

        setRoundWordList((roundWordList) => [...roundWordList, ...turnSkippedWords])
        setTurnSkippedWords([])
        setTime(gameSettings.time);
        setStopWatchState(StopWatchModes.Reset)
        setTeamTurn(teamTurn === gameSettings.Team1 ? gameSettings.Team2 : gameSettings.Team1)
    }, [gameSettings.Team1, gameSettings.Team2, gameSettings.time, teamTurn, turnSkippedWords]);

    const correctClick = () => {
        if (stopWatchState === StopWatchModes.Active) {
            if (teamTurn === gameSettings.Team1) {
                setTeam1Score(team1Score + 1)
            }
            else {
                setTeam2Score(team2Score + 1)
            }

            if (turnSkippedWords.includes(currentWord)) {
                setTurnSkippedWords((turnSkippedWords) => turnSkippedWords.filter((word) => word !== currentWord))
            }
            if (roundWordList.includes(currentWord)) {
                setRoundWordList((roundWordList) => roundWordList.filter((word) => word !== currentWord))
            }
            setNeedWord(true)
            setCurrentWord("")
        }
    }

    const skippedClick = () => {
        if (stopWatchState === StopWatchModes.Active) {
            if (!turnSkippedWords.includes(currentWord)) {
                setTurnSkippedWords((turnSkippedWords) => [...turnSkippedWords, currentWord])
            }
            if (roundWordList.length > 0) {
                setRoundWordList((roundWordList) => roundWordList.filter((word) => word !== currentWord))
            }
            setCurrentWord("")
            getWord()
            setNeedWord(true)
        }
    }

    const getWord = useCallback(() => {
        if (stopWatchState === StopWatchModes.Active) {
            if (!currentWord) {
                if (roundWordList.length > 0) {
                    const newWord = roundWordList[Math.floor(roundWordList.length * Math.random())]
                    setCurrentWord(newWord)
                }
                else if (turnSkippedWords.length > 0) {
                    let newWord = turnSkippedWords[0]
                    setCurrentWord(newWord)
                    setTurnSkippedWords((turnSkippedWords) => turnSkippedWords.filter((word) => word !== newWord))
                    setRoundWordList([newWord])
                }
                else {
                    handlePause()
                    setRoundWordList(gameSettings.words)
                }
            }
        }
    }, [currentWord, gameSettings.words, roundWordList, stopWatchState, turnSkippedWords])


    const pauseLogic = useCallback(() => {
        if (!pauseLogicHit) {
            if (roundNumber === gameSettings.rounds) {
                team1Score > team2Score ? setWinner(gameSettings.Team1) :
                    team2Score > team1Score ? setWinner(gameSettings.Team2) : setWinner("")
                gameComplete()
            }
            else {
                setNeedWord(true)
                setRoundWordList(gameSettings.words)
                setRoundNumber((roundNumber) => roundNumber + 1)
            }
        }
        setPauseLogicHit(true)
    }, [gameComplete, gameSettings.Team1, gameSettings.Team2, gameSettings.rounds, gameSettings.words, pauseLogicHit, roundNumber, setWinner, team1Score, team2Score])


    useEffect(() => {
        switch (stopWatchState) {
            case (StopWatchModes.Reset):
                setNeedWord(true)
                setCurrentWord("")
                break;
            case (StopWatchModes.Pause):
                pauseLogic()
                break;
            case (StopWatchModes.Active):
                setNeedWord(true)
                break;
            default:
                return;
        }
    }, [stopWatchState,
        pauseLogic,
    ])

    useEffect(() => {
        if (stopWatchState === StopWatchModes.Active) {
            if (needWord === true && currentWord === "") {
                getWord()
                setNeedWord(false)
            }
        }
    }, [currentWord, getWord, needWord, stopWatchState])

    useEffect(() => {
        if (time <= 0) {
            handleReset();
        }
    }, [time, handleReset])

    const wordsLeft = turnSkippedWords.length + roundWordList.length;

    return (
        <div className="bof-panel">
            <div className="bof-panel__header">
                <div>
                    <p className="bof-kicker">Round {roundNumber} of {gameSettings.rounds}</p>
                    <h2>Bowl of Fish</h2>
                </div>
                <button className="bof-quit" onClick={() => onExitClick()}>Quit</button>
            </div>

            <div className="bof-scoreboard">
                <div className={`bof-team ${teamTurn === gameSettings.Team1 ? "is-up" : ""}`}>
                    <span className="bof-team__name">{gameSettings.Team1}</span>
                    <span className="bof-team__score">{team1Score}</span>
                </div>
                <div className={`bof-team ${teamTurn === gameSettings.Team2 ? "is-up" : ""}`}>
                    <span className="bof-team__name">{gameSettings.Team2}</span>
                    <span className="bof-team__score">{team2Score}</span>
                </div>
            </div>
            <p className="bof-turn">
                Up now: <b>{teamTurn}</b>
            </p>

            <StopWatch
                time={time}
                totalTime={gameSettings.time}
                stopWatchState={stopWatchState}
                isActive={isActive}
                isPaused={isPaused}
                setTime={setTime}
            ></StopWatch>

            <div className="bof-word">
                <span className="bof-word__label">Word</span>
                <span className="bof-word__value">{currentWord || "—"}</span>
                <span className="bof-word__left">{wordsLeft} left in the bowl</span>
            </div>

            <div className="bof-action-row">
                <button className="bof-btn bof-btn--correct" onClick={correctClick}>Correct</button>
                <button className="bof-btn bof-btn--skip" onClick={skippedClick}>Skip</button>
            </div>
            <StartGameButton
                stopWatchState={stopWatchState}
                setStopWatchState={setStopWatchState}
                handleStart={handleStart}></StartGameButton>
        </div>
    )
}

export default Game
