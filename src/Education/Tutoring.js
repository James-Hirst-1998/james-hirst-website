import React from "react";
import * as shared from "../shared/styles";

const Tutoring = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "0px 20px 20px 20px" }}>
            <shared.paraBody ref={ref} style={{
                backgroundColor: "#e6b800",
                fontSize: "14px",
                maxWidth: "450px",
                color: "white",
                borderColor: "black"
            }}>
                <h2><u>Tutoring</u></h2>
                <p>
                    I have tutored many people at different stages of life and in a variety of subjects.
                    I have helped students with A-Level Maths, A-Level Physics, secondary school entrance exams and maths skills
                    for an MBA. I also worked for Explore Learning in Colchester as a tutor during my
                    gap year. I am open to taking on new students so please drop me an email if you are interested or would like
                    to find out more.
                </p>
            </shared.paraBody>

        </div >
    )
})


export default Tutoring