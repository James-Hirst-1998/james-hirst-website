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
      <Footer></Footer>

    </shared.pageBackgroundDiv>
  );
}

export default EducationPage;
