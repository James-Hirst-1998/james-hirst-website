import Education from "../Education/Education";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";

function EducationPage() {
  return (
    <shared.pageBackgroundDiv
      className="EducationPage">
      <NavBar></NavBar>
      <Education></Education>
      <div style={{ position: "fixed", bottom: "0px", width: "100%" }}>
        <Footer></Footer>
      </div>
    </shared.pageBackgroundDiv>
  );
}

export default EducationPage;
