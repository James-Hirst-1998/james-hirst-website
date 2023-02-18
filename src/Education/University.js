import React from "react";
import * as shared from "../shared/styles";

const University = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "0px 20px" }}>
            <shared.paraBody ref={ref} style={{
                backgroundColor: "#cc0000",
                fontSize: "14px",
                maxWidth: "450px",
                color: "white",
                borderColor: "black"
            }}>
                <h2><u>University</u></h2>
                <h3>Grades</h3>
                <ul>
                    <li> <b>MMath Mathematics Degree from Cambridge</b> (2021-22)</li>
                    <ul type="circle">
                        <li> Pass with Distinction (79%)</li>
                    </ul>
                    <li> BA Mathematics Degree from Cambridge (2018-2021)</li>
                    <ul type="circle">
                        <li> 1st Class in third year (position: 14/222, percentage: 86%)</li>
                        <li> Jesus College Mathematics Award in second year for being top performer</li>
                    </ul>
                </ul>
                <h3> Interests</h3>
                <p>
                    During my four years at Jesus College I was involved in college rugby, football and lacrosse.
                    I also captained the University Freestyle Team for the ski club (CUSSC)
                    for two years. I was responsible for organising regular trips
                    to snow domes and coordinating screenings of ski films. For this I set up a partnership
                    with the ski company&nbsp;
                    <a href="https://factionskis.com/?gclid=EAIaIQobChMIjs3Y_4GY_QIVgdPtCh1NJggMEAAYASAAEgKrgfD_BwE" target="_blank" rel="noreferrer">Faction</a>
                    &nbsp;to premiere a film which they had produced.
                </p>
            </shared.paraBody>
        </div >
    )
})


export default University