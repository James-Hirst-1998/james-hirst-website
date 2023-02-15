import * as shared from "../shared/styles";
import ScrollReveal from "scrollreveal";
import React from "react";
import University from "./University";
import School from "./School";

class Education extends React.Component {
    refs = React.createRef();
    componentDidMount() {
        ScrollReveal().reveal(this.refs.title,
            { delay: 100, origin: "left", distance: "100px", duration: 3000, easing: "ease" });
        ScrollReveal().reveal(this.refs.university,
            { delay: 50, origin: "top", distance: "100px", duration: 2500, easing: "ease" });
        ScrollReveal().reveal(this.refs.school,
            { delay: 0, origin: "right", distance: "100px", duration: 4000, easing: "ease" });
    }
    render() {
        return (
            <div className="Education" >
                <shared.pageHeader ref="title">
                    𝔈𝔡𝔲𝔠𝔞𝔱𝔦𝔬𝔫
                </shared.pageHeader>
                <div className="Uni info" style={{ display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                    <University ref={"university"}></University>
                    <School ref={"school"}></School>
                </div>


            </div >);
    };
};

export default Education