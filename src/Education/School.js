import React from "react";
import * as shared from "../shared/styles";

const School = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "20px 20px" }}>
            <shared.mainStyledDiv ref={ref} style={{
                backgroundColor: "#b300b3",
                fontSize: "14px",
                maxWidth: "500px",
                color: "white",
                borderColor: "black"
            }}>
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
                    While attending Colchester Royal Grammar School (CRGS 2010-2017) I co-lead a team to win a global physics
                    competition called Beamline for Schools
                    (<a href="https://beamlineforschools.cern/" style={{ color: "#fadaa5" }}
                        target="_blank" rel="noreferrer">BL4S</a>).
                    For the competition I organized 17 students to
                    design an experiment using a particle accelerator at CERN which we won the opportunity to
                    complete as our prize. The experiment we proposed was to validate Einstein's Theory of Special
                    Relativity by measuring the time of flight of various particles and comparing the results to the
                    calculated Lorentz factor predicted by the theory. We published a&nbsp;
                    <a href="https://iopscience.iop.org/article/10.1088/1361-6552/aaccdb"
                        style={{ color: "#fadaa5" }} target="_blank" rel="noreferrer">paper</a>
                    &nbsp;in IOP Science on the results and the experience as a whole.
                </p>
                <p>
                    In my final year at Sixth Form I was Head Boy. I gave talks to represent the school and helped
                    run events such as open evenings. At this time I also ran the Physics and Maths society which
                    aided my presentation skills as I regularly researched topics and relayed them in our meeting. I played
                    for the school rugby 1st XV and achieved colours for my services to the team, as well as representing the school at
                    local and county level athletic events in the 800m.
                </p>
            </shared.mainStyledDiv>
        </div>
    )
})

export default School