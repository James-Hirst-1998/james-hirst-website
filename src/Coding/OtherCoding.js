import React from "react";
import * as shared from "../shared/styles";
import { useNavigate } from "react-router-dom";

const OtherCoding = React.forwardRef((props, ref) => {
    const navigate = useNavigate();

    const navTo = (page) => {
        navigate(page);
    };

    const changePointer = (e) => {
        e.target.style.cursor = "pointer"
    }

    return (
        <div style={{ padding: "20px 20px" }}>
            <shared.mainStyledDiv ref={ref} style={{ backgroundColor: "#adebeb", fontSize: "14px", maxWidth: "500px" }}>
                <h3>Other Experience</h3>
                <p>
                    Throughout university I completed several projects in MATLAB. I analysed
                    the gravitational radiation from black holes which were modelled as point masses and I produced
                    projections for the three body orbit problem.
                </p>
                <p>
                    I also really enjoy the game&nbsp;
                    <a href onMouseOver={changePointer} onClick={() => navTo("/coding/bowl_of_fish")}><i><u>'bowl of fish'</u></i></a>
                    &nbsp;so I have included a version of this for you to
                    play with your friends. If you do find a bug in it then email me and I will try
                    fix it ASAP.
                </p>
            </shared.mainStyledDiv>
        </div >
    )
})


export default OtherCoding