import React from "react";
import * as shared from "../shared/styles";

const Microsoft = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "0px 20px" }}>
            <shared.paraBody ref={ref} style={{ backgroundColor: "#ED7272", fontSize: "14px", maxWidth: "400px" }}>
                <h3>Microsoft</h3>
                <p>
                    I am currently working for Microsoft deploying a voicemail solution in Azure.
                    I have completed the Azure Fundamentals and Software Engineering Tracks to allow
                    me to manage the health and security of the containers and pods
                    in our solution. I also use python to develop automation scripts that integrate with gitlab
                    pipelines and improve the ongoing management of our repositories.
                </p>
                <p>
                    Previously, I was using Javascipt and Java to develop a communication
                    app which is sold to small businesses and integrates with users phones. The app included
                    functionality such as messaging, audio and video calls and voicemail. The front-end was
                    built using React and Redux, with the back-end using an OSGi Framework to deploy the bundles.
                </p>
            </shared.paraBody>
        </div >
    )
})


export default Microsoft