import React from "react";
import * as shared from "../shared/styles";

const Microsoft = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "20px 20px" }}>
            <shared.mainStyledDiv ref={ref} style={{ backgroundColor: "#ED7272", fontSize: "14px", maxWidth: "400px" }}>
                <h3>Microsoft</h3>
                <p>
                    I am currently working for Microsoft deploying a voicemail solution in Azure.
                    I have completed the Azure Fundamentals and Software Engineering Tracks to allow
                    me to manage the health and security of the containers and pods
                    in our solution. I also use python and rust to develop automation scripts that integrate with gitlab
                    pipelines and improve the ongoing management of our repositories.
                </p>
                <p>
                    I previously used Javascipt and Java to develop a communication
                    app which is sold to small businesses and integrates with users' phones.
                    Messaging, audio and video calls and voicemail were all features of the app. The front-end was
                    built using React and Redux, with the back-end using an OSGi Framework to deploy the bundles.
                </p>
            </shared.mainStyledDiv>
        </div >
    )
})


export default Microsoft