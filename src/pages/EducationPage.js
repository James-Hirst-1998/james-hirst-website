import Education from "../Education/Education";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";
import { Dimensions } from 'react-native';

const screenDimensions = Dimensions.get('window');

function EducationPage() {
  const FooterStyles = () => {

    console.log(screenDimensions)
    let positionValue = screenDimensions.height > 700 && screenDimensions.width > 700 ? "absolute" : "relative";
    return { position: positionValue, bottom: "0px", width: "100%" }
  }

  return (
    <shared.pageBackgroundDiv
      className="EducationPage">
      <NavBar></NavBar>
      <Education></Education>
      <div style={FooterStyles()}>
        <Footer></Footer>
      </div>
    </shared.pageBackgroundDiv>
  );
}

export default EducationPage;
