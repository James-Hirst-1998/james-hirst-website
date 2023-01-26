import * as shared from "../shared/styles";
import myImage from '../Cropped_me.jpg';
import ScrollReveal from "scrollreveal";
import React from "react";

class Home extends React.Component {
  refs = React.createRef();
  componentDidMount() {
    ScrollReveal().reveal(this.refs.title,
      { delay: 0, origin: "left", distance: "100px", duration: 3000, easing: "ease" });
    ScrollReveal().reveal(this.refs.image_of_me,
      { delay: 200, origin: "top", distance: "100px", duration: 3500, easing: "ease" })
    ScrollReveal().reveal(this.refs.intro_para,
      { delay: 500, origin: "right", distance: "200px", duration: 2000, easing: "ease" })
    ScrollReveal().reveal(this.refs.conservation_para,
      { delay: 500, origin: "left", distance: "100px", duration: 2000, easing: "ease" })
    ScrollReveal().reveal(this.refs.contact_para,
      { delay: 500, origin: "right", distance: "100px", duration: 2000, easing: "ease" })


  }
  render() {
    return (
      <div className="Home" >
        <shared.pageHeader ref="title">
          𝔍𝔞𝔪𝔢𝔰 ℌ𝔦𝔯𝔰𝔱
        </shared.pageHeader>
        <div className="Section">

          <div class="container" style={{ display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
            <div class="child" style={{ padding: "0px 20px" }}>
              <img src={myImage} alt="" ref="image_of_me" style={{ height: "auto", maxHeight: "250px" }} />
            </div>

            <div className="Intro Para" class="child"
              style={{ padding: "0px 20px" }}>
              <shared.paraBody ref="intro_para"
                style={{ backgroundColor: "#F0FB8D", maxWidth: "400px" }}>
                Hi, my name is James Hirst and I am a 24 year old <b>Software Engineer </b>
                working at <b>Microsoft </b> in Enfield. I have coding experience
                in Javascript, Java, Python and I am currently working on Azure to
                manage telecommunication data for large telcos. Before working for Microsoft
                I gained my <b>Masters of Mathematics</b> at Jesus College, <b>Cambridge</b>.
                To find out more about my experience and qualifications please refer to my&nbsp;
                <a href="https://github.com/James-Hirst-1998/james-hirst-website/blob/Main/src/CV.pdf" target="_blank" rel="noreferrer">CV</a>.
              </shared.paraBody>
            </div>


            <div className="Conservation Coding Para"
              style={{ padding: "0px 20px" }}>
              <shared.paraBody ref="conservation_para"
                style={{ backgroundColor: "#F3B7F8" }}>
                I'm interested in coding for good, with a passion to aid conservation efforts and the environment.
                I am keen to use machine learning in the industry as I think this is relatively unexplored in the
                field. I contributed to a paper using Facebook's Detectron2 to delineate
                tree crowns in forest canopies from drone images. Then, I matched these to LiDAR images
                to give the average height of the detected crowns. This code is designed to be used in future projects
                to provide improved checks on forest health.
                To find out more about the paper please check it out:&nbsp;
                <a href="https://www.biorxiv.org/content/10.1101/2022.07.10.499480v1.full.pdf" target="_blank" rel="noreferrer">Tree Crown Delineation</a>.
              </shared.paraBody>
            </div>

            <div className="Contact Info Para"
              style={{ padding: "0px 20px" }}>
              <shared.paraBody ref="contact_para"
                style={{ backgroundColor: "#AEF5C9" }}>
                If you wish to <b>contact me</b> regarding opportunities please reach me at&nbsp;
                <a href="mailto:hirst.jj@googlemail.com">hirst.jj@googlemail.com</a>.
                <br></br>
                <br></br>
                This website is currently under construction and I hope to have it up and running
                soon with more details about my experience and interests.
              </shared.paraBody>
            </div>

          </div>
        </div>
      </div >
    );
  };
}

export default Home;
