import React from "react";
import * as shared from "../shared/styles";

const Detectree = React.forwardRef((props, ref) => {
    return (
        <div style={{ padding: "0px 20px" }}>
            <shared.paraBody ref={ref} style={{ backgroundColor: "#F08080", fontSize: "13px", maxWidth: "500px" }}>
                Hello this is me
            </shared.paraBody>
        </div >
    )
})


export default Detectree