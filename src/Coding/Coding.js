import * as shared from "../shared/styles";
import ScrollReveal from "scrollreveal";
import React from "react";
import UnderConstruction from "../shared/UnderConstruction";

class Coding extends React.Component {
    refs = React.createRef();
    componentDidMount() {
        ScrollReveal().reveal(this.refs.title,
            { delay: 100, origin: "left", distance: "100px", duration: 3000, easing: "ease" });
        ScrollReveal().reveal(this.refs.under_construction,
            { delay: 50, origin: "bottom", distance: "50px", duration: 2000, easing: "ease" });
    }
    render() {
        return (
            <div className="Coding" >
                <shared.pageHeader ref="title">
                    ℭ𝔬𝔡𝔦𝔫𝔤
                </shared.pageHeader>
                <div class="container" ref="under_construction">
                    <UnderConstruction></UnderConstruction>
                </div>
            </div>);
    };
};

export default Coding