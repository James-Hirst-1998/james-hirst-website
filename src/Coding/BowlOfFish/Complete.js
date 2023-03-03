import React from "react";
import * as shared from "../../shared/styles";
import * as bofStyles from "./styles"

const Exitbutton = (props) => {
    const onExitClick = props.onExitClick;
    return (
        <bofStyles.rulesExitButton onClick={() => onExitClick()}>
            <b>x </b>
        </bofStyles.rulesExitButton>
    )
}

const WinnerStatement = ({ winner }) => {
    if (winner) {
        return <p>The winner is <b>{winner}</b></p>
    }
    else {
        return <p>The game ended a tie</p>
    }
}

const Complete = ({ winner, onExitClick }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            padding: "0px 0px 40px 0px"
        }}>
            <shared.mainStyledDiv style={{
                backgroundColor: "#b3b3ff", fontSize: "14px", maxWidth: "600px", minWidth: "200px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                }}>
                    Game Over
                    <Exitbutton style={{ marginLeft: "auto" }} onExitClick={onExitClick}></Exitbutton>
                </div>
                <br></br>
                <WinnerStatement winner={winner}></WinnerStatement>
            </shared.mainStyledDiv >
        </div >
    )
}



export default Complete