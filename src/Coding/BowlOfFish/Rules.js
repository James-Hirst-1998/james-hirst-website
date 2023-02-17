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


const Rules = ({ onExitClick }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw"
        }}>
            <shared.paraBody style={{ backgroundColor: "#b3b3ff", fontSize: "14px", maxWidth: "600px" }}>
                <div className="Heading section" style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                }}>
                    <h2>How To Play</h2>
                    <Exitbutton style={{ marginLeft: "auto" }} onExitClick={onExitClick}></Exitbutton>
                </div>
                <p>
                    Bowl of fish is a fast-paced team guessing game which relies on how well you can describe, act,
                    and remember the words that come up. A typical game lasts around one hour but times may vary
                    depending on how many words you chose and how good you are at guessing.
                </p>
                <p>
                    Each player is allowed to choose an equal number of words to put into the bowl. A round consists
                    of all the words being guessed correctly from the bowl and then after it is complete all the words go back into
                    the bowl for the next round (so if you remember what they are it makes it easier next go round). A
                    turn in a round consists of one member completing the round theme to try get their team to guess the word
                    they have, if the team guesses the word currently they keep getting new words until their time is up. The
                    round themes are:
                    <ol>
                        <li> <b>Describe</b> - You can use any words (except the word you have) to try get your team to guess</li>
                        <li> <b>Act</b> - Try and act out the word this time</li>
                        <li> <b>Single Word</b> - You can only use one word to hint what you team need to guess</li>
                        <li> <b>Be creative</b> - Think of any theme you want</li>
                    </ol>
                    During you turn you can skip as many times as you like but any that you do skip will go back into the bowl at the
                    end of your turn so they will still be played in the current round.
                </p>
                <h3>Set up</h3>
                <p>
                    Divide yourselves into two teams, then pass round the device and begin to enter your words in that will be used
                    in the game (note there are up to 60 words allowed so divide it equally between the players). The words can be
                    whatever you like and examples include: dog, the eiffel tower, collywobbles, ... . Remember at some point you
                    may be the one describing the word so maybe don't make them too unusual on your first game.
                </p>
                <p>
                    Finally select your settings - the default values are 30 second turns and 3 rounds but feel free to change it around.
                    Now go and have some fun and play the game 😊
                </p>
            </shared.paraBody >
        </div >
    )
}



export default Rules