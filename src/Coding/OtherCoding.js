import React from "react";
import * as shared from "../shared/styles";
import { useNavigate } from "react-router-dom";

const OtherCoding = React.forwardRef((props, ref) => {
    const navigate = useNavigate();

    const navTo = (page) => {
        navigate(page);
    };
    return (
        <div style={{ padding: "0px 20px" }}>
            <shared.paraBody ref={ref} style={{ backgroundColor: "#adebeb", fontSize: "13px", maxWidth: "500px" }}>
                <h3>Other Experience</h3>
                <p>
                    Throughout university I completed several projects in MATLAB which included analysing
                    the gravitation radiation from black holes which were modelled as point masses and producing
                    projections for the three body orbit problem.
                </p>
                <p>
                    I also really enjoy the game&nbsp;
                    <a href onClick={() => navTo("/coding/bowl_of_fish")}><i><u>'bowl of fish'</u></i></a>
                    &nbsp;so I have included a version of this for you to
                    play with your friends. If you do find a bug in it then email me and I will try
                    fix it ASAP.
                </p>
            </shared.paraBody>
        </div >
    )
})


export default OtherCoding