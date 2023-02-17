import React from "react";
import Rules from "./Rules";
import Setup from "./Setup";
import { useState } from "react";


const GameState = {
    Rules: "rules",
    Settings: "settings",
    Playing: "playing"
}


const BowlOfFish = () => {
    const [currentGameState, setCurrentGameState] = useState(GameState.Rules);

    const onExitClick = () => {
        setCurrentGameState(GameState.Settings)
    }


    switch (currentGameState) {
        case GameState.Rules:
            return <Rules onExitClick={() => onExitClick()} />;
        case GameState.Settings:
            return <Setup />
        default:
            return <></>
    }
};

export default BowlOfFish