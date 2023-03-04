import * as shared from "../../shared/styles";
import * as bofStyles from "./styles";
import { useCallback, useState } from "react";
import StopWatch from "./StopWatch";
import { useEffect } from "react";



const Quitbutton = (props) => {
    const onExitClick = props.onExitClick;
    return (
        <bofStyles.gameQuitButton onClick={() => onExitClick()}>
            <b>Quit </b>
        </bofStyles.gameQuitButton>
    )
}

const StartGameButton = ({ stopWatchState, setStopWatchState, handleStart }) => {
    const startClick = () => {
        setStopWatchState(StopWatchModes.Active)
        handleStart();
    }
    switch (stopWatchState) {
        case StopWatchModes.Reset:
            return <bofStyles.startGameButton
                style={{ width: "300px" }}
                onClick={startClick}
            >Start Turn</bofStyles.startGameButton>
        case StopWatchModes.Pause:
            return <bofStyles.startGameButton
                style={{ width: "300px", backgroundColor: "#4287f5" }}
                onClick={startClick}
            > Resume Turn</bofStyles.startGameButton >
        case StopWatchModes.Active:
            return <bofStyles.activeGameButton disabled={true}
                style={{ width: "300px" }}
            >Get guessing</bofStyles.activeGameButton>
        default:
            <></>
    }
}

const StopWatchModes = {
    Active: "active",
    Pause: "pause",
    Reset: "reset"
}

const Game = ({ onExitClick, gameComplete, gameSettings, setWinner }) => {


    // const gameSettings = { rounds: 3, time: 30, words: ["james", "lara", "BOF"], Team1: "Me", Team2: "You" }

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


    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw"
        }}>
            <shared.mainStyledDiv style={{
                borderStyle: "None", fontSize: "17px", maxWidth: "600px", padding: "0px 0px 40px 0px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                }}>
                    <h2>Round {roundNumber} of {gameSettings.rounds}</h2>
                    <Quitbutton style={{ marginLeft: "auto" }} onExitClick={onExitClick}></Quitbutton>
                </div>
                <table style={{ borderCollapse: "collapse" }}>
                    <tr>
                        <th style={{ textAlign: "center", border: "1px solid black", minWidth: "150px" }}>{gameSettings.Team1}</th>
                        <th style={{ textAlign: "center", border: "1px solid black", minWidth: "150px" }}>{gameSettings.Team2}</th>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "center", border: "1px solid black" }}>{team1Score}</th>
                        <th style={{ textAlign: "center", border: "1px solid black" }}>{team2Score}</th>
                    </tr>
                </table>
                <h3>Turn: {teamTurn}</h3>
                <StopWatch
                    time={time}
                    stopWatchState={stopWatchState}
                    isActive={isActive}
                    isPaused={isPaused}
                    setTime={setTime}
                ></StopWatch>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                }}>
                    Word: {currentWord}
                    <div style={{ float: "right" }}>
                        Left: {turnSkippedWords.length + roundWordList.length}
                    </div>

                </div>
                <p>
                    <bofStyles.correctButton onClick={correctClick}>Correct</bofStyles.correctButton>
                    <bofStyles.skipButton onClick={skippedClick}>Skip</bofStyles.skipButton>
                </p>
                <p>
                    <StartGameButton
                        stopWatchState={stopWatchState}
                        setStopWatchState={setStopWatchState}
                        handleStart={handleStart}></StartGameButton>
                </p>
            </shared.mainStyledDiv >
        </div >
    )
}



export default Game