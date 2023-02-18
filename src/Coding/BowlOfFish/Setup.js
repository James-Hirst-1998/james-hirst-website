import React from "react";
import * as shared from "../../shared/styles";

const timeSelectButton = (props) => {
    const value = props.value;
    return (
        <button>{value}</button>
    )
}


const Setup = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw"
        }}>
            <shared.paraBody style={{ borderStyle: "None", fontSize: "14px", maxWidth: "600px" }}>
                <h2>Game Settings</h2>
                <label for="Team 1">Team 1: </label>
                <input type="text" name="Team 1" placeholder="Knot Again..."></input>
                <br></br>
                <label for="Team 2">Team 2: </label>
                <input type="text" name="Team 2" placeholder="Reel Naturals..."></input>
                <p>
                    <timeSelectButton></timeSelectButton>
                    <button>45s</button>
                    <button>60s</button>
                </p>
            </shared.paraBody >
        </div >


    )
}



export default Setup