import React from "react";
import Rules from "./Rules";
import Setup from "./Setup";
import Game from "./Game";
import { useState } from "react";
import Complete from "./Complete";


const GameState = {
    Rules: "rules",
    Settings: "settings",
    Playing: "playing",
    Complete: "complete"
}


const BowlOfFish = () => {
    const [currentGameState, setCurrentGameState] = useState(GameState.Rules);
    const [gameSettings, setGameSettings] = useState({})
    const [winner, setWinner] = useState("")

    const onExitClick = () => {
        setCurrentGameState(GameState.Settings)
    }

    const gameComplete = () => {
        setCurrentGameState(GameState.Complete)
    }

    const onStartGameClick = (settings) => {
        setGameSettings(settings)
        setCurrentGameState(GameState.Playing)

    }

    switch (currentGameState) {
        case GameState.Rules:
            return <Rules onExitClick={() => onExitClick()} />;
        case GameState.Settings:
            return <Setup onStartGameClick={(settings) => onStartGameClick(settings)} />
        case GameState.Playing:
            return <Game gameSettings={gameSettings} setWinner={setWinner} onExitClick={() => onExitClick()} gameComplete={() => gameComplete()} />
        case GameState.Complete:
            return <Complete winner={winner} onExitClick={() => onExitClick()}></Complete>
        default:
            return <></>
    }
};

export default BowlOfFish