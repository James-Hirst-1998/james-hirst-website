import React from "react";
import * as shared from "../shared/styles";

const Detectree = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "0px 20px" }}>
            <shared.paraBody ref={ref} style={{ backgroundColor: "#99e699", fontSize: "14px", maxWidth: "550px" }}>
                <h3>Detectree Project</h3>
                <p>
                    I have done some <b>machine learning</b> to help gather results for a paper with
                    the Department of Plant Sciences at the University of Cambridge. This project used machine
                    learning techniques on drone image data of tree canopies to see how accurate it could be at delinating the tree crowns.
                    This in turn will give better estimates on carbon stored in forests than the current landmass estimates.
                    I conducted machine learning on a variety of different forest datasets and was using Facebook's Detectron2 to
                    complete the research. The published paper can be found at&nbsp;
                    <a href="https://www.biorxiv.org/content/10.1101/2022.07.10.499480v1.full.pdf" target="_blank" rel="noreferrer">Tree Crown Delineation</a>.
                </p>
                <p>
                    I also wrote python scripts for the project which:
                    <ul>
                        <li> automatically split up large drone images into training and testing data,</li>
                        <li> compared the manual delineated crowns to the generated ones and gave F1 scores,</li>
                        <li> reprojected the generated crowns to the geospatial coordinates to allow multiple sets to be overlaid on the original image, </li>
                        <li>
                            calculated the heights of the manual crowns using LiDAR data and used this to give a filtered F1 score
                            to see if the AI was better at predicting taller trees.
                        </li>
                    </ul>
                </p>
            </shared.paraBody>
        </div >
    )
})


export default Detectree