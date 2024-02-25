import * as shared from "../shared/styles";
import React from "react";

class UnderConstruction extends React.Component {
    render() {
        return (
            <div className="Construction" style={{ display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap", padding: "0px 10px 0px 10px" }}>
                <shared.paraBody ref="Construction"
                    style={{ backgroundColor: "#E65555", maxWidth: "400px" }}>
                    Sorry, this website is under construction and I hope to add more information
                    to this section soon. Please refer to my&nbsp;
                    <a href="https://github.com/James-Hirst-1998/james-hirst-website/blob/Main/src/CV.pdf" target="_blank" rel="noreferrer">CV</a>
                    &nbsp;if you are interested in finding out more about me.
                </shared.paraBody>
            </div>
        );
    };
};

export default UnderConstruction