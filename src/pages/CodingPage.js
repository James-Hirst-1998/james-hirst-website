import Coding from "../Coding/Coding";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";


function CodingPage() {
  return (
    <shared.pageBackgroundDiv
      className="EducationPage"
    >
      <NavBar></NavBar>

      <Coding></Coding>

      <div style={{ position: "fixed", bottom: "0px", width: "100%" }}>
        <Footer></Footer>
      </div>
    </shared.pageBackgroundDiv>
  );
}

export default CodingPage;
