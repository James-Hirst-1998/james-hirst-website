import React from "react";
import * as shared from "../shared/styles";

const School = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "0px 20px" }}>
            <shared.paraBody ref={ref} style={{ backgroundColor: "#BA55D3", fontSize: "13px", maxWidth: "500px" }}>
                <h2><u>School</u></h2>
                <h3>Grades</h3>
                <ul>
                    <li>
                        5 A*'s at A-Level in Mathematics, Further Mathematics, Additional Further Mathematics,
                        Physics and Chemistry
                    </li>
                    <li> 14 A*'s and an A at GCSE</li>
                </ul>
                <h3> Achievements</h3>
                <p>
                    While attending Colchester Royal Grammar School (CRGS 2010-2017) I co-lead a team to a global physics
                    competition called Beamline for Schools (BL4S). For the competition I organized 17 students to
                    design an experiment to do using a particle accelerator at CERN which we then were allowed to
                    complete as our prize. The experiment we proposed was to validate Einstien's Theory of Special
                    Relativity by measuring the time of flight of various particles and comparing the results to the
                    calculated Lorentz factor predicted by the theory. We published a paper in IOP Science on the results
                    found and the experience as a whole.
                </p>
                <p>
                    In my final year at Sixth Form I was Head Boy which meant I gave talks to represent the school and helped
                    organise school events such as open evenings. At this time I was also running Physics and Maths society which
                    aided my presentation skills as I regularly researched topics and relayed them at our meets. Sports wise I played
                    for the school first team and achieved colours for my services to the team, as well as representing the school at
                    local and county level athletic events by running the 800m.
                </p>
            </shared.paraBody>
        </div>
    )
})

export default School