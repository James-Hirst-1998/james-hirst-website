import Coding from "../Coding/Coding";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";
import { Dimensions } from 'react-native';
const screenDimensions = Dimensions.get('window');
const footerStyles = () => {
  console.log(screenDimensions)
  let positionValue = screenDimensions.height > 700 && screenDimensions.width > 700 ? "absolute" : "relative";
  return { position: positionValue, bottom: "0px", width: "100%" }
}


function CodingPage() {
  return (
    <shared.pageBackgroundDiv
      className="CodingPage"
    >
      <NavBar></NavBar>

      <Coding></Coding>

      <div style={footerStyles()}>
        <Footer></Footer>
      </div>
    </shared.pageBackgroundDiv>
  );
}

export default CodingPage;
