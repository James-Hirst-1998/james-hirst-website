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
      <Footer></Footer>
    </shared.pageBackgroundDiv>
  );
}

export default CodingPage;
